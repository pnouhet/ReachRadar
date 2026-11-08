# ReachRadar — Admin role with "View as" switch

Date: 2026-11-08 · Status: draft for approval · Builds on plan 1 (`docs/superpowers/plans/2026-11-08-reachradar-plan-1-foundation-auth-profile-upload.md`).

## Intent

The owner and their team need to check the whole site while it is being built: every artist page, every curator page, and the design-system page, on the live site as well as locally. Today an account is either an artist or a curator, so checking both sides means juggling two accounts, and `/design-system` is unreachable in production.

An **admin** is a "see everything" account: it sees each page **exactly the way an artist or a curator sees it** (owner's words). It is a checking tool, not a back-office.

## Goals

- A third account role, `admin`.
- An admin can open every app page of both roles and `/design-system`, including in production.
- A **"View as" switch** flips the whole app between the artist view and the curator view: sidebar, top bar, dashboard, demo data, role-specific pages.
- The switch lives in a **thin admin strip above the normal top bar** (option C, chosen by the owner from mockups): yellow (`--color-warning` #ffc145) background, midnight text, reading `ADMIN · Viewing as artist` + a `Switch to curator` link (or the reverse), and a `Design system` link on the right. The Figma top bar and sidebar below it stay unchanged.
- Pages backed by real data use the admin's **own** account:
  - artist view: My profile (artist layout, own tracks), Upload a track (real upload, publish, playback) work for real;
  - curator view: the curator version of the same pages;
  - Settings · Profile follows the view (e.g. label "Artist name" vs "Curator or brand name").

## Non-goals

- Managing other users: no viewing or editing other accounts, tracks, messages; no user list; no impersonation of a specific user.
- Signing up as admin. The sign-up flow stays artist / curator only.
- Admin-specific pages or dashboards.

## Anti-goals (failure even if it "works")

- A regular artist or curator can become admin, or reach admin-only things (the switch, `/design-system` in production), by any means: sign-up metadata, a cookie, a crafted request, a direct database API call.
- An admin can read other artists' private audio or edit other users' rows. Admin powers are about **which pages render**, never about **whose data** is readable.
- The Figma top bar / sidebar get redesigned to fit the switch.

## Constraints (from the existing project)

- Stack and conventions of plan 1: Next.js 16 App Router (`src/proxy.ts`, not middleware), Supabase with RLS, Tailwind v4 tokens in `src/app/globals.css`, Lucide icons, Vitest / integration / Playwright test layers, TDD, every deviation recorded as a ruling.
- Roles today:
  - DB enum `public.user_role ('artist','curator')`; `profiles.role` is immutable (trigger `profiles_guard`); the sign-up trigger `handle_new_user` rejects any role other than artist / curator and mirrors the role into `auth.users.raw_app_meta_data.role`.
  - The proxy reads the role from validated JWT claims (`getClaims()` → `app_metadata.role`) and applies `resolveRouteAccess` (`src/lib/auth/guard.ts`), which uses `NAV_ITEMS` / `EXTRA_APP_ROUTES` (`src/lib/nav.ts`) as the single source of truth for which role may open which page.
  - Role-dependent UI reads `profile.role` in: `(app)/layout.tsx`, `(app)/profile/page.tsx`, `(app)/settings/account/page.tsx`, `AppShell`, `AppSidebar`, `AppTopBar`, `ProfileForm`, `ProfileHeader`.
  - `tracks` insert policy requires `profiles.role = 'artist'`.
  - `/design-system` calls `notFound()` whenever `NODE_ENV === "production"`.
- Supabase free plan, single project shared by local dev, tests and production.
- Admin claims in the JWT only change on token refresh, so a freshly promoted admin must log out and back in (or wait for the refresh).

## Decisions taken with the owner

1. Admin sees pages the way artists and curators see them; no management of other users.
2. A "View as" switch, not a merged sidebar.
3. Switch placement: thin yellow admin strip above the top bar (mockup option C).
4. The calls listed below under "Claude's calls" were played back to the owner and accepted ("all good").

5. **Admin accounts are test accounts, hidden from real users** (owner's answer to the builder check). An admin's profile and tracks (including published ones) must never be visible to a non-admin user, now or in later features (catalogue, matching, pitching, public profiles).
   - Enforced in the database, not only in queries: the `profiles` and `tracks` SELECT policies hide rows owned by an admin from non-admin users. The owner still sees their own rows; admins can see each other's (team).
   - Later features filtering on `role = 'artist'` / `'curator'` naturally exclude admins; that is the intended behaviour.
   - Images in the public buckets (avatars, banners, covers) stay reachable by their unguessable URL, as for every user; nothing lists them. Accepted.

## Claude's calls (accepted by the owner in the play-back)

- **Becoming admin:** only through a command run by the owner with the project's secret credentials, e.g. `npm run admin:grant -- <email>`. It turns an existing, confirmed account into an admin. Nothing reachable from the browser can grant it.
- **Remembered view:** the admin's last view is remembered between visits (cookie); the first time, the view is **artist**.
- **Real data = own data:** see Goals.

## Further calls for the builder's guidance (Claude's, not discussed)

- **Revoking admin:** there is also a revoke command (e.g. `npm run admin:revoke -- <email>`). The grant stores the account's previous role (artist or curator); revoke puts it back, in `profiles.role` and `app_metadata.role`, and signs the person out of all sessions. Deleting the account is never the way to remove admin.
- **Claim lag:** admin checks trust the JWT claim, so a revoked admin may keep admin pages until their current access token expires (up to 1 hour, refresh tokens are revoked). Acceptable for a team-only checking tool; no per-request database check.

- **Role model:** `admin` becomes a real value of `user_role` and of `app_metadata.role`. Code then works with two notions:
  - the account role (`artist` | `curator` | `admin`), used for permissions;
  - the **view role** (`artist` | `curator`): for artists and curators it equals their role; for an admin it comes from the view cookie (default artist). All role-dependent UI listed above switches from `profile.role` to the view role.
- **Route access:** an admin may open every app route of either role. Opening a page that belongs only to the other side (e.g. `/inbox` while viewing as artist) switches the view to that side, so the sidebar always matches the page. Shared pages (`/dashboard`, `/messages`, …) keep the current view.
- **View cookie trust:** the cookie only matters when the validated claims say `admin`; for everyone else it is ignored. It holds no secret and grants nothing by itself.
- **Database:**
  - `profiles_guard` keeps blocking role changes for normal updates; only the grant path may change a role, and only to `admin`.
  - The grant function is not executable by `anon` / `authenticated`.
  - `handle_new_user` keeps rejecting `admin` in sign-up metadata.
  - `tracks` insert policy accepts `artist` or `admin`.
  - Everything owner-scoped (RLS on profiles, tracks, storage folders) stays owner-scoped for admins.
- **Admin's profile fields:** an admin keeps whatever fields their account already has (display name, bio, links, avatar, banner, `curator_type` possibly null). In curator view, the profile header shows "Curator" when `curator_type` is null.
- **Top bar account label:** shows "Admin" under the name.
- **Design system:** reachable by admins in every environment; in production everyone else gets a 404 (unchanged). In development it stays open to everyone, as today. It gets the admin strip too, so the admin can get back to the app.
- **Responsive:** the strip must not cause horizontal overflow at 375 px; on narrow screens the wording can shorten (e.g. `ADMIN · Artist view · Switch`).

## What success looks like

- The owner logs in on the live site with their admin account, sees the yellow strip, flips between the artist and curator views and finds every page of both sidebars, plus `/design-system`.
- In artist view they upload, publish and play a track of their own.
- A regular artist and a regular curator see exactly what they saw before; nothing about admin is visible or reachable for them.
- Tests prove: guard decisions for admin in both views; the grant and revoke paths and their refusal for non-privileged callers; sign-up cannot create an admin; an admin cannot read another artist's private track or update another profile; a regular user cannot see an admin's profile or published tracks; the strip and switch end-to-end.

## Left to the builder

- Cookie name and lifetime; how the switch posts (server action vs route).
- Exact strip markup and narrow-screen wording within the constraints above.
- Migration layout and function names.
- How the grant command authenticates (secret key + RPC, or the DB URL like `scripts/db.mjs`), as long as it never ships to the browser.
