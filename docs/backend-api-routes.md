# Frontend and backend API mapping

The browser uses the same-origin Next.js routes below. Next.js calls the backend over HTTPS and forwards the application Bearer token for authenticated operations. Application tokens stay in HttpOnly cookies; Google tokens stay on the backend.

| Browser route | Backend request |
| --- | --- |
| `POST /api/auth/register` | `POST /api/authentication/signIn` |
| `POST /api/auth/login` | `POST /api/authentication/login` |
| `POST /api/auth/logout` | `POST /api/authentication/logout`, when backend logout is enabled and a session exists |
| `GET /api/auth/session` | `GET /api/users/me` |
| `POST /api/integrations/google/connect` | `POST /integrations/google/authorize` |
| `GET /api/integrations/google/callback` | Validates the browser transaction, then `POST /integrations/google/complete` |
| `GET /api/integrations/google/status` | `GET /integrations/google/status` |
| `POST /api/integrations/google/disconnect` | `DELETE /integrations/google` |

## Payload compatibility

The contracts follow the supplied OpenAPI 3.1 document and the live document at [the backend API documentation endpoint](https://mymail.fly.dev/v3/api-docs).

- Login and registration accept omitted or null `expiresIn`. When it is absent, cookie lifetime is derived from JWT `exp`. Tokens without usable expiry information remain rejected. Registration also requires the documented nonempty `idpId`.
- Google status and completion accept omitted or nullable `email` and omitted `scopes`. The backend's null disconnected scopes are normalized to an omitted field. Scopes, when present, can contain at most the single Gmail read-only scope.
- Completion still requires `status: "connected"`. The dashboard shows an email fallback when it is unknown, and only displays the read-only permission badge when the backend reports that scope.
- Backend 400, 409, 429, 502, and 503 statuses are preserved for Google operations. The frontend returns fixed error codes and localized messages, including `DISCONNECT_PENDING`; raw backend descriptions and unknown backend codes are not forwarded.
- A backend 401 clears the invalid application session for protected operations. A Google connection issue does not clear a valid application session.

The deployed OpenAPI generator currently describes the login, registration, authorization, and completion request bodies as strings. The backend controller implementations use JSON request objects, so the frontend continues sending JSON objects rather than encoding the JSON a second time. Correcting these OpenAPI request schemas is a backend documentation task.

The generated server URL also shows `http://mymail.fly.dev`; production frontend requests continue to use `https://mymail.fly.dev`.

The retired backend `GET /integrations/google/connect` and `GET /integrations/google/callback` endpoints return 410 and are never used by the frontend. The Google Console callback remains the frontend URL:

```text
https://my-mail-front.vercel.app/api/integrations/google/callback
```

No Gmail message endpoint is implemented in this frontend update.
