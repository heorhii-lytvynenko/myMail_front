	# Prompt for the myMail backend repository

	You are working in the Spring Boot myMail backend. Implement and test the following contract to synchronize with the frontend authentication/security fixes. Inspect the actual code and AGENTS.md first. Preserve working email/password login and registration. Do not commit, push, or deploy. Never log or print credentials, access/refresh tokens, authorization codes, PKCE verifiers, OAuth state values, or secret configuration. Make the implementation concrete; do not return only a plan.

	## Frontend behavior already implemented

	- Browser credentials go only to same-origin Next.js API routes. Next.js calls the backend over HTTPS.
	- The application access token lives in a host-only, Secure-in-production, HttpOnly, SameSite=Lax cookie named `mymail_session`.
	- Cookie Max-Age is the minimum of token `exp`, optional `expiresIn`, and eight hours. JWT payload decoding in Next.js is a lifetime hint only; the backend remains responsible for all token verification.
	- Missing/expired sessions require reauthentication. The frontend intentionally does not implement refresh against a guessed endpoint.
	- Every protected backend call forwards `Authorization: Bearer <application access token>` and uses no-store. The frontend never forwards application Bearer tokens to Google.
	- The old JavaScript-readable `access_token`/`refresh_token` mechanism was removed.
	- Google initiation now uses POST JSON, a browser/session-bound encrypted transaction cookie, and PKCE S256. The public backend callback is no longer the browser callback.
	- Google features remain disabled by default using `GOOGLE_INTEGRATION_ENABLED=false`. Backend logout calls remain disabled using `BACKEND_LOGOUT_ENABLED=false` until these contracts are deployed.

	## 1. Preserve and formalize authentication

	Retain:

	```http
	POST /api/authentication/login
	Content-Type: application/json

	{"email":"user@example.com","password":"original password"}
	```

	Return 200:

	```json
	{"accessToken":"<application JWT>","tokenType":"Bearer","expiresIn":3600}
	```

	`expiresIn` above is illustrative; return the actual remaining lifetime from Auth0, never a hardcoded duration. JWT `exp` must also be accurate. Next.js accepts current responses without `expiresIn` when the JWT has a valid future `exp`.

	Retain `POST /api/authentication/signIn` with the same credential body. Return 201 with the same token fields plus the existing `idpId`. The frontend removes confirmation before sending the body. Require at least eight password characters and the actual configured Auth0 password policy. Never trim or normalize passwords. Trim email whitespace, document the email casing/uniqueness policy, and apply it consistently.

	Retain `GET /api/users/me`, authenticated with the application Bearer token. Return exactly the supported user fields, including nonempty string `idpId` and valid string `email`. Verify issuer, signature, audience, expiration, and revocation/session state as appropriate. Return 401 for missing/invalid/expired sessions, 403 for an authenticated user denied access. Do not return successful placeholder users.

	Errors: 400 validation/registration rejection, 401 invalid credentials, 409 duplicate account, 429 throttled with a valid `Retry-After`, 5xx upstream/service failure. Use safe stable error codes and no raw Auth0 bodies. Add rate limits for login/registration/Google initiation where absent. Return `Cache-Control: no-store` on sensitive responses.

	## 2. Add application logout/invalidation

	```http
	POST /api/authentication/logout
	Authorization: Bearer <application access token>
	```

	Return 204 on successful invalidation. Make repeat logout safe. To claim immediate logout, ensure a copied application token is rejected by protected endpoints after logout: use a revocable application session, token denylist keyed by token/session identifier until expiry, or another tested equivalent. Do not claim that deleting a frontend cookie or revoking an unrelated refresh token invalidates an already issued access token.

	The frontend clears its cookie even if this call fails, with a three-second timeout. Document that network failures cannot guarantee server-side invalidation. Do not disconnect Gmail when the user logs out of myMail. Enable `BACKEND_LOGOUT_ENABLED=true` in the frontend only after this endpoint is deployed and tested.

	## 3. Replace Google initiation with a browser-safe PKCE contract

	```http
	POST /integrations/google/authorize
	Authorization: Bearer <application access token>
	Content-Type: application/json

	{
		"redirectUri":"https://my-mail-front.vercel.app/api/integrations/google/callback",
		"codeChallenge":"<base64url SHA-256 PKCE challenge>",
		"codeChallengeMethod":"S256"
	}
	```

	Return 200 JSON, not an HTTP redirect:

	```json
	{
		"authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth?...",
		"state":"<cryptographically random base64url state>",
		"expiresIn":600
	}
	```

	Requirements:

	- State uses at least 32 random bytes, encoded without base64url padding (43–128 characters). `expiresIn` is a positive integer no greater than 600 seconds.
	- Persist the authenticated application subject, exact approved redirect URI, PKCE challenge/method, expiry, and one-use transaction status together.
	- Reject unknown redirect URIs with exact allowlisting. Do not accept arbitrary URLs, wildcard Vercel domains, URL credentials, or untrusted Host-derived redirects.
	- The only requested scope is `https://www.googleapis.com/auth/gmail.readonly`. Use response_type=code, code_challenge_method=S256, the exact supplied challenge, exact supplied redirect_uri, returned state, configured Google client_id, and offline access. Request consent as needed to obtain a refresh token.
	- The authorization URL origin must be exactly `https://accounts.google.com`, path `/o/oauth2/v2/auth`, with each security parameter present once. The frontend checks state, redirect URI, scope, response type, and challenge against the transaction before navigation.
	- No application/Google token, client secret, or PKCE verifier belongs in this URL or response.
	- Starting a connection requires an application-authenticated request. User identity must come from the verified access token, never a request body user ID.

	The frontend generates the verifier, validates this response, and stores verifier/state/application-token binding/locale/expiry in an AES-256-GCM encrypted HttpOnly transaction cookie. Its cookie key stays on Vercel; the backend does not need it.

	## 4. Add authenticated Google completion

	Google's registered browser callback is now the Next.js endpoint:

	`https://my-mail-front.vercel.app/api/integrations/google/callback`

	Next.js validates the transaction cookie, exact state, expiry, current application session binding, cancellation, and duplicate parameters before sending:

	```http
	POST /integrations/google/complete
	Authorization: Bearer <application access token>
	Content-Type: application/json

	{
		"code":"<Google authorization code>",
		"state":"<transaction state>",
		"codeVerifier":"<43-character base64url verifier>",
		"redirectUri":"https://my-mail-front.vercel.app/api/integrations/google/callback"
	}
	```

	Before exchanging the code, require the same authenticated subject as initiation; verify state expiry, exact redirect URI, SHA-256 verifier/challenge match, and transaction freshness. Atomically claim/consume the transaction so concurrent requests cannot exchange or attach twice. Never use a state lookup alone to select an account without authenticated ownership verification.

	Exchange with Google using the original redirect URI and `code_verifier`, plus confidential client credentials server-side. Verify granted scopes. If reconnect returns no refresh token, retain a valid existing refresh token rather than overwrite it with null. Associate the Google account with the verified initiating application user. Make reconnection update the existing account without duplicate rows, using suitable database uniqueness constraints.

	Return 200 only after successful persistence:

	```json
	{
		"status":"connected",
		"email":"gmail-user@example.com",
		"scopes":["https://www.googleapis.com/auth/gmail.readonly"]
	}
	```

	Return 400 for invalid/expired/replayed state, PKCE mismatch, bad callback or denied scopes; 401 for invalid application sessions; 403 for an authenticated ownership mismatch; safe 5xx for provider failure. Never return Google credentials.

	Google denial is handled by Next.js before completion and returns the user to the account page. Transactions abandoned by cancellation must expire and be cleaned up. The browser never exchanges tokens directly.

	**Close the old bypass:** retire or return 410 from the old `GET /integrations/google/connect` and public `GET /integrations/google/callback` flow. Do not leave a path that links accounts solely from transferable state. Update Spring Security and OpenAPI so authorize/complete/status/disconnect require application authentication. No public backend completion route should remain.

	## 5. Add connection status and disconnect

	```http
	GET /integrations/google/status
	Authorization: Bearer <application access token>
	```

	Return 200 with one of:

	```json
	{"status":"disconnected"}
	```

	```json
	{"status":"connected","email":"gmail-user@example.com","scopes":["https://www.googleapis.com/auth/gmail.readonly"]}
	```

	```json
	{"status":"reconnect_required","email":"gmail-user@example.com","scopes":["https://www.googleapis.com/auth/gmail.readonly"]}
	```

	Refresh expired Google access tokens server-side when possible. Persist reconnect_required when Google refresh fails with revoked/invalid credentials or required permission is lost. Distinguish this from an expired myMail application session: the former is a connection status, the latter is HTTP 401. Provider outages must not be misclassified as revocation.

	For `reconnect_required`, `scopes` may be empty if permission was lost, or contain only the read-only Gmail scope as last known permission. A `connected` result must contain exactly the required read-only scope. Do not report a connection as healthy merely because a credential row exists.

	```http
	DELETE /integrations/google
	Authorization: Bearer <application access token>
	```

	Return 204 after successful, idempotent disconnection. Cancel pending authorization transactions for this user, stop synchronization jobs, revoke provider access as appropriate, and remove stored credentials. Handle completion/disconnect races so a pending completion cannot reconnect a deliberately disconnected account. A provider outage must not silently be reported as successful revocation; document and test any durable retry policy. No endpoint accepts another user's account ID to authorize ownership.

	## 6. Deployment and secrets

	- Update Google Cloud OAuth redirect allowlist with the exact frontend callback above. Development can use `http://localhost:3000/api/integrations/google/callback`. Register preview URLs individually or leave integration disabled there.
	- Update backend redirect-URI allowlist and production configuration accordingly. Keep Google client secret and stored tokens exclusively on the backend, with appropriate protection at rest and restricted access.
	- The frontend server configuration is `BACKEND_URL=https://mymail.fly.dev`, `FRONTEND_URL=https://my-mail-front.vercel.app`, a generated 32-byte base64url `GOOGLE_OAUTH_COOKIE_SECRET`, `GOOGLE_INTEGRATION_ENABLED=true`, and `BACKEND_LOGOUT_ENABLED=true` only after compatible endpoints are deployed. No NEXT_PUBLIC secret variables.
	- Do not return tokens in redirects, HTML, status, errors, telemetry, or logs. Scrub callback query strings from access logs because they contain codes/state. Preserve TLS verification and no-store responses.

	## 7. Required tests and delivery

	Run relevant backend tests, compilation, validation, and migrations. Add integration tests for authentication success/invalid credentials/duplicates/validation/rate limits/expiry; exact logout invalidation; Google unauthorized initiation, redirect allowlisting, PKCE, wrong subject, missing/expired/replayed state, concurrent completion, cancellation, provider errors, insufficient scope, reconnect without a new refresh token, revocation, status isolation, idempotent disconnect, and completion/disconnect races. Prove that two application users cannot link or inspect each other's Gmail accounts.

	Update OpenAPI with the exact contracts above. State the endpoints implemented, checks actually run, migrations, configuration steps, and any remaining limitations. Supply a coordinated deployment order: backend compatible endpoints first; register the frontend callback; deploy the frontend changes and enable its flags after verification. Do not enable an insecure fallback.

	Separately assess migration from Auth0 password-realm/resource-owner credentials to Authorization Code with PKCE and hosted login. Do not silently change the working credential contract during this synchronization task; describe the migration and required frontend changes as a follow-up if it cannot be implemented safely here.
