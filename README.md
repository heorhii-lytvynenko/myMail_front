# myMail Frontend

**The web interface for myMail â€” a modern email client with AI-assisted spam and ham classification.**

[Backend](https://github.com/heorhii-lytvynenko/myMail) Â· [Report an issue](https://github.com/heorhii-lytvynenko/myMail_front/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

> [!NOTE]
> myMail is under active development. The interface and setup may change as features are added.

## About

This repository contains the frontend for myMail, a web-based email client designed to provide a clean mailbox experience and AI-assisted spam/ham classification. It communicates with the separate [myMail backend](https://github.com/heorhii-lytvynenko/myMail) over HTTP APIs.

The application uses the Next.js App Router, TypeScript, Tailwind CSS, localized routes, and a feature-oriented project structure.

## Current foundation

- Next.js App Router
- Guest and authenticated route groups
- English, Polish, and Ukrainian localization
- Account state and synchronization foundation
- Cookie and token utilities
- Reusable shared utilities and providers
- Responsive styling with Tailwind CSS
- Planned mailbox, Gmail connection, and AI classification interfaces

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Internationalization | next-intl |
| Utilities | clsx, tailwind-merge |
| Package manager | npm |

## Repository structure

```text
myMail_front/
â”œâ”€â”€ app/          # App Router pages, layouts, providers, and modules
â”œâ”€â”€ i18n/         # Locale configuration and request handling
â”œâ”€â”€ messages/     # Translation dictionaries
â”œâ”€â”€ next.config.ts
â””â”€â”€ package.json
```

Supported locales are `en`, `pl`, and `ua`, with English as the default.

## Getting started

### Prerequisites

- Node.js 22.12 or newer
- npm
- A running instance of the [myMail backend](https://github.com/heorhii-lytvynenko/myMail)

### 1. Clone the repository

```bash
git clone https://github.com/heorhii-lytvynenko/myMail_front.git
cd myMail_front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## Backend

The API, authentication, Gmail integration, persistence, and email services live in the [myMail backend repository](https://github.com/heorhii-lytvynenko/myMail).

## Project status

The frontend foundation is in place and active development is focused on authentication, account connection, mailbox workflows, and the email experience.

## Author

Developed by [Heorhii Lytvynenko](https://github.com/heorhii-lytvynenko).

## Authentication

Copy `.env.example` to `.env.local`. Set server-only `BACKEND_URL` to the backend origin (without `/api`). Production requires an explicit HTTPS origin. `NEXT_PUBLIC_BACKEND_URL` is no longer used for authentication.

- `/login` and `/register` submit through same-origin Next.js route handlers to `POST /api/authentication/login` and `POST /api/authentication/signIn`.
- Both send `{ "email": "you@example.com", "password": "original password" }`. Registration validates confirmation locally and requires at least eight characters; passwords are never trimmed. Backend/Auth0 policy remains authoritative.
- Backend success responses contain `accessToken`, `tokenType: "Bearer"`, and preferably the actual `expiresIn`. JWT `exp` is used for lifetime calculation if present; opaque tokens require `expiresIn`.
- The access token stays in an HTTP-only cookie with SameSite=Lax, Secure in production, host-only scope, and a lifetime bounded by token expiry and eight hours. `/account` validates it server-side using `GET /api/users/me`. Token decoding never establishes authentication.
- Expiry requires reauthentication. No refresh endpoint is assumed. Session checks clear rejected cookies, preserve cookies during service outages, and synchronize logout/expiry when a tab regains focus.
- Logout always removes local session/transaction/legacy cookies. With `BACKEND_LOGOUT_ENABLED=true`, it also attempts the documented backend invalidation endpoint. Immediate server-side invalidation depends on the backend implementation and successful delivery.
- English, Polish, and Ukrainian routes are supported for login, registration, and account pages, including localized navigation and errors.

## Google / Gmail integration

This connects Gmail read access to an existing myMail account. It does not implement Google sign-in.

Keep `GOOGLE_INTEGRATION_ENABLED=false` until the backend implements [the synchronization prompt](docs/backend-sync-prompt.md). There is intentionally no fallback to the old transferable-state redirect flow.

When ready, configure server-only `FRONTEND_URL`, a 32-byte base64url `GOOGLE_OAUTH_COOKIE_SECRET`, and enable the flag. The exact Google registered callback is `<FRONTEND_URL>/api/integrations/google/callback`. Production uses `https://my-mail-front.vercel.app/api/integrations/google/callback`. Preview deployments need their own exact registered callback and backend allowlist entry, or must keep integration disabled.

Next.js creates PKCE, validates the authorization URL, and keeps a short-lived encrypted HttpOnly transaction cookie bound to the current application session. It validates callback state/session/expiry before calling authenticated backend completion. Gmail connection status, cancellation/errors, reconnection, and disconnection are displayed on the account page. Google credentials stay on the backend.

The required backend endpoints and complete request/response schemas are in [docs/backend-sync-prompt.md](docs/backend-sync-prompt.md). Deploy compatible backend endpoints first, configure the callback, then deploy/enable the frontend feature. Do not share the frontend cookie encryption secret with the backend.

## Verification

```bash
npm test
npm run typecheck
npm run lint:auth
npm run lint
npm run build
npm run test:smoke
```

Vitest covers authentication/session routes, origin rejection, token lifetimes, response validation, Google PKCE and browser binding, callback failures, status/disconnect, shared-client regressions, form errors and duplicate submissions. All backend/provider calls are mocked; live Google consent and cross-service production tests remain deployment checks.

CI runs repository-wide lint, type checking, regression tests, a production build, and local HTTP smoke checks without production secrets. Smoke checks require a preceding build and never contact the backend. `lint:auth` is also available as a faster check while working on authentication. Lint rules remain enabled. TanStack Virtual produces one compiler-compatibility warning; that boundary explicitly opts out of compiler memoization, while the rest of the application remains eligible for it.

The obsolete direct-browser authentication and refresh stack has been removed. Earlier account/onboarding/media/tag foundations remain outside the active application and need supported same-origin endpoints before reuse.

Dependency auditing identified an unpatched `braces` advisory in the ESLint tooling chain. It is not a production dependency. Do not downgrade Next.js or force incompatible dependency changes to suppress this warning; track the upstream fix.
