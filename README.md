# myMail Frontend

**The web interface for myMail — a modern email client with AI-assisted spam and ham classification.**

[Backend](https://github.com/heorhii-lytvynenko/myMail) · [Report an issue](https://github.com/heorhii-lytvynenko/myMail_front/issues)

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
├── app/          # App Router pages, layouts, providers, and modules
├── i18n/         # Locale configuration and request handling
├── messages/     # Translation dictionaries
├── next.config.ts
└── package.json
```

Supported locales are `en`, `pl`, and `ua`, with English as the default.

## Getting started

### Prerequisites

- Node.js 20 or newer
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
