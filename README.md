# EK Frontend

Production-oriented Next.js App Router + TypeScript + Tailwind CSS starter matching the supplied EK landing-page design.

## Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Add these assets

Place your files in `public/images/` using these exact names:

- `logo.png` — small header/footer logo
- `hero-logo.png` — large central EK emblem
- `hero-bg.jpg` — Earth/space hero background
- `global-city.jpg` — connected skyline image

Optional:

- `public/white-paper.pdf`

## NestJS login contract

The included BFF login route sends:

```json
{ "email": "user@example.com", "password": "secret" }
```

to `POST {NEXT_PUBLIC_API_URL}/auth/login` and expects:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "email": "...", "roles": [] }
}
```

Tokens are written to HttpOnly cookies by Next.js. Adjust `src/app/api/auth/login/route.ts` if your NestJS response differs.

## Main folders

- `src/app` — routes and layouts
- `src/components/landing` — landing page sections
- `src/components/ui` — reusable UI
- `src/lib/api` — API client
- `src/lib/auth` — authentication helpers
- `src/types` — shared TypeScript contracts
