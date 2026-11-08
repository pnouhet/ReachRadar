# Admin role with "View as" switch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `admin` account role that can open every artist and curator page (switching between the two with a "View as" strip) and `/design-system`, while admin accounts stay invisible to real users.

**Architecture:** `admin` becomes a value of `public.user_role` and of `app_metadata.role`, granted/revoked only by privileged SQL functions called from a local script. In the app, `profile.role` keeps meaning "the role the pages render for" (the **view role**: artist | curator); for admins it comes from an `rr-view` cookie, so almost no page code changes. The proxy lets admins through every app route and flips the cookie when they open a page of the other side.

**Tech Stack:** Next.js 16.4.5 App Router (`src/proxy.ts`), React 19.3, Supabase (Postgres RLS, `@supabase/ssr`, `@supabase/supabase-js`), Tailwind v4, Lucide, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-08-reachradar-admin-role-design.md`

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code (AGENTS.md).
- TDD: every task writes its failing test first; deviations go in the ledger as `Ruling:` lines.
- Admin powers change **which pages render**, never **whose data** is readable: all owner-scoped RLS (profiles update, tracks update/delete, storage folders) stays owner-scoped for admins.
- A non-admin must never see an admin's profile or tracks (published included), now or later.
- Nothing reachable from the browser can grant or revoke admin; sign-up stays artist / curator only.
- Admin strip: background `--color-warning` (#ffc145), midnight text, sits above the unchanged Figma top bar; no horizontal overflow at 375 px.
- Default view for an admin: `artist`. Cookie `rr-view`, values `artist` | `curator`, httpOnly, sameSite lax, path `/`, max-age 1 year.
- `/design-system`: admins in every environment; everyone else 404 in production, open in development (unchanged).
- Windows/PowerShell user: commands given to the user use no `&&`.
- Never print or open `.env.local` values.

## Review Focus

- A non-admin sending a forged `rr-view=curator` cookie stays in their own role and sidebar → unit test in Task 3.
- An admin with a garbage `rr-view` value (or none) gets the artist view → unit test in Task 3.
- An admin opening a deep link to the other side (`/inbox` while viewing as artist) sees the page with the matching sidebar → e2e in Task 4.
- Granting an unknown or unconfirmed email fails with a clear message and changes nothing; granting twice keeps the original `previous_role` → integration tests in Task 1.
- The strip at 375 px wide causes no horizontal scroll → e2e in Task 4.

---

### Task 1: Database — admin role, grant/revoke, hidden admin rows

**Files:**
- Create: `supabase/migrations/20261108140000_admin_role_enum.sql` (only `alter type public.user_role add value if not exists 'admin';` — Postgres refuses to use a new enum value in the transaction that adds it, so it gets its own migration)
- Create: `supabase/migrations/20261108140100_admin_role.sql`
- Modify: `src/types/db.ts` (regenerated with `npm run db:types`)
- Modify: `tests/helpers/users.ts`
- Test: `tests/integration/admin.test.ts`

**Interfaces:**
- Produces (SQL, schema `public`):
  - column `profiles.previous_role public.user_role null`
  - `is_admin(p_uid uuid default auth.uid()) returns boolean` — `security definer`, `stable`, `set search_path = ''`; true when that profile's role is `admin`. Used by policies (avoids RLS recursion on `profiles`).
  - `grant_admin(p_email text) returns void` and `revoke_admin(p_email text) returns void` — `security definer`, `set search_path = ''`; `revoke execute ... from public, anon, authenticated`; `grant execute ... to service_role`.
- Produces (TS, `tests/helpers/users.ts`): `grantAdmin(email: string): Promise<void>` and `revokeAdmin(email: string): Promise<void>` (call the RPCs with `adminClient()`, throw on error).

Behaviour to implement in `20261108140100_admin_role.sql`:
- `grant_admin`: finds `auth.users` by `lower(email)`; raises `'no confirmed account for %'` (errcode `P0002`) when missing or `email_confirmed_at is null`. If the profile is already `admin`, does nothing. Otherwise sets `previous_role = role`, `role = 'admin'`, and merges `{"role":"admin"}` into `auth.users.raw_app_meta_data`.
- `revoke_admin`: same lookup; raises `'% is not an admin'` (errcode `P0001`) if the role isn't `admin`; sets `role = previous_role`, `previous_role = null`, mirrors the role into `raw_app_meta_data`, and deletes the user's rows from `auth.sessions` (signs them out everywhere).
- `profiles_guard` (replace the function): `role` and `previous_role` may change only when `current_setting('rr.role_change', true) = 'on'`; both RPCs set it with `set_config('rr.role_change', 'on', true)` before their update. `id` and `slug` stay immutable.
- `handle_new_user`: unchanged (it already rejects anything but artist / curator) — the test proves it.
- Policies (drop and recreate):
  - `profiles` select: `role <> 'admin' or id = (select auth.uid()) or public.is_admin()`.
  - `tracks` select: `owner_id = (select auth.uid()) or (status = 'published' and (not public.is_admin(owner_id) or public.is_admin()))`.
  - `tracks` insert: role check becomes `p.role in ('artist', 'admin')`.

- [ ] **Step 1: Write the failing integration tests** in `tests/integration/admin.test.ts` (users from `createTestUser`, cleaned in `afterAll`):
  - `grant_admin turns an artist into an admin and remembers the previous role` → profile `role === "admin"`, `previous_role === "artist"`; `adminClient().auth.admin.getUserById(id)` has `app_metadata.role === "admin"`.
  - `granting twice keeps the original previous role` → after two grants `previous_role === "artist"`.
  - `grant_admin refuses an unknown email and an unconfirmed account` → both RPC calls return an error; the unconfirmed user's profile is still `artist`.
  - `signed-in users and anon cannot call grant_admin or revoke_admin` → `signedInClient(...).rpc("grant_admin", { p_email })` returns an error; the profile is unchanged.
  - `a user cannot change their own role or previous_role` → update with `role: "admin"` errors; update with `previous_role: "curator"` errors.
  - `sign-up cannot create an admin` → `adminClient().auth.admin.createUser({ ..., user_metadata: { role: "admin", display_name: "X" } })` returns an error.
  - `regular users cannot see an admin's profile or published track` → admin inserts and publishes a track (needs `audio_path` etc. — reuse the published-track fixture pattern from `tests/integration/tracks.test.ts`); a regular artist's `select` on `profiles` by the admin's id returns 0 rows and on `tracks` by that id returns 0 rows.
  - `admins see each other but not other artists' drafts` → admin A sees admin B's profile; admin A selecting a regular artist's draft track gets 0 rows; admin A updating that artist's profile changes 0 rows.
  - `an admin can create tracks` → insert `{ owner_id: adminId }` succeeds.
  - `revoke_admin restores the previous role` → `role === "artist"`, `previous_role === null`, `app_metadata.role === "artist"`; revoking a non-admin errors.

- [ ] **Step 2: Run them to verify they fail**
  Run: `npm run test:integration -- tests/integration/admin.test.ts`
  Expected: FAIL (`grant_admin` function not found / enum value missing).

- [ ] **Step 3: Write both migrations** as described above.

- [ ] **Step 4: Apply and regenerate types**
  Run: `npm run db:push` then `npm run db:types`
  Expected: both migrations applied; `src/types/db.ts` has `user_role: "artist" | "curator" | "admin"` and `previous_role`.

- [ ] **Step 5: Add `grantAdmin` / `revokeAdmin` to `tests/helpers/users.ts`**, then run the integration suite
  Run: `npm run test:integration`
  Expected: all files PASS (admin + the existing 14 tests).

- [ ] **Step 6: Typecheck** — `npx tsc --noEmit` must pass. `Profile.role` in `src/lib/profile/queries.ts` will now see `admin` from the row; keep it compiling by narrowing there for now (Task 4 replaces it).

- [ ] **Step 7: Commit**
```bash
git add supabase/migrations src/types/db.ts tests/helpers/users.ts tests/integration/admin.test.ts src/lib/profile/queries.ts
git commit -m "feat(db): admin role with grant/revoke and admin rows hidden from users"
```

### Task 2: Grant / revoke command

**Files:**
- Create: `scripts/admin.mjs`
- Modify: `package.json` (scripts `admin:grant`, `admin:revoke`), `README.md` (new "Admin accounts" section)

**Interfaces:**
- Consumes: RPCs `grant_admin(p_email)` / `revoke_admin(p_email)` from Task 1.
- Produces: `npm run admin:grant -- <email>` and `npm run admin:revoke -- <email>`.

- [ ] **Step 1: Write the failing integration test** `tests/integration/admin-script.test.ts`: creates an artist test user, runs `spawnSync(process.execPath, ["scripts/admin.mjs", "grant", email], { encoding: "utf8" })`:
  - `grant` → exit code 0, stdout contains `is now an admin`, profile role is `admin`;
  - `revoke` → exit code 0, stdout contains `is back to artist`;
  - `grant nobody+<uuid>@example.com` → exit code 1, stderr contains `no confirmed account`;
  - no arguments → exit code 1, stderr contains `usage`.
  Run `npm run test:integration -- tests/integration/admin-script.test.ts` → FAIL (script missing).

- [ ] **Step 2: Write `scripts/admin.mjs`** — loads `.env.local` with dotenv (like `scripts/db.mjs`), creates a supabase-js client with `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SECRET_KEY` (`persistSession: false`), calls `grant_admin` / `revoke_admin`, prints `"<email> is now an admin — log out and back in to see the admin strip."` or `"<email> is back to <role>."` (read the role back from `profiles`), and on failure writes the RPC error message to stderr and exits 1. Never prints keys. Re-run the test → PASS.

- [ ] **Step 3: README** — "Admin accounts" section: what an admin is (sees every page as artist or curator, hidden from users), the two commands, the log-out-and-back-in note, and that revoking may take up to 1 hour to remove access from an open session.

- [ ] **Step 4: Commit**
```bash
git add scripts/admin.mjs package.json README.md tests/integration/admin-script.test.ts
git commit -m "feat: admin:grant and admin:revoke commands"
```

### Task 3: View role and route access

**Files:**
- Modify: `src/lib/nav.ts`, `src/lib/auth/guard.ts`, `src/proxy.ts`
- Create: `src/lib/auth/view.ts`
- Test: `tests/unit/guard.test.ts`, `tests/unit/view.test.ts`

**Interfaces:**
- Produces in `src/lib/nav.ts`: `export type AccountRole = Role | "admin";` (`Role` stays `"artist" | "curator"` = view role).
- Produces in `src/lib/auth/view.ts` (no `server-only`, pure):
  - `export const VIEW_COOKIE = "rr-view";`
  - `export const VIEW_COOKIE_OPTIONS` — `{ httpOnly: true, sameSite: "lax", path: "/", maxAge: 31_536_000 }`
  - `export function viewRoleFor(account: AccountRole, cookie: string | undefined): Role` — artist/curator return themselves (cookie ignored); admin returns the cookie if it is `artist`/`curator`, else `"artist"`.
- Produces in `src/lib/auth/guard.ts`:
  - `resolveRouteAccess(pathname: string, user: { role: AccountRole; view: Role } | null): RouteAccess`
  - `RouteAccess = { action: "allow"; setView?: Role } | { action: "redirect"; to: string }`
  - `export function pageAllowedFor(pathname: string, view: Role): boolean` — false only for an app route whose roles exclude `view`.
- Admin rule: every app route is allowed; when the route's roles don't include `user.view`, return `{ action: "allow", setView: <the route's single role> }`. Guest-only pages still redirect admins to `/dashboard`.

- [ ] **Step 1: Write the failing unit tests**
  - `tests/unit/view.test.ts`: `viewRoleFor("artist", "curator") === "artist"`; `viewRoleFor("curator", "artist") === "curator"`; `viewRoleFor("admin", "curator") === "curator"`; `viewRoleFor("admin", undefined) === "artist"`; `viewRoleFor("admin", "admin") === "artist"`; `viewRoleFor("admin", "<script>") === "artist"`.
  - `tests/unit/guard.test.ts` (update existing calls to pass `{ role, view: role }`), add:
    - `admins open artist and curator pages` → admin/artist view on `/pitch` → `{ action: "allow" }`; on `/inbox` → `{ action: "allow", setView: "curator" }`; admin/curator view on `/profile/upload` → `{ action: "allow", setView: "artist" }`; on `/messages` → `{ action: "allow" }` (no switch on shared pages).
    - `a forged view cookie does not widen a regular user's access` → `{ role: "artist", view: "curator" }` on `/inbox` → redirect `/dashboard`.
    - `admins are kept away from login like everyone else` → admin on `/login` → redirect `/dashboard`.
    - `pageAllowedFor` → (`/inbox`, artist) false; (`/messages`, artist) true; (`/`, curator) true.

- [ ] **Step 2: Run to verify they fail** — `npx vitest run tests/unit/guard.test.ts tests/unit/view.test.ts` → FAIL.

- [ ] **Step 3: Implement** `view.ts`, the `AccountRole` type and the guard changes.

- [ ] **Step 4: Proxy** — accept `admin` from `app_metadata.role`; compute `view = viewRoleFor(role, request.cookies.get(VIEW_COOKIE)?.value)`; pass `{ role, view }`; when `access.setView` is set, also set it on `request.cookies` (so the page render in this same request reads the new view), rebuild the pass-through response from that request **while copying over any Supabase cookies already set on `response`**, and set the cookie on the response with `VIEW_COOKIE_OPTIONS`.

- [ ] **Step 5: Run unit tests, typecheck, lint**
  Run: `npx vitest run` then `npx tsc --noEmit` then `npm run lint`
  Expected: all PASS / clean.

- [ ] **Step 6: Commit**
```bash
git add src/lib/nav.ts src/lib/auth/view.ts src/lib/auth/guard.ts src/proxy.ts tests/unit/guard.test.ts tests/unit/view.test.ts
git commit -m "feat(auth): admin route access with a view role"
```

### Task 4: Admin strip and "View as" switch

**Files:**
- Modify: `src/lib/profile/queries.ts`, `src/app/(app)/layout.tsx`, `src/components/app/AppShell.tsx`, `src/components/app/AppTopBar.tsx`, `src/app/(app)/settings/account/page.tsx`
- Create: `src/components/app/AdminStrip.tsx`, `src/lib/auth/view-actions.ts`
- Test: `tests/e2e/admin.spec.ts`

**Interfaces:**
- Consumes: `viewRoleFor`, `VIEW_COOKIE`, `VIEW_COOKIE_OPTIONS`, `pageAllowedFor`, `AccountRole` (Task 3); `grantAdmin` helper (Task 1).
- Produces:
  - `Profile` gains `accountRole: AccountRole` and `isAdmin: boolean`; `Profile.role` becomes the **view role** (`Role`), computed with `viewRoleFor(row.role, (await cookies()).get(VIEW_COOKIE)?.value)`. Every existing reader of `profile.role` keeps working unchanged.
  - `switchView(view: Role, pathname: string): Promise<void>` in `src/lib/auth/view-actions.ts` (`"use server"`): re-reads claims with `getClaims()`; does nothing unless `app_metadata.role === "admin"`; sets the cookie; `redirect(pageAllowedFor(pathname, view) ? pathname : "/dashboard")`.
  - `AdminStrip({ view, pathname }: { view: Role; pathname: string })` — client component; `role="region"` `aria-label="Admin"`; text `ADMIN · Viewing as artist` / `curator`; a submit button `Switch to curator` / `Switch to artist` inside a `<form action={switchView.bind(null, other, pathname)}>`; a `Design system` link to `/design-system`. Height 32 px (`h-8`). Below 640 px the copy shortens to `ADMIN · Artist view` and `Switch`.
  - `AppShell` `user` prop gains `isAdmin: boolean`; when true it renders `AdminStrip` above `AppTopBar` inside one sticky header wrapper, and offsets the sidebar/drawer by the extra 32 px (replace the hard-coded `top-20` / `100dvh-80px` with a CSS variable set on the shell root, 80 px or 112 px).
  - `AppTopBar` account label shows `Admin` when `isAdmin`; credits vs earnings still follow the view role.
  - Settings · Account "Account type" shows `Admin` for admins.

- [ ] **Step 1: Write the failing e2e tests** in `tests/e2e/admin.spec.ts` (an artist test user promoted with `grantAdmin` in `beforeAll`; a regular artist for the last test; both deleted in `afterAll`):
  - `an admin sees the strip and the artist side first` → after `logIn`, `getByRole("region", { name: "Admin" })` contains `Viewing as artist`; sidebar `navigation "Main"` has link `Pitch to curators` and no `Inbox`.
  - `switching flips the sidebar and stays on shared pages` → on `/messages`, click `Switch to curator` → URL still `/messages`, strip says `Viewing as curator`, sidebar has `Inbox`, top bar shows earnings (not `Buy credits`).
  - `switching from an artist-only page lands on the dashboard` → on `/pitch` (artist view), switch → URL `/dashboard`.
  - `a deep link to the other side flips the view` → artist view, `page.goto("/inbox")` → URL `/inbox`, strip `Viewing as curator`, sidebar link `Inbox` has `aria-current="page"`.
  - `the view is remembered` → switch to curator, `page.reload()` and new `page.goto("/dashboard")` → still curator.
  - `an admin uploads in artist view` → `/profile/upload` renders `Upload a track` heading and the audio input (no redirect).
  - `the strip does not overflow on a phone` → viewport 375×812, `document.documentElement.scrollWidth <= 375`.
  - `a regular artist sees no admin strip` → `getByRole("region", { name: "Admin" })` has count 0; a cookie `rr-view=curator` added with `context.addCookies` changes nothing (no `Inbox` link).

- [ ] **Step 2: Run to verify they fail** — `npx playwright test tests/e2e/admin.spec.ts` → FAIL (no strip).

- [ ] **Step 3: Implement** the profile fields, `switchView`, `AdminStrip`, shell/top-bar/settings changes.

- [ ] **Step 4: Run the e2e file, then the whole e2e suite** — `npx playwright test` → all PASS (regular users unchanged).

- [ ] **Step 5: Unit, typecheck, lint, build** — `npx vitest run`, `npx tsc --noEmit`, `npm run lint`, `npm run build` → all PASS.

- [ ] **Step 6: Commit**
```bash
git add src tests/e2e/admin.spec.ts
git commit -m "feat(app): admin strip with View as switch"
```

### Task 5: Design system for admins, production check

**Files:**
- Modify: `src/app/design-system/page.tsx`, `tests/e2e/prod-smoke.spec.ts`
- Create: `src/lib/auth/is-admin.ts`

**Interfaces:**
- Consumes: `AdminStrip` (Task 4), `viewRoleFor` (Task 3), `grantAdmin` (Task 1).
- Produces: `isAdminRequest(): Promise<boolean>` in `src/lib/auth/is-admin.ts` (`server-only`) — `getClaims()` on the server client, `app_metadata.role === "admin"`.

- [ ] **Step 1: Write the failing prod-smoke test** in `tests/e2e/prod-smoke.spec.ts`: `an admin can open the design system in production` → artist test user + `grantAdmin`, `logIn`, `page.goto("/design-system")` → heading `Design system` visible and the admin strip present. (The existing 404 test for anonymous visitors stays.)

- [ ] **Step 2: Implement** — the page becomes `async`; `if (process.env.NODE_ENV === "production" && !(await isAdminRequest())) notFound();`; when the request is an admin, render `AdminStrip` (view from the `rr-view` cookie, `pathname="/design-system"`) at the top.

- [ ] **Step 3: Local checks** — `npx vitest run`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx playwright test` → all PASS.

- [ ] **Step 4: Commit, push `main`, wait for the Vercel deploy**
```bash
git add src/app/design-system/page.tsx src/lib/auth/is-admin.ts tests/e2e/prod-smoke.spec.ts
git commit -m "feat: design system reachable by admins in production"
git push origin main
```

- [ ] **Step 5: Production verification** — `BASE_URL=https://reachradar.vercel.app npx playwright test prod-smoke auth upload profile account admin` → all PASS.

- [ ] **Step 6: Grant the owner's account** — ask the owner which email to promote (their account must already be signed up and confirmed on the live site), run `npm run admin:grant -- <email>`, ask them to log out and back in, and confirm with them that the yellow strip appears.
