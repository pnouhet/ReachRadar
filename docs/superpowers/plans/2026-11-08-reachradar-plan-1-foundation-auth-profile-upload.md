# ReachRadar — Plan 1 : Socle, auth, profil, upload, mise en ligne — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Une application Next.js en ligne (Vercel + Supabase cloud) où un nouvel utilisateur crée un compte artiste ou curator, vérifie son e-mail, se connecte, édite son profil et ses images, uploade des morceaux, et navigue dans un app shell fidèle au Figma dont toutes les entrées de sidebar existent (pages de démo remplies dans les plans 2–4).

**Architecture:** Next.js App Router (TypeScript, `src/`), Server Components par défaut, Server Actions + zod pour les écritures, `@supabase/ssr` pour la session. Le rôle vit dans `profiles.role` et est recopié dans `auth.users.raw_app_meta_data.role` par trigger (non modifiable par l'utilisateur) pour que `proxy.ts` décide des accès sans requête DB. Les fichiers vont directement du navigateur vers Supabase Storage (TUS résumable pour l'audio), jamais à travers une route Next.

**Tech Stack:** Next.js (dernière stable, ≥16), React, TypeScript, Tailwind CSS v4, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `lucide-react`, `tus-js-client`, `gsap` (installé ici, utilisé au plan 2), Vitest + Testing Library + jsdom, Playwright (Chromium), Supabase CLI via `npx supabase`.

**Spec:** `docs/superpowers/specs/2026-11-08-reachradar-app-design.md` (+ `DESIGN.md` pour les règles visuelles).

## Découpage en plans

Le document de conception couvre plusieurs sous-systèmes ; chacun a son plan, livré et testable seul :

1. **Ce plan** — socle, design system, auth, profil & images, upload de morceaux, app shell avec pages en attente, mise en ligne.
2. **Pages marketing** — Home (portage du prototype `prototype/`), Pricing (06), Légal (09a–09e), Cookie Banner.
3. **Pages artiste (démo)** — Dashboard 12 V2 / 12c, Pitch 04a–04c + 13a/13b/13b·2, Rate & Earn 05, Catalogue 08 + profil curator 03b, Messages 07, Credits 13c + Checkout 14a–14c, Settings 16c/16d/16e, Help & FAQ 12b.
4. **Pages curator (démo)** — Dashboard curator, Inbox 03c, My Playlists, Earnings 15a–15c, My profile curator (vue propriétaire du 03b).

Les plans 2–4 seront écrits une fois ce plan livré, en s'appuyant sur les composants qu'il produit.

## Global Constraints

- Interface en **anglais** ; le Figma est la référence visuelle (fichier `2HhgAcEIsgZm7tOcaergLH`, page Screens `4409:4`, Design System `4409:3`). Chaque écran se construit à partir de `get_design_context` sur son nœud (skill `figma:figma-design-to-code` obligatoire avant l'appel) puis se compare à `get_screenshot` du même nœud.
- Règles visuelles (`DESIGN.md`) : rayon ≤ 4 px (`rounded-full` uniquement avatars et pastilles de statut), pas de pilules, pas d'ombres douces, oblique **−12°** partout, **un seul** titre en dégradé par écran, 1–2 éléments rose par viewport.
- Formes obliques (Button Primary/Secondary/Outline, Chip, step indicator…) : **un seul pseudo-élément** `::before` en `skewX(-12deg)`, inset horizontal = hauteur × 0.1063, `z-index:-1` + `isolation:isolate` sur le parent (solution du prototype `css/style.css`). Jamais de forme en 3 morceaux.
- Texte en contour (écho du wordmark, numéros de step) : filtre SVG `#text-outline` (feMorphology dilate 1.5 → composite out → flood blanc), jamais `-webkit-text-stroke`.
- Icônes : `lucide-react` uniquement (le Figma `Icon/*` = Lucide). Logos non-Lucide (wordmark, Google, Apple, PayPal, Spotify) : SVG exportés du Figma dans `public/brand/`.
- Responsive : pages publiques et auth propres jusqu'à **375 px** ; pages app fidèles sous 1920 px, propres jusqu'à **768 px** (colonnes empilées, sidebar repliable, tableaux denses en défilement horizontal dans leur cadre) ; sous 768 px aucune barre de défilement horizontale de page.
- Auth : **e-mail + mot de passe uniquement**. Boutons Google / Spotify visibles, `disabled`, `title="Coming soon"`.
- E-mails : SMTP par défaut de Supabase (seuls les membres de l'équipe du projet reçoivent les e-mails ; c'est voulu).
- Supabase **offre gratuite**, région **UE (Frankfurt `eu-central-1` ou Paris `eu-west-3`)**.
- Audio : `.mp3`, `.flac`, `.wav` ; **50 Mo max par fichier**, vérifié dans le navigateur et sur le bucket. Message exact : `File too large — max 50 MB. Export as MP3 or FLAC.` Texte d'aide de la zone : `MP3, FLAC or WAV, up to 50 MB. Mastered audio only.`
- Fichiers : audio **privé** (URL signée) ; avatars, bannières, pochettes **publics**. Chemins toujours préfixés par `{user_id}/`.
- Données de démo : uniquement dans `src/mocks/` (typées), persona **Ilan Mercier** de `DESIGN.md` §11b. Jamais de données de démo en dur dans un composant.
- Variables d'env : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (serveur + tests uniquement, jamais importée côté client), `NEXT_PUBLIC_SITE_URL`.
- Windows / PowerShell 5.1 chez l'utilisateur : toute commande donnée à l'utilisateur doit fonctionner sans `&&`.
- `prefers-reduced-motion` respecté pour toute animation.

## Review Focus

1. **Compte vide** (aucun morceau, pas d'avatar, pas de bannière, pas de bio) : chaque page de l'app s'affiche sans erreur, avec avatar à initiales, bannière en dégradé de repli, carte d'upload pointillée seule dans la grille. → tests en Task 8 et Task 11.
2. **Connexion avec un e-mail non confirmé** : message clair `Please confirm your email first.` + lien de renvoi, pas d'erreur générique. → test en Task 6.
3. **Upload refusé ou interrompu** (fichier > 50 Mo, mauvais format, FLAC non décodable, coupure réseau) : message lisible, possibilité de réessayer, aucun morceau publié sans audio. → tests en Task 10 et Task 11.
4. **Textes longs, accents, emoji** dans nom, bio, titre : aucune mise en page cassée (troncature avec `…`), slug valide. → tests en Task 3 (slug) et Task 8.
5. **Deux utilisateurs avec le même nom** : slugs distincts (`ilan-mercier`, `ilan-mercier-2`). → test en Task 3.

---

## Structure des fichiers (verrouillée)

```
prototype/                      # ancien index.html, css/, js/, assets/ (référence, non servi)
public/brand/                   # wordmark.svg, logos sociaux, auth-photo.jpg, hero-bg.jpg
supabase/migrations/            # 0001_profiles_storage.sql, 0002_tracks.sql
src/
  app/
    layout.tsx                  # polices, <OutlineFilter/>, body midnight
    globals.css                 # Tailwind v4 @theme (tokens) + utilitaires .slant, .text-gradient
    page.tsx                    # Home provisoire (nav + CTA signup/login) — remplacée au plan 2
    design-system/page.tsx      # vitrine des composants, notFound() en production
    (auth)/layout.tsx           # AuthSplitLayout
    (auth)/signup/page.tsx                 # 02a rôle
    (auth)/signup/artist/page.tsx          # 02b
    (auth)/signup/curator/page.tsx         # 02c (« Professional »)
    (auth)/signup/check-email/page.tsx
    (auth)/login/page.tsx                  # 02d
    (auth)/forgot-password/page.tsx
    (auth)/reset-password/page.tsx
    auth/confirm/route.ts                  # verifyOtp(token_hash)
    (app)/layout.tsx                       # AppShell (top bar + sidebar), charge le profil
    (app)/dashboard/page.tsx ... (une page par route de lib/nav.ts)
    (app)/profile/page.tsx                 # 03a
    (app)/profile/upload/page.tsx          # 17a / 17b
    (app)/settings/layout.tsx              # sous-nav 16
    (app)/settings/profile/page.tsx        # 16a (réel)
    (app)/settings/account/page.tsx        # 16b (mot de passe réel)
    (app)/settings/{notifications,privacy,billing}/page.tsx  # en attente (plan 3)
  components/ui/                # Button, Chip, Tab, Input, Textarea, Checkbox, Switch, SectionBadge, Stat, CreditPill, Avatar, Wordmark, OutlineFilter, PendingPage
  components/app/               # AppTopBar, AppSidebar, NavItem, AppShell
  components/auth/              # AuthSplitLayout, AuthVisualPanel, RoleCard, SocialButton, StepIndicator
  components/profile/           # ProfileHeader, ProfileForm, ImageField, TrackCard, TrackGrid
  components/upload/            # UploadForm, AudioField, ArtworkField, PublishChecklist, PublishedPanel, Waveform
  lib/supabase/{server,client,admin}.ts
  lib/auth/guard.ts             # resolveRouteAccess (pur)
  lib/auth/actions.ts           # server actions auth
  lib/auth/schemas.ts           # zod
  lib/nav.ts                    # NAV_ITEMS + navFor(role)
  lib/profile/{actions,schemas,queries}.ts
  lib/storage/{images,resumable,paths}.ts
  lib/audio/{validate,waveform,duration}.ts
  lib/tracks/{actions,schemas,queries,checklist}.ts
  lib/password-strength.ts
  mocks/                        # index.ts + artist.ts (+ curator.ts aux plans suivants)
  types/db.ts                   # généré : npx supabase gen types typescript
  proxy.ts                      # refresh session + resolveRouteAccess
tests/
  unit/…                        # Vitest (jsdom)
  integration/…                 # Vitest contre Supabase cloud (RLS, triggers) — config séparée
  e2e/…                         # Playwright
  helpers/{users.ts,wav.ts}     # création/suppression d'utilisateurs via clé secrète ; WAV synthétique
```

Routes et rôles (source unique : `src/lib/nav.ts`) :

| Route | Libellé sidebar | Rôles | Icône Lucide |
|---|---|---|---|
| `/dashboard` | Dashboard | artist, curator | `LayoutDashboard`* |
| `/pitch` | Pitch to curators | artist | `Send` |
| `/rate` | Rate & earn | artist | `Headphones` |
| `/inbox` | Inbox | curator | `Inbox` |
| `/playlists` | My Playlists | curator | `ListMusic` |
| `/catalogue` | Catalogue | artist, curator | `Search` |
| `/messages` | Messages | artist, curator | `MessageCircle` |
| `/profile` | My profile | artist, curator | `User` |
| `/credits` | Credits & pricing | artist | `Coins` |
| `/earnings` | Earnings | curator | `Wallet` |
| `/settings` | Settings | artist, curator | `Settings`* |
| `/help` | Help & FAQ | artist, curator | `HelpCircle` |

\* L'ordre exact et les icônes suivent l'instance App Sidebar (`4426:67`) et la sidebar Pro du 03c (`4430:853`) ; la colonne Icône ci-dessus est la valeur par défaut si le Figma diverge. `/profile/upload` : artist uniquement.

---

### Task 1: Socle du dépôt, scaffold Next.js, outillage de test

**Files:**
- Move: `index.html`, `css/`, `js/`, `assets/` → `prototype/`
- Create: projet Next.js à la racine, `.env.example`, `.gitignore`, `vitest.config.ts`, `vitest.integration.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `.claude/launch.json`

**Interfaces:**
- Produces: scripts npm `dev`, `build`, `lint`, `test` (Vitest unit), `test:integration`, `test:e2e`, `db:types`.

- [ ] **Step 1:** Déplacer le prototype dans `prototype/` (garder `DESIGN.md`, `DEV-NOTES.md`, `ROADMAP-PROMPTS.md`, `STITCH-PROMPTS.md`, `docs/`, `.claude/` à la racine). Vérifier que `prototype/index.html` s'ouvre toujours via `http://localhost/ReachRadar/prototype/`.
- [ ] **Step 2:** Scaffold dans un dossier temporaire (create-next-app refuse un dossier non vide) : `npx create-next-app@latest _scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes`, puis déplacer le contenu de `_scaffold/` à la racine et supprimer `_scaffold/`. Ajouter `prototype/` aux `ignores` d'ESLint.
- [ ] **Step 3:** Installer : `@supabase/supabase-js @supabase/ssr zod lucide-react tus-js-client gsap` et en dev `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test supabase dotenv`. `npx playwright install chromium`.
- [ ] **Step 4:** Écrire `tests/unit/smoke.test.ts` (`expect(1 + 1).toBe(2)`) et `tests/e2e/smoke.spec.ts` (GET `/` → statut 200, `<html lang="en">`). Configs : Vitest unit = `tests/unit/**`, jsdom, alias `@`; integration = `tests/integration/**`, node, charge `.env.local`; Playwright = Chromium, `webServer: npm run dev`, `baseURL http://localhost:3000`.
- [ ] **Step 5:** Run `npm test` puis `npm run test:e2e` — Expected : 1 passed chacun.
- [ ] **Step 6:** `.env.example` avec les 4 variables (valeurs vides). `.gitignore` inclut `.env*.local`, `/test-results`, `/playwright-report`. `.claude/launch.json` : remplacer la config python par `{"name":"reachradar-next","runtimeExecutable":"npm","runtimeArgs":["run","dev"],"port":3000}`.
- [ ] **Step 7:** `git init`, branche `main`, commit `chore: scaffold Next.js app, move static prototype to prototype/`.

### Task 2: Tokens, polices, utilitaires de forme, vitrine design system

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/ui/OutlineFilter.tsx`, `src/components/ui/Wordmark.tsx`, `src/app/design-system/page.tsx`, `public/brand/*`
- Test: `tests/unit/tokens.test.ts`

**Interfaces:**
- Produces (classes Tailwind via `@theme`) : couleurs `midnight #0d1b2a`, `surface-1 #122338`, `surface-2 #182d45`, `surface-3 #1f3854`, `border-subtle rgb(119 141 169 / .2)`, `border-strong rgb(119 141 169 / .4)`, `rose #e54166`, `cyan #059bc0`, `slate #778da9`, `soft-white #eeeeee`, `success` et `warning` = valeurs des variables Figma `state/success` / `state/warning` (lire via `get_variable_defs` ; le prototype utilise `success #aceb98`). Polices `font-display` (Syne 500–800) et `font-body` (Inter 400–700, italic 700) via `next/font/google`. Utilitaires de texte = styles Figma : `text-display-hero`, `text-display-section`, `text-page-title` (Syne 800 40/44 uppercase), `text-heading-secondary`, `text-heading-h3`, `text-heading-card`, `text-body-lg`, `text-body-md`, `text-body-sm`, `text-body-long` (Inter 16/28), `text-metric-lg`, `text-label`, `text-label-strong`, `text-button`, `text-tab` — valeurs exactes lues dans les styles de texte Figma. Classe `.text-gradient` (dégradé titre `90deg #059bc0 0%, #fff 50%, #778da9 100%`). Classe `.slant` (pseudo-élément unique décrit dans Global Constraints, piloté par `--slant-h`, `--slant-bg`, `--slant-border`). `<OutlineFilter/>` rend le `<svg>` du filtre `#text-outline` ; classe `.text-outline` = `color:#fff; filter:url(#text-outline)`. `<Wordmark className?/>` (SVG `public/brand/wordmark.svg`).

- [ ] **Step 1:** Test `tokens.test.ts` : lit `globals.css` et vérifie la présence de `--color-midnight: #0d1b2a`, `--color-rose: #e54166`, `--color-cyan: #059bc0` et de `skewX(-12deg)`. Run → FAIL.
- [ ] **Step 2:** Écrire `@theme`, utilitaires, polices, `body { background: var(--color-midnight) }`. Exporter du Figma (via `get_design_context` sur les nœuds concernés, assets téléchargés avec curl) : wordmark, logos Google/Spotify/Apple/PayPal, photo du Auth Visual Panel (`4418:65`). Reprendre `prototype/assets/img/hero-bg.jpg`.
- [ ] **Step 3:** Run `npm test` → PASS.
- [ ] **Step 4:** `/design-system` : titre, palette, échelle typographique, wordmark + écho en `.text-outline` ; `notFound()` si `process.env.NODE_ENV === 'production'`. Vérifier dans le navigateur : rendu identique au prototype pour le wordmark et un bouton oblique de test.
- [ ] **Step 5:** Commit `feat: design tokens, fonts, slant and outline utilities`.

### Task 3: Supabase — projet, profils, rôle, slug, buckets images, RLS

**Prérequis utilisateur (à demander au début de la tâche, avec ces étapes exactes) :**
1. supabase.com → New project « reachradar », région **Central EU (Frankfurt)** ou **West EU (Paris)**, offre Free, noter le mot de passe DB.
2. Project Settings → API Keys : copier l'URL, la clé **publishable** et la clé **secret** dans `.env.local` (le constructeur crée le fichier, l'utilisateur colle les valeurs). `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
3. Authentication → Sign In / Providers → Email : « Confirm email » activé. Authentication → URL Configuration : Site URL `http://localhost:3000`, Redirect URLs `http://localhost:3000/**`.
4. Authentication → Emails → templates « Confirm signup » et « Reset password » : remplacer le lien par `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard` (confirm) et `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password` (reset).
5. Dans le terminal : `npx supabase login` (ouvre le navigateur), puis `npx supabase link --project-ref <ref>`.

**Files:**
- Create: `supabase/migrations/0001_profiles_storage.sql`, `src/types/db.ts`, `tests/helpers/users.ts`, `tests/integration/profiles.test.ts`

**Interfaces:**
- Produces (SQL) :
  - `type user_role as enum ('artist','curator')`, `type curator_type as enum ('playlist','label','radio','blog')`.
  - `public.profiles(id uuid pk references auth.users on delete cascade, role user_role not null, display_name text not null check (char_length between 2 and 60), slug text unique not null, bio text check (char_length <= 300), location text check (char_length <= 80), genres text[] not null default '{}' check (cardinality <= 5), links jsonb not null default '{}', avatar_path text, banner_path text, curator_type curator_type, created_at timestamptz default now(), updated_at timestamptz default now())`.
  - `create extension if not exists unaccent;`
  - `public.slugify_unique(name text) returns text` : minuscules, `unaccent`, tout ce qui n'est pas `[a-z0-9]` → `-`, tirets réduits/rognés, vide → `user` ; si pris, suffixe `-2`, `-3`…
  - Trigger `on_auth_user_created` (after insert on `auth.users`, `security definer`) : insère le profil depuis `raw_user_meta_data` (`role`, `display_name`, `curator_type`) et écrit `raw_app_meta_data = raw_app_meta_data || {"role": <role>}`. Rôle absent ou invalide → exception (l'inscription échoue).
  - Trigger `profiles_guard` (before update) : interdit le changement de `role`, `slug`, `id` ; met à jour `updated_at`.
  - RLS `profiles` : select pour `authenticated` ; update `using (id = auth.uid())` ; pas d'insert/delete client.
  - Buckets : `avatars` (public, 5 MB, `image/jpeg,image/png,image/webp`), `banners` (public, 10 MB, idem), `covers` (public, 10 MB, idem). Policies `storage.objects` : insert/update/delete si `(storage.foldername(name))[1] = auth.uid()::text`.
- Produces (TS) : `tests/helpers/users.ts` → `createTestUser({ role, displayName, confirmed = true, curatorType? }): Promise<{ id: string; email: string; password: string }>` (via `auth.admin.createUser` + `user_metadata`), `deleteTestUser(id: string): Promise<void>`, `signedInClient(email, password): Promise<SupabaseClient>`. E-mails de test : `rr-test+<uuid>@example.com`.

- [ ] **Step 1:** Test `profiles.test.ts` :
  - créer un artiste « Ilan Mercier » → `profiles.role === 'artist'`, `slug === 'ilan-mercier'`, `app_metadata.role === 'artist'` (via `auth.admin.getUserById`) ;
  - second « Ilan Mercier » → `slug === 'ilan-mercier-2'` ; « Éloïse ✨ Dupont » → `slug === 'eloise-dupont'` ;
  - `createTestUser({ role: 'admin' })` → rejette ;
  - client de l'artiste : `update({ role: 'curator' })` sur son profil → erreur ; `update({ bio: 'x' })` sur le profil d'un autre → 0 ligne modifiée ; `update({ bio: 'hello' })` sur le sien → OK ;
  - upload `avatars/<autre-id>/a.png` → refusé ; `avatars/<son-id>/a.png` → OK.
  - `afterAll` supprime tous les utilisateurs créés.
- [ ] **Step 2:** Run `npm run test:integration` → FAIL (table absente).
- [ ] **Step 3:** Écrire la migration ; `npx supabase db push` ; `npm run db:types` (`supabase gen types typescript --linked > src/types/db.ts`).
- [ ] **Step 4:** Run `npm run test:integration` → PASS.
- [ ] **Step 5:** Commit `feat(db): profiles, roles, slugs, image buckets with RLS`.

### Task 4: Clients Supabase, garde de routes, navigation par rôle

**Files:**
- Create: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/admin.ts`, `src/lib/auth/guard.ts`, `src/lib/nav.ts`, `src/proxy.ts`
- Test: `tests/unit/guard.test.ts`, `tests/unit/nav.test.ts`

**Interfaces:**
- Produces:
  - `createServerSupabase(): Promise<SupabaseClient<Database>>` (cookies Next), `createBrowserSupabase(): SupabaseClient<Database>`, `createAdminSupabase()` (fichier commence par `import 'server-only'`).
  - `type Role = 'artist' | 'curator'`.
  - `type NavItem = { href: string; label: string; icon: LucideIcon; roles: Role[] }` ; `NAV_ITEMS: NavItem[]` (table des routes ci-dessus) ; `navFor(role: Role): NavItem[]`.
  - `resolveRouteAccess(pathname: string, user: { role: Role } | null): { action: 'allow' } | { action: 'redirect'; to: string }`.
  - `proxy.ts` : rafraîchit la session (`@supabase/ssr`), lit `user.app_metadata.role`, applique `resolveRouteAccess`. Matcher excluant `_next`, `brand/`, fichiers statiques.

- [ ] **Step 1:** Tests `guard.test.ts` :
  - `('/dashboard', null)` → redirect `/login?next=%2Fdashboard` ; `('/settings/profile', null)` → redirect `/login?next=%2Fsettings%2Fprofile`.
  - `('/', null)`, `('/login', null)`, `('/signup/artist', null)`, `('/auth/confirm', null)`, `('/design-system', null)` → allow.
  - `('/login', {role:'artist'})` et `('/signup', {role:'curator'})` → redirect `/dashboard` ; `('/reset-password', {role:'artist'})` → allow.
  - `('/inbox', {role:'artist'})`, `('/playlists', …artist)`, `('/earnings', …artist)` → redirect `/dashboard`.
  - `('/pitch', {role:'curator'})`, `('/rate', …curator)`, `('/credits', …curator)`, `('/profile/upload', …curator)` → redirect `/dashboard`.
  - `('/pitch/anything', {role:'artist'})` → allow (préfixe).
- [ ] **Step 2:** Tests `nav.test.ts` : `navFor('artist').map(i => i.href)` contient `/pitch`, `/rate`, `/credits` et pas `/inbox`, `/playlists`, `/earnings` ; inverse pour `'curator'` ; les deux contiennent `/dashboard`, `/catalogue`, `/messages`, `/profile`, `/settings`, `/help`.
- [ ] **Step 3:** Run `npm test` → FAIL. Implémenter (le guard dérive les rôles autorisés de `NAV_ITEMS` par préfixe, plus l'entrée `/profile/upload` artist). Run → PASS.
- [ ] **Step 4:** Commit `feat(auth): supabase clients, role-based route guard and nav`.

### Task 5: Composants UI primitifs

**Files:**
- Create: `src/components/ui/{Button,Chip,Tab,Input,Textarea,Checkbox,Switch,SectionBadge,Stat,CreditPill,Avatar,PendingPage}.tsx`
- Modify: `src/app/design-system/page.tsx` (montre chaque variante)
- Test: `tests/unit/ui.test.tsx`

**Interfaces (Figma → props) :**
- `Button` (`4409:51`) : `{ variant: 'primary' | 'secondary' | 'outline' | 'ghost'; icon?: LucideIcon; iconPosition?: 'left' | 'right'; href?: string; loading?: boolean } & ButtonHTMLAttributes` — rend `<Link>` si `href`. Hauteur 48, `.slant` sauf ghost.
- `Chip` (`4410:9`) : `{ active?: boolean; onClick?; children }` — `aria-pressed` quand cliquable. Hauteur 34.
- `Tab` (`4409:59`) : `{ active: boolean; href?: string; children; count?: number }`.
- `Input` (`4410:40`) : `{ label: string; error?: string; trailing?: ReactNode } & InputHTMLAttributes` — états Default/Focus/Error ; `aria-invalid` + `aria-describedby` vers l'erreur.
- `Textarea` : `{ label: string; error?: string; maxLength?: number; showCount?: boolean }` — compteur `n / max`.
- `Checkbox` (`4417:70`), `Switch` (carré, on = fond cyan + knob sombre à droite, off = contour slate + knob à gauche, rayon 2) : `{ checked; onChange; label }`, `role="switch"` pour Switch.
- `SectionBadge` (`4409:52`) : `{ children: string }`. `Stat` (`4410:22`) : `{ value: string; label: string; accent?: 'rose' }`. `CreditPill` (`4410:10`) : `{ credits: number }`.
- `Avatar` : `{ src?: string | null; name: string; size: number }` — sans `src`, initiales (2 lettres max) sur dégradé cyan→slate, `rounded-full`.
- `PendingPage` : `{ title: string }` — titre en `text-page-title` dégradé + `Coming soon` en `text-body-md` muted (utilisé par les pages remplies aux plans 2–4).

- [ ] **Step 1:** Tests `ui.test.tsx` :
  - `Button` avec `href="/x"` rend un lien `href="/x"` ; `loading` → `aria-busy="true"` et `disabled`.
  - `Input` avec `error="Required"` → `aria-invalid="true"` et texte « Required » relié par `aria-describedby`.
  - `Textarea maxLength={300} showCount` après saisie de « hello » → affiche `5 / 300`.
  - `Chip` cliquable `active` → `aria-pressed="true"`.
  - `Switch` → `role="switch"`, clic appelle `onChange(true)`.
  - `Avatar` sans `src`, `name="Ilan Mercier"` → affiche `IM` ; `name="Éloïse"` → `É`.
- [ ] **Step 2:** Run → FAIL ; implémenter avec `get_design_context` sur chaque nœud ; Run → PASS.
- [ ] **Step 3:** Comparer `/design-system` au Figma (`get_screenshot` des nœuds) à 1920 px : pas de couture sur les formes obliques, angle constant quelle que soit la longueur du texte.
- [ ] **Step 4:** Commit `feat(ui): primitive components from the Figma design system`.

### Task 6: Écrans d'authentification et actions

**Files:**
- Create: `src/components/auth/*`, pages `(auth)/*`, `src/app/auth/confirm/route.ts`, `src/lib/auth/{schemas,actions}.ts`, `src/app/page.tsx` (home provisoire)
- Test: `tests/unit/auth-schemas.test.ts`, `tests/unit/auth-actions.test.ts`, `tests/e2e/auth.spec.ts`

**Interfaces:**
- Schémas zod (`schemas.ts`) : `signUpSchema = { role: 'artist'|'curator', displayName: 2–60 car. trimés, email, password: ≥ 8 car., terms: literal true, curatorType?: curator_type }` ; `signInSchema = { email, password: min 1 }` ; `emailSchema` ; `newPasswordSchema = { password ≥ 8, confirm }` avec `confirm === password` (message `Passwords don't match.`).
- Actions (`'use server'`), toutes `(prev: ActionState, formData: FormData) => Promise<ActionState>` avec `type ActionState = { ok: boolean; error?: string; fieldErrors?: Record<string, string> }` :
  - `signUp` → `auth.signUp({ email, password, options: { data: { role, display_name, curator_type }, emailRedirectTo: SITE_URL + '/auth/confirm' } })` puis `redirect('/signup/check-email?email=…')`.
  - `signIn` → `signInWithPassword` ; erreur `email_not_confirmed` → `error: 'Please confirm your email first.'` + `fieldErrors.resend = email` (le formulaire affiche un bouton « Resend email ») ; identifiants faux → `Wrong email or password.` ; succès → `redirect(next ?? '/dashboard')` (seulement si `next` commence par `/` et pas `//`).
  - `resendConfirmation`, `requestPasswordReset` (réponse identique que l'e-mail existe ou non : `If an account exists, we sent you a link.`), `updatePassword`, `signOut` (→ `/`).
- `auth/confirm/route.ts` : `GET ?token_hash&type&next` → `verifyOtp` → redirect `next` ; échec → `/login?error=link`.
- Écrans (Figma) : 02a `4418:219` (Role Card Artist / Professional → `/signup/artist` ou `/signup/curator`, Step Indicator 1), 02b `4419:208`, 02c `4420:263` (le choix « I run a… » alimente `curatorType`), 02d `4420:352`. Champs exactement comme dans le Figma ; un champ sans colonne dans `profiles` est affiché mais non envoyé. `check-email`, `forgot-password`, `reset-password` : même `AuthSplitLayout` (panneau photo `4418:65` à gauche, colonne formulaire 520 px), titre `text-page-title`, un Input, un Button primary. Boutons sociaux `4418:53` désactivés. Sous 1024 px le panneau photo est masqué.
- Home provisoire : wordmark + « Log in » / « Start pitching » (Button primary → `/signup`).

- [ ] **Step 1:** `auth-schemas.test.ts` : rôle `admin` rejeté ; `displayName` « A » rejeté, « Ilan Mercier » accepté ; mot de passe 7 car. rejeté ; `terms` absent rejeté ; `confirm` différent → `Passwords don't match.`
- [ ] **Step 2:** `auth-actions.test.ts` (client Supabase mocké via `vi.mock('@/lib/supabase/server')`) : `signIn` avec erreur `{ code: 'email_not_confirmed' }` → `{ ok:false, error:'Please confirm your email first.' }` ; `signIn` avec `next=//evil.com` → redirige vers `/dashboard` ; `signUp` passe `data.role='curator'` et `curator_type` ; `requestPasswordReset` renvoie le même message que l'e-mail existe ou non.
- [ ] **Step 3:** Run → FAIL ; implémenter ; Run → PASS.
- [ ] **Step 4:** `tests/e2e/auth.spec.ts` (utilisateurs via `tests/helpers/users.ts`) :
  - artiste confirmé : login → URL `/dashboard` (l'assertion sur le contenu de la sidebar est ajoutée en Task 7) ;
  - mauvais mot de passe → « Wrong email or password. » ;
  - utilisateur non confirmé (`confirmed:false`) → « Please confirm your email first. » + bouton « Resend email » ;
  - non connecté sur `/settings/profile` → `/login?next=%2Fsettings%2Fprofile`, puis login → `/settings/profile` ;
  - artiste sur `/inbox` → `/dashboard` ; curator sur `/pitch` → `/dashboard` ;
  - parcours 02a : clic Role Card Professional → `/signup/curator`.
  - (L'inscription réelle n'est pas testée en e2e : l'SMTP par défaut refuse les adresses hors équipe. Vérification manuelle à l'étape 6.)
- [ ] **Step 5:** Run `npm run test:e2e` → PASS (les pages `(app)` n'existent pas encore : créer pour cette tâche un `(app)/dashboard/page.tsx` minimal, remplacé en Task 7).
- [ ] **Step 6:** Vérification manuelle avec l'utilisateur : inscription avec son propre e-mail (membre de l'équipe Supabase) → e-mail reçu → lien → `/dashboard` connecté. Comparer chaque écran auth au Figma à 1920 px et vérifier 375 px.
- [ ] **Step 7:** Commit `feat(auth): sign up with role, email confirmation, log in, password reset`.

### Task 7: App shell (top bar, sidebar par rôle) et pages en attente

**Files:**
- Create: `src/components/app/{AppShell,AppTopBar,AppSidebar,NavItem}.tsx`, `src/app/(app)/layout.tsx`, une `page.tsx` par route de `NAV_ITEMS` (+ `settings/layout.tsx`, `settings/page.tsx` → redirect `/settings/profile`), `src/lib/profile/queries.ts`, `src/mocks/index.ts`, `src/mocks/artist.ts`
- Test: `tests/unit/sidebar.test.tsx`

**Interfaces:**
- `getCurrentProfile(): Promise<Profile>` (`lib/profile/queries.ts`, `cache()` React ; redirige `/login` si pas de session) — `type Profile = Database['public']['Tables']['profiles']['Row'] & { avatarUrl: string | null; bannerUrl: string | null }` (URLs publiques construites depuis les chemins).
- `AppShell({ profile, children })`. `AppTopBar` (`4426:30`) : recherche (non fonctionnelle), Credit Pill (artiste : `mocks.artist.credits`, curator : gains démo + « Withdraw » comme 03c), cloche, avatar + nom réels, menu compte (My profile, Settings, Log out). `AppSidebar` (`4426:67` artiste, version Pro du 03c `4430:853` curator) : `navFor(role)`, item actif selon le préfixe du pathname, promo bas de sidebar (artiste : progression crédits gratuits démo ; curator : « Stay verified » démo), Log out (action `signOut`). Sous 1024 px : sidebar repliée derrière un bouton menu dans la top bar (tiroir, `aria-expanded`).
- Mocks : `mocks/artist.ts` exporte au minimum `credits: { total: 36, purchased: 30, bonus: 6 }` et `freeCreditsProgress: { rated: 12, goal: 20 }` (valeurs du Figma 12 V2) ; `mocks/index.ts` réexporte.
- Pages en attente : `<PendingPage title="…"/>` avec le libellé de la sidebar.

- [ ] **Step 1:** `sidebar.test.tsx` : rendu `AppSidebar role="artist" pathname="/pitch/step-2"` → l'item « Pitch to curators » a `aria-current="page"`, pas d'item « Inbox » ; `role="curator"` → items « Inbox », « My Playlists », « Earnings » présents, « Rate & earn » absent ; bouton « Log out » présent.
- [ ] **Step 2:** Run → FAIL ; implémenter ; Run → PASS. Ajouter à `tests/e2e/auth.spec.ts` : après login artiste, la sidebar contient « Pitch to curators » et pas « Inbox » ; après login curator, l'inverse. Run `npm run test:e2e` → PASS.
- [ ] **Step 3:** Vérification visuelle à 1920 / 1280 / 768 / 375 px : shell conforme au Figma à 1920, tiroir sous 1024, aucune barre de défilement horizontale de page.
- [ ] **Step 4:** Commit `feat(app): role-aware app shell and pending pages`.

### Task 8: Settings · Profile (16a) et images

**Files:**
- Create: `src/app/(app)/settings/layout.tsx` (sous-nav 260 px : Profile / Account / Notifications / Privacy & data / Billing ; actif = surface-1 + barre rose 3 px), `settings/profile/page.tsx`, `src/components/profile/{ProfileForm,ImageField}.tsx`, `src/lib/profile/{schemas,actions}.ts`, `src/lib/storage/{images,paths}.ts`
- Test: `tests/unit/profile-schema.test.ts`, `tests/unit/images.test.ts`, `tests/e2e/profile.spec.ts`

**Interfaces:**
- `profileSchema` : `displayName` 2–60, `bio` ≤ 300 (vide → null), `location` ≤ 80, `genres` tableau ≤ 5 parmi `GENRES` (liste générique toutes musiques, électro en tête : House, Deep house, Techno, Melodic techno, Drum & bass, Afro house, Pop, Hip-hop, R&B, Rock, Indie, Jazz, Classical, Latin, Reggae, Metal, Folk, Ambient, Other), `links` objet des 6 champs du Figma 16a (clés `spotify`, `soundcloud`, `instagram`, `youtube`, `tiktok`, `website` sauf si le Figma nomme autrement), chacun URL `https://` valide ou vide.
- `updateProfile(prev, formData): Promise<ActionState>` (met à jour la ligne de l'utilisateur ; `revalidatePath('/', 'layout')`).
- `validateImage(file: File, kind: 'avatar' | 'banner' | 'cover'): { ok: true } | { ok: false; error: string }` — types jpeg/png/webp ; tailles max avatar 5 MB, banner 10 MB, cover 10 MB ; messages `Use a JPG, PNG or WebP image.` / `Image too large — max 5 MB.` (10 MB selon le cas). Dimensions minimales vérifiées via `createImageBitmap` dans `checkImageDimensions(file, kind)` : banner ≥ 1600×400 (`Banner must be at least 1600 × 400 px.`), cover carrée ≥ 1000×1000 (`Artwork must be square, at least 1000 × 1000 px.`), avatar ≥ 200×200.
- `storagePath(userId: string, kind: 'avatar'|'banner'|'cover'|'track', ext: string): string` → `${userId}/${kind}-${Date.now()}.${ext}`.
- `uploadProfileImage(kind: 'avatar'|'banner', file: File): Promise<string>` (client : upload direct, puis action `setProfileImage(kind, path)` qui enregistre le chemin et supprime l'ancien fichier) ; `removeProfileImage(kind)`.
- Écran 16a `4543:5645` : avatar 80 px + « Change photo » / « Remove », dropzone bannière pointillée (texte `JPG or PNG · 1600 × 400 min.`), nom, bio + compteur, localisation, genres en Chips (`Up to 5.`), liens en 2 colonnes, Save changes / Cancel (Ghost). Toast succès vert 8 % comme 16b.

- [ ] **Step 1:** `profile-schema.test.ts` : bio de 301 car. rejetée ; 6 genres rejetés ; lien `javascript:alert(1)` rejeté ; `https://open.spotify.com/artist/x` accepté ; nom « 🎧 Ilan » accepté.
- [ ] **Step 2:** `images.test.ts` : `validateImage` d'un `File` `image/gif` → `Use a JPG, PNG or WebP image.` ; avatar 6 MB → `Image too large — max 5 MB.` ; banner 9 MB png → ok ; `storagePath('u1','avatar','png')` correspond à `/^u1\/avatar-\d+\.png$/`.
- [ ] **Step 3:** Run → FAIL ; implémenter ; Run → PASS.
- [ ] **Step 4:** `profile.spec.ts` : artiste sans avatar → `/settings/profile` affiche les initiales ; changer le nom en « Ilan Mercier Live », la bio, 2 genres, uploader un avatar PNG 400×400 (fixture générée dans le test) → Save → recharger : valeurs et avatar persistés, top bar mise à jour ; bio de 320 car. → impossible d'en saisir plus de 300 (compteur `300 / 300`).
- [ ] **Step 5:** Run → PASS. Comparer au Figma 16a à 1920 et vérifier 768.
- [ ] **Step 6:** Commit `feat(profile): editable profile with avatar and banner uploads`.

### Task 9: Settings · Account (16b) — changement de mot de passe

**Files:**
- Create: `src/app/(app)/settings/account/page.tsx`, `src/lib/password-strength.ts`, action `changePassword` dans `src/lib/auth/actions.ts`
- Test: `tests/unit/password-strength.test.ts`, ajout dans `tests/unit/auth-actions.test.ts`

**Interfaces:**
- `passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4` — +1 par critère : longueur ≥ 8, ≥ 12, mélange minuscules/majuscules, chiffre ou symbole ; vide → 0. Barre 4 segments verte.
- `changePassword(prev, formData)` : champs `current`, `password`, `confirm` ; re-vérifie `current` via `signInWithPassword` (e-mail de la session) → faux : `fieldErrors.current = 'Current password is incorrect.'` ; puis `updateUser({ password })` ; succès → `{ ok: true }` et toast `Password updated`.
- Écran 16b `4544:5847` : e-mail + « Verified » ; bloc mot de passe réel ; « Connected accounts » et « Account type » affichés en démo (boutons inactifs).

- [ ] **Step 1:** Tests : `passwordStrength('')===0`, `('abcdefgh')===1`, `('abcdefghijkl')===2`, `('Abcdefghijkl')===3`, `('Abcdefghijk1')===4` ; `changePassword` avec mauvais mot de passe actuel → `fieldErrors.current` ; confirm différent → `Passwords don't match.`
- [ ] **Step 2:** Run → FAIL ; implémenter ; Run → PASS.
- [ ] **Step 3:** Commit `feat(settings): account page with real password change`.

### Task 10: Morceaux — schéma, bucket audio, validation, forme d'onde, upload résumable

**Files:**
- Create: `supabase/migrations/0002_tracks.sql`, `src/lib/audio/{validate,waveform,duration}.ts`, `src/lib/storage/resumable.ts`, `tests/helpers/wav.ts`
- Test: `tests/unit/audio-validate.test.ts`, `tests/unit/waveform.test.ts`, `tests/integration/tracks.test.ts`

**Interfaces:**
- SQL :
  - `type track_status as enum ('draft','published')`, `type release_status as enum ('released','upcoming','demo')`.
  - `public.tracks(id uuid pk default gen_random_uuid(), owner_id uuid not null references profiles on delete cascade, status track_status not null default 'draft', title text check (char_length <= 100), featuring text, release_status release_status, release_date date, private_link text, explicit boolean not null default false, genre_primary text, genre_secondary text, moods text[] not null default '{}' check (cardinality <= 3), bpm int check (bpm between 40 and 250), musical_key text, vocals text, duration_seconds int, isrc text check (isrc ~ '^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$'), rights_confirmed boolean not null default false, audio_path text, audio_format text, audio_size_bytes bigint, cover_path text, waveform jsonb, created_at, updated_at, published_at timestamptz)`.
  - Contrainte `published_requires_fields` : `status = 'draft' or (audio_path is not null and cover_path is not null and title is not null and release_status is not null and genre_primary is not null and bpm is not null and rights_confirmed)`.
  - RLS : select `owner_id = auth.uid() or status = 'published'` ; insert/update/delete `owner_id = auth.uid()` ; seul un profil `role = 'artist'` peut insérer.
  - Bucket `tracks` : privé, `file_size_limit` 50 MB, MIME `audio/mpeg, audio/mp3, audio/flac, audio/x-flac, audio/wav, audio/x-wav, audio/wave, audio/vnd.wave`. Policies : insert/select/update/delete si premier dossier = `auth.uid()`.
- TS :
  - `validateAudioFile(file: File): { ok: true; format: 'mp3'|'flac'|'wav' } | { ok: false; error: string }` — extension **et** MIME (MIME vide accepté si extension valide) ; > 50 × 1024 × 1024 → `File too large — max 50 MB. Export as MP3 or FLAC.` ; autre format → `Use an MP3, FLAC or WAV file.`
  - `computePeaks(channels: Float32Array[], bars = 150): number[]` — pour chaque tranche, max des valeurs absolues sur tous les canaux, normalisé par le max global, arrondi à 3 décimales ; silence complet → tableau de zéros.
  - `decodeAudio(file: File): Promise<{ peaks: number[]; durationSeconds: number } | null>` — `AudioContext.decodeAudioData` ; échec de décodage → `null` (l'upload continue, forme d'onde de repli plate, durée vide).
  - `uploadResumable({ bucket, path, file, onProgress, signal }): Promise<void>` — `tus-js-client`, endpoint `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`, en-têtes `authorization: Bearer <access_token>`, `x-upsert: false`, `chunkSize: 6 * 1024 * 1024`, `retryDelays: [0, 3000, 5000, 10000]`, métadonnées `bucketName`, `objectName`, `contentType`, `cacheControl: '3600'`. Rejette avec `Upload failed — check your connection and try again.`
  - `makeWav(seconds: number, sampleRate = 44100): Uint8Array` (helper de test, sinus 440 Hz mono 16 bits).

- [ ] **Step 1:** `audio-validate.test.ts` : `song.mp3` `audio/mpeg` 5 MB → ok `mp3` ; `song.flac` MIME vide → ok `flac` ; `song.wav` 51 MB → message exact 50 MB ; `song.ogg` → `Use an MP3, FLAC or WAV file.` ; `song.mp3` MIME `video/mp4` → refusé.
- [ ] **Step 2:** `waveform.test.ts` : `computePeaks([new Float32Array(300).fill(0)])` → 150 zéros ; signal dont la seconde moitié vaut 0.5 et la première 0.25 → premières valeurs 0.5, dernières 1 ; deux canaux → max des deux.
- [ ] **Step 3:** `tracks.test.ts` (intégration) : un curator ne peut pas insérer de track ; un artiste insère un draft vide → OK ; passer en `published` sans audio → erreur de contrainte ; upload `tracks/<autre-id>/x.wav` → refusé ; fichier `application/pdf` renommé `.wav` → refusé par le bucket ; un autre artiste ne voit pas un draft mais voit un published.
- [ ] **Step 4:** Run → FAIL ; migration + `db push` + `db:types` ; implémenter ; Run unit + integration → PASS.
- [ ] **Step 5:** Commit `feat(tracks): tracks table, private audio bucket, validation, waveform, resumable upload`.

### Task 11: Upload a track (17a / 17b) et My profile (03a)

**Files:**
- Create: `src/app/(app)/profile/upload/page.tsx`, `src/components/upload/*`, `src/lib/tracks/{schemas,actions,queries,checklist}.ts`, `src/app/(app)/profile/page.tsx`, `src/components/profile/{ProfileHeader,TrackCard,TrackGrid}.tsx`
- Test: `tests/unit/checklist.test.ts`, `tests/unit/track-schema.test.ts`, `tests/e2e/upload.spec.ts`

**Interfaces:**
- `trackSchema` (zod) aligné sur la table ; `moods` ≤ 3 parmi `MOODS` (Euphoric, Dark, Hypnotic, Melancholic, Uplifting, Chill, Groovy, Aggressive, Dreamy, Romantic) ; `bpm` 40–250 ; `isrc` format ci-dessus ou vide.
- `publishChecklist(t: Partial<TrackDraft>): { items: { key: 'audio'|'artwork'|'title'|'genre'|'isrc'|'rights'; label: string; done: boolean; optional: boolean }[]; doneCount: number; canPublish: boolean }` — libellés exacts du Figma : `Mastered audio`, `Artwork 1000 × 1000+`, `Title and release status`, `Genre and BPM`, `ISRC code` (optionnel), `Rights confirmed` ; `canPublish` = tous les non-optionnels faits.
- Actions : `createDraftTrack(): Promise<{ id: string }>` (appelée à la sélection du fichier audio pour obtenir un id), `saveTrack(id, prev, formData): Promise<ActionState>` (status reste draft), `publishTrack(id, prev, formData): Promise<ActionState>` (→ published, `published_at = now()`, `redirect('/profile/upload?published=<id>')`), `deleteTrack(id)` (supprime aussi les fichiers).
- Flux audio : `validateAudioFile` → `createDraftTrack` → `uploadResumable` (barre de progression verte, % réel, bouton Annuler) en parallèle de `decodeAudio` → enregistrement `audio_path`, `audio_format`, `audio_size_bytes`, `duration_seconds`, `waveform`. Lecture : URL signée 1 h via `createSignedUrl` + `<audio>` piloté par le carré play cyan ; la forme d'onde 150 barres colore la partie lue en cyan.
- `getMyTracks(): Promise<TrackWithUrls[]>` (drafts + published de l'utilisateur, `coverUrl` public, triés par `updated_at desc`).
- Écran 17a `4546:6392` : fil d'Ariane « My profile / Upload a track », panneaux numérotés 01 Audio, 02 Artwork, 03 Details (release status en Chips Released / Upcoming / Demo + note `Demos can be pre-tested but not pitched.`), 04 Tags, 05 Rights ; colonne droite : aperçu Track Card, checklist `Ready to publish n / 6`, **Publish track** (désactivé tant que `!canPublish`) + « Save as draft ». BPM/key : saisie manuelle (pas de badge « Auto-detected »). 17b `4547:6744` : panneau vert « {title} is live », **Pitch this track now** (rose, → `/pitch`) + « Pre-test it first · free » (Secondary, → `/rate`).
- Écran 03a `4427:362` (My profile, artiste) : bannière réelle (repli : dégradé midnight→surface-2 + motif points du prototype), avatar réel chevauchant, nom, rôle, localisation, bio, genres, liens (icônes Lucide ou logos `public/brand/`), actions Share (copie l'URL) / Edit (→ `/settings/profile`) / **Pitch a track** (→ `/pitch`) ; onglets (seul « Tracks » actif) ; grille 3 colonnes de `TrackCard` réelles (draft avec tag « Draft ») + carte pointillée « Upload a track » en dernier ; colonne droite 400 px en démo (`mocks/artist.ts` : pitch stats, recent feedback, credit balance). Curator : même `ProfileHeader`, sans grille de morceaux (vue complète au plan 4).

- [ ] **Step 1:** `checklist.test.ts` : brouillon vide → `doneCount 0`, `canPublish false` ; tout sauf ISRC → `doneCount 5`, `canPublish true` ; tout sauf rights → `canPublish false`.
- [ ] **Step 2:** `track-schema.test.ts` : 4 moods rejetés ; bpm 300 rejeté ; isrc `FRZ032400001` accepté, `123` rejeté ; titre de 120 car. rejeté.
- [ ] **Step 3:** Run → FAIL ; implémenter ; Run → PASS.
- [ ] **Step 4:** `upload.spec.ts` :
  - artiste neuf → `/profile` : grille avec uniquement la carte « Upload a track », initiales dans l'avatar, aucune erreur console ;
  - upload d'un WAV de 3 s (`makeWav(3)`) + pochette PNG 1000×1000 générée, titre, Upcoming, genre, BPM 124, rights → checklist `5 / 6` → Publish → panneau « … is live » → `/profile` montre la carte ; clic play → `audio.currentTime > 0` après 1 s ;
  - fichier `.ogg` → `Use an MP3, FLAC or WAV file.` et aucun draft créé ;
  - fichier > 50 Mo (Buffer de 51 Mo nommé `big.wav`) → message 50 MB exact, aucun envoi réseau vers `/storage/v1/upload` ;
  - titre de 100 car. avec emoji → carte tronquée avec `…`, pas de débordement (largeur de la carte inchangée).
- [ ] **Step 5:** Run → PASS. Comparer 17a, 17b, 03a au Figma à 1920 ; vérifier 768.
- [ ] **Step 6:** Commit `feat(tracks): upload flow with publish checklist, real tracks on My profile`.

### Task 12: GitHub, Vercel, production

**Prérequis utilisateur :**
1. `gh auth status` doit être connecté (sinon l'utilisateur lance `gh auth login` lui-même).
2. vercel.com → Add New → Project → importer le dépôt GitHub `reachradar` (le constructeur crée le dépôt à l'étape 1), framework Next.js, variables d'env : les 4 de `.env.local` avec `NEXT_PUBLIC_SITE_URL=https://<domaine-vercel>`.
3. Supabase → Authentication → URL Configuration : Site URL = l'URL de production Vercel ; Redirect URLs : ajouter `https://<domaine-vercel>/**` et `https://*-<team>.vercel.app/**` (prévisualisations).

**Files:**
- Create: `README.md` (démarrage local, variables, commandes de test, déploiement), `tests/e2e/prod-smoke.spec.ts`

- [ ] **Step 1:** `npm run lint`, `npm test`, `npm run build` → tout passe sans erreur.
- [ ] **Step 2:** `gh repo create reachradar --private --source . --push` (après confirmation de l'utilisateur, publication sortante).
- [ ] **Step 3:** L'utilisateur fait les prérequis 2 et 3 ; attendre le premier déploiement « Ready ».
- [ ] **Step 4:** `prod-smoke.spec.ts` (lancé avec `BASE_URL=https://<domaine>`) : `/` 200 ; `/dashboard` sans session → `/login?next=%2Fdashboard` ; `/design-system` → 404 ; login d'un utilisateur de test → `/dashboard`. Run → PASS.
- [ ] **Step 5:** Vérification manuelle avec l'utilisateur en production : inscription avec son e-mail → confirmation → upload d'un morceau → lecture.
- [ ] **Step 6:** Commit `docs: README and production smoke test`, push → déploiement automatique.

---

## Après ce plan

Écrire le plan 2 (pages marketing) en partant de `prototype/` et des composants de ce plan, puis les plans 3 et 4.
