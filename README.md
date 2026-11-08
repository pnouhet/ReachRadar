# ReachRadar

Pitch smarter. Pay only for real feedback. Grow real fans.

Next.js (App Router, TypeScript, Tailwind CSS v4) + Supabase (Auth, Postgres, Storage), deployed on Vercel.
The design source is the Figma file `ReachRadar` (page **Screens**); product rules live in `DESIGN.md`.
The original static home prototype is kept in `prototype/` for reference.

## What works today (plan 1)

- Sign up as an **artist** or a **curator** (email + password), email confirmation, log in, password reset.
- Role-aware app shell: every sidebar page exists; pages not built yet show "Coming soon".
- **Settings · Profile**: name, bio, location, genres, links, avatar and banner uploads.
- **Settings · Account**: password change.
- **Upload a track**: MP3 / FLAC / WAV up to 50 MB (resumable upload straight to Supabase Storage), artwork, details, tags, rights, publish checklist; published tracks appear on **My profile** and can be played.

Docs: design spec in `docs/superpowers/specs/`, implementation plans in `docs/superpowers/plans/`.

## Run it locally

Requirements: Node 24, npm, a Supabase project.

1. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` — `https://<ref>.supabase.co` (no `/rest/v1` suffix)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — `sb_publishable_…`
   - `SUPABASE_SECRET_KEY` — `sb_secret_…` (server and tests only, never exposed to the browser)
   - `SUPABASE_DB_URL` — Session pooler connection string (for migrations and type generation)
   - `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000`
2. Install and start:

```bash
npm install
```

```bash
npm run dev
```

The app runs on http://localhost:3000 (Apache/XAMPP is not needed).

## Database

Migrations live in `supabase/migrations/`.

```bash
npm run db:push
```

```bash
npm run db:types
```

`db:push` applies new migrations to the project in `SUPABASE_DB_URL`; `db:types` regenerates `src/types/db.ts`.

In the Supabase dashboard, **Authentication → URL Configuration** must list the site URL and `<site>/**` as redirect URLs (localhost and each Vercel domain).
On the free plan Supabase only sends emails to members of the project team, and pauses the project after a week without activity (restore it from the dashboard).

## Tests

```bash
npm test
```

```bash
npm run test:integration
```

```bash
npm run test:e2e
```

- `test` — unit tests (Vitest + Testing Library).
- `test:integration` — database rules (triggers, RLS, storage policies) against the Supabase project; creates and deletes its own test users.
- `test:e2e` — Playwright (Chromium) against `npm run dev`; uses the same test-user helpers. Set `BASE_URL` to run against a deployment.

## Deployment

The GitHub repository is linked to a Vercel project: every push deploys a preview, `main` deploys production.
Vercel needs the same environment variables as `.env.local` except `SUPABASE_DB_URL`, with `NEXT_PUBLIC_SITE_URL` set to the production URL.
