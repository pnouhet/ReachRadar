# ReachRadar Plan 2 — Marketing & Public Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the provisional home with the real public site: Home (Figma 01 + GSAP prototype), Pricing (06), the five Legal documents (09a–09e), the shared marketing header and footer, and a working cookie banner.

**Architecture:** A `(marketing)` route group with its own layout (site header + footer + cookie banner) holds `/`, `/pricing` and `/legal/[doc]`. All copy and demo numbers live in typed files under `src/content/`; components only render them. GSAP runs in one client component per page that animates server-rendered markup through `data-*` hooks, so the HTML is complete and readable without JavaScript.

**Tech Stack:** Next.js 16.4.5 App Router, React 19.3, Tailwind v4 tokens in `src/app/globals.css`, GSAP 3.15 + ScrollTrigger (already installed), lucide-react, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-08-reachradar-app-design.md` (§2 anti-objectives, §3 responsive, §4 public pages, §7 components). Visual reference: `prototype/` (index.html, css/style.css, js/main.js) and Figma file `2HhgAcEIsgZm7tOcaergLH`.

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code (AGENTS.md).
- Load the `figma:figma-design-to-code` skill before any `get_design_context` call. Reuse Figma session `1dea5169-03d9-42a0-a017-8c0221e6e776`. Compare each built page with `get_screenshot` of its node.
- Figma nodes:
  - Home `4410:41`.
  - Pricing `4447:2279`: hero `4447:2280`, packs `4449:2296`, earn `4450:2339`, FAQ `4450:2429`, payments `4450:2471`.
  - Privacy `4464:3077`, Cookies `4465:3290`, GDPR `4467:3233`, Terms `4467:3539`, Legal notice `4467:3846`.
  - Footer `4432:3283`, Cookie Banner `4465:3260`, Legal Nav `4468:9314`.
- Interface language: English. Lucide for every generic icon. Brand-specific marks (wordmark, socials, payment logos, section badges) are SVG files under `public/`.
- `DESIGN.md` rules:
  - Corner radius ≤ 4 px, no pills, no soft shadows.
  - Slant angle exactly −12°, using the existing `.slant` utility.
  - At most **one gradient title per screen** (`text-gradient`).
  - At most 1–2 rose elements per viewport.
- Responsive:
  - Faithful at 1920 px.
  - Clean down to **375 px**, with no horizontal page overflow.
  - Prototype breakpoints: 1280 / 1100 / 860 / 560.
- Motion must respect `prefers-reduced-motion`: with reduce, nothing animates and nothing stays hidden.
- Demo data and copy live only in `src/content/*`, never inline in components.
- No new runtime dependency.
- Work on branch `plan-2-marketing` from `main`. Commit after each task.

## Decisions taken here (not drawn in Figma)

- **Menu button:** opens a full-height panel (`role="dialog"`, Esc and the close button dismiss it, focus returns to the button). It lists Home, Pricing, Catalogue, Log in, Sign up and the five legal pages.
- **Search button:** links to `/catalogue`. The proxy already sends guests to log in.
- **Header CTA:**
  - Guests: "Sign Up" → `/signup` on Home and Pricing; "Sign In/Sign Up" → `/login` on Legal (Figma labels).
  - Signed-in visitors: "Dashboard" → `/dashboard`.
- **Pricing "Buy N credits" target:**
  - Guests → `/signup`.
  - Signed-in, view role `artist` (including admins in artist view) → `/credits`.
  - Curators → `/dashboard`.
- **Footer links** come from `SITE_LINKS` (Task 1).
  - Pages that don't exist yet (Blog, Careers, About) render as muted, non-link text with `title="Coming soon"`.
  - Social icons are not links.
  - "EN / FR" is plain text.
  - The newsletter form validates the e-mail and shows "Thanks! Curator drops are coming soon." It stores nothing.
- **Download PDF** on legal pages calls `window.print()`. A print stylesheet hides the header, footer, TOC and banner.
- **Cookie consent:**
  - Stored in cookie `rr_consent` (name from the Figma cookie table): value `v1.<a>.<m>` (`a`/`m` = `0|1`), `max-age` 15 552 000 s (6 months), `path=/`, `SameSite=Lax`.
  - Malformed values count as "no choice yet".
  - No analytics or marketing script exists, so consent only gates future scripts.
- **Banner placement and buttons:**
  - Shows on every marketing page and on the auth pages until a choice is saved. App pages don't show it.
  - "Customize" goes to `/legal/cookies#preferences`.

## Review Focus

1. **Anchor targets under the fixed header.** TOC links, `#get-heard` and `#preferences` must land with the heading visible below the header, so every anchored section needs `scroll-margin-top`. Test owned by Task 5.
2. **No-JS or reduced-motion visitors.** Content must never stay hidden: the `anim-pending` failsafe clears after 2.5 s, and reduced motion skips every `from()`. Tests owned by Task 3.
3. **Malformed or old `rr_consent` cookie.** It is treated as no choice: the banner shows and nothing throws. Test owned by Task 2.
4. **Signed-in visitors on public pages.** They get the Dashboard CTA and role-aware Buy targets, never a redirect loop. Tests owned by Tasks 1 and 4.
5. **375 px on every public page.** Pricing cards stack, the legal cookie table scrolls inside its frame, the footer columns wrap, and no page scrolls horizontally. Test owned by Task 6.

---

### Task 1: Marketing shell — header, menu, footer, route group

**Files:**
- Create: `src/app/(marketing)/layout.tsx`, `src/components/site/SiteHeader.tsx`, `src/components/site/SiteMenu.tsx`, `src/components/site/SiteFooter.tsx`, `src/components/site/NewsletterForm.tsx`, `src/components/site/SocialIcons.tsx`, `src/lib/site.ts`, `src/lib/auth/session.ts`
- Move: `src/app/page.tsx` → `src/app/(marketing)/page.tsx` (still the provisional body; Task 3 replaces it)
- Assets: copy the needed files from `prototype/assets/` to `public/home/` (icons and images); export the social SVGs from the Footer node.
- Modify: `src/app/layout.tsx` (add `suppressHydrationWarning` on `<html>`, needed by Task 3's inline script)
- Test: `tests/unit/site.test.ts`, `tests/e2e/marketing-shell.spec.ts`

**Interfaces:**
- Produces:
  - `src/lib/site.ts`:
    - `type SiteLink = { label: string; href: string | null }` (null means "Coming soon", rendered as text).
    - `SITE_LINKS: { title: "Product" | "Community" | "Company" | "Legal"; links: SiteLink[] }[]`.
    - `LEGAL_DOCS: { slug: LegalSlug; label: string }[]`, in the order Privacy policy, GDPR, Cookies, Terms of use, Legal notice.
    - `type LegalSlug = "privacy" | "gdpr" | "cookies" | "terms" | "legal-notice"`.
    - `buyCreditsHref(viewer: { role: Role } | null): string`.
  - `src/lib/auth/session.ts`: `getViewer(): Promise<{ role: Role } | null>` (server-only). It uses the view role from `getProfile`/`viewRoleFor`, the same way the app does.
  - `<SiteHeader signedIn={boolean} />` (client). It picks the `overlay` variant (transparent → blurred when `scrollY > 40`, like the prototype) or the `solid` variant (midnight background + bottom border, Legal Nav) from `usePathname().startsWith("/legal")`.
  - `<SiteFooter />` (server).
- Consumes: `Button`, `Wordmark`, `viewRoleFor`, `Role`.

- [ ] **Step 1: Write the failing tests.**
  - `tests/unit/site.test.ts`:
    - `buyCreditsHref(null)` is `/signup`; `{role:"artist"}` gives `/credits`; `{role:"curator"}` gives `/dashboard`.
    - Every non-null `SITE_LINKS` href starts with `/`.
    - The Legal column hrefs equal `LEGAL_DOCS.map(d => "/legal/" + d.slug)`.
    - Footer link map:
      - Pitch to curators `/pitch`, Rate & earn `/rate`, Credit packs `/pricing`, Catalogue `/catalogue`.
      - Artist chat `/messages`, Find collabs `/messages`, Success stories `/#stories`, Blog null.
      - About null, For curators `/signup`, Careers null, Contact `/legal/legal-notice#contact`.
  - `tests/e2e/marketing-shell.spec.ts`:
    - On `/` a guest sees a `banner` landmark with the link "Sign Up" → `/signup`, plus `contentinfo` with headings Product/Community/Company/Legal.
    - The menu button "Open menu" opens a dialog containing the link "Pricing". Esc closes it and focus returns to the button.
    - After `logIn(page, artist)` and `goto("/")`, the header shows the link "Dashboard".
    - Newsletter: submitting `not-an-email` shows the Input error; `you@artist.com` shows "Thanks! Curator drops are coming soon."
- [ ] **Step 2: Run `npx vitest run tests/unit/site.test.ts`.** Expected: FAIL (module not found).
- [ ] **Step 3: Implement `src/lib/site.ts` and `src/lib/auth/session.ts`.**
- [ ] **Step 4: Build the header, menu and footer from the Figma Footer node and the prototype.**
  - Layout: header grid `160px 1fr 160px`, wordmark max 400 px; footer per `prototype/css/style.css` `.footer*`.
  - Use the existing `Input` and `Button variant="secondary"` in the newsletter.
  - `(marketing)/layout.tsx` awaits `getViewer()` and renders `<SiteHeader signedIn>`, `{children}`, `<SiteFooter />`.
- [ ] **Step 5: Run the unit tests and `npx playwright test marketing-shell`.** Expected: PASS.
- [ ] **Step 6: Commit** `feat(site): marketing layout with header, menu and footer`.

### Task 2: Cookie consent — cookie, banner, preferences panel

**Files:**
- Create: `src/lib/consent.ts`, `src/components/site/CookieBanner.tsx`, `src/components/site/CookiePreferences.tsx`
- Modify: `src/app/(marketing)/layout.tsx`, `src/components/auth/AuthSplitLayout.tsx` (render the banner; restore `prefetch` on the legal links and remove the comment)
- Test: `tests/unit/consent.test.ts`, `tests/unit/cookie-preferences.test.tsx`, `tests/e2e/cookies.spec.ts`

**Interfaces:**
- Produces:
  - `src/lib/consent.ts`:
    - `type Consent = { analytics: boolean; marketing: boolean }`.
    - `CONSENT_COOKIE = "rr_consent"`, `CONSENT_MAX_AGE = 15_552_000`.
    - `parseConsent(value: string | undefined): Consent | null`.
    - `serializeConsent(c: Consent): string`.
    - `writeConsent(c: Consent): void` (client, `document.cookie`; dispatches `window` event `rr-consent`).
  - `<CookieBanner initial={Consent | null} />`: renders nothing when `initial` is set or after a choice. It listens to `rr-consent` so a save on the cookie page hides it.
  - `<CookiePreferences initial={Consent | null} />`:
    - Rows: Strictly necessary ("Always on"), Analytics `Switch`, Marketing `Switch`.
    - Buttons: Reject all, Accept all, "Save my choices".
    - A `role="status"` line reading "Your choices are saved for 6 months. We'll ask again after that."
- Consumes: `Switch`, `Button`, `cookies()` from `next/headers` (layouts read the cookie and pass `initial`).

- [ ] **Step 1: Write the failing tests.**
  - `consent.test.ts`:
    - `serializeConsent({analytics:true,marketing:false})` is `"v1.1.0"`.
    - It round-trips through `parseConsent`.
    - `parseConsent` returns `null` for `undefined`, `""`, `"v1.2.0"`, `"v0.1.1"`, `"v1.1"` and `"%%%"`.
  - `cookie-preferences.test.tsx`:
    - Toggling Analytics then "Save my choices" calls `writeConsent({analytics:true, marketing:false})` (mock the module).
    - "Reject all" writes both false.
  - `cookies.spec.ts` (fresh context):
    - `/` shows the region "We use cookies". "Reject all" hides it, and it stays hidden after reload; the `rr_consent` cookie equals `v1.0.0`.
    - A context seeded with `rr_consent=garbage` shows the banner.
    - "Customize" lands on `/legal/cookies#preferences`.
    - `/login` shows the banner.
- [ ] **Step 2: Run `npx vitest run tests/unit/consent.test.ts tests/unit/cookie-preferences.test.tsx`.** Expected: FAIL.
- [ ] **Step 3: Implement the consent library, then the banner and preferences from nodes `4465:3260` and `4465:3290`.**
  - The banner is `role="region" aria-label="We use cookies"`.
  - It sits fixed at the bottom, centered, max-width 1300 px.
  - Buttons: Customize and Reject all are secondary, Accept all is primary.
- [ ] **Step 4: Run the unit tests and `npx playwright test cookies` (the legal-page part waits for Task 5: mark it `test.fixme` until then).** Expected: PASS.
- [ ] **Step 5: Commit** `feat(site): cookie banner and consent preferences`.

### Task 3: Home page — port of the prototype with GSAP

**Files:**
- Create: `src/content/home.ts`
- Create: `src/components/home/`:
  - `Hero.tsx`, `Intro.tsx`, `LiveSection.tsx`, `Promises.tsx`, `Categories.tsx`, `PreTest.tsx`, `RateEarn.tsx`, `Community.tsx`, `Testimonials.tsx`, `FinalCta.tsx`
  - `HomeMotion.tsx` (client), `AnimGate.tsx`
- Modify: `src/app/(marketing)/page.tsx` (replace the provisional home), `src/app/globals.css` (add `.anim-pending [data-anim] { visibility: hidden }` and the home keyframes `nudge` and `pulse`)
- Test: `tests/e2e/home.spec.ts`, `tests/unit/home-content.test.ts`

**Interfaces:**
- Produces: `HOME` in `src/content/home.ts`, with every string, number and image path the prototype hard-codes:
  - `stats`, `promises`, `categories`, `preTest`, `rateEarn` (waveform heights, played = 27), `community`, `testimonials`, `final`.
  - Section anchors: `get-heard` and `stories` (Testimonials).
- Consumes: `SectionBadge`, `Button`, `Chip`, `OutlineFilter` (already in the root layout), `SITE_LINKS`/routes from Task 1.

- [ ] **Step 1: Write the failing tests.**
  - `home-content.test.ts`:
    - `HOME.rateEarn.waveform.length === 68`.
    - `HOME.categories.length === 4`; `HOME.promises.length === 3`; `HOME.testimonials.length === 3`.
    - Every image path in `HOME` exists under `public/` (`fs.existsSync`).
  - `home.spec.ts`:
    - The `h1` has accessible name "ReachRadar".
    - The link "Start pitching" goes to `/signup`; "Rate songs, earn credits" goes to `/rate`.
    - `h2` headings in order: "Get heard by new fans", "Go ahead, live from your music !", "Three promises", "Pitch to the right ears", "Test before you pitch", "Rate & earn", "Find your next collab", "Artists who got heard", "Your next fans are listening".
    - Exactly one element with class `text-gradient` is inside the hero viewport.
    - No `pageerror` and no console error.
    - "Scroll down" moves to `#get-heard`.
    - With `test.use({ reducedMotion: "reduce" })`, every `h2` is visible right after load.
    - With `javaScriptEnabled: false`, the `h1` and "Start pitching" are visible.
    - The "Behind the scenes" tab gets `aria-selected=true` when clicked.
    - "Play track" toggles `aria-pressed`.
- [ ] **Step 2: Run `npx vitest run tests/unit/home-content.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Build the sections as server components.**
  - Markup and classes are a 1:1 translation of `prototype/index.html` and `css/style.css` into Tailwind, using the existing tokens (`text-display-section`, `text-gradient`, `slant`, etc.).
  - Use `next/image` for photos (hero photo `priority`).
  - Check each section against `get_design_context`/`get_screenshot` of its node under `4410:41`.
- [ ] **Step 4: Implement `AnimGate` and `HomeMotion`.**
  - `AnimGate` is an inline `<script>` placed before the hero. Unless `matchMedia('(prefers-reduced-motion: reduce)')` matches, it adds `anim-pending` to `<html>` and removes it after 2500 ms.
  - `HomeMotion` is a client component: `useLayoutEffect` → `gsap.context(() => …, rootRef)`, cleaned up with `ctx.revert()`.
    - It ports `prototype/js/main.js` timeline by timeline, selecting through `data-anim` attributes instead of BEM classes.
    - It removes `anim-pending` once the start states are set.
    - It uses `gsap.matchMedia()` for reduced motion, exactly as the prototype does.
    - The tab switch and the waveform dance are React state, not DOM writes.
- [ ] **Step 5: Run `npx vitest run tests/unit/home-content.test.ts` and `npx playwright test home`.** Expected: PASS. Then compare with the Figma screenshot of `4410:41` at 1920 px and fix visible differences.
- [ ] **Step 6: Commit** `feat(home): marketing home from Figma 01 with GSAP motion`.

### Task 4: Pricing page

**Files:**
- Create: `src/content/pricing.ts`
- Create: `src/app/(marketing)/pricing/page.tsx`
- Create: `src/components/pricing/`: `PricingHero.tsx`, `PackCard.tsx`, `EarnBand.tsx`, `Faq.tsx` (client), `PaymentMethods.tsx`
- Assets: `public/pricing/hero.jpg` and the payment-logo SVGs exported from `4447:2280` / `4450:2477`
- Test: `tests/unit/pricing-content.test.ts`, `tests/unit/faq.test.tsx`, `tests/e2e/pricing.spec.ts`

**Interfaces:**
- Produces:
  - `PRICING.costs`: 1 credit (Music blogs and small playlists), 2 (Spotify playlist curators), 3 (Labels and radio shows), 0 "if no answer".
  - `PRICING.packs`: `{ name, credits, pitches, price, perCredit, save?, popular?, features[] }`:
    - Starter: 10 credits, ≈ 5 pitches, €12, €1.20.
    - Artist: 30, ≈ 15, €32, €1.07, save 11 %, popular.
    - Pro: 75, ≈ 37, €76, €1.01, save 15 %.
    - Label: 200, ≈ 100, €192, €0.96, save 20 %.
  - `PRICING.faq` (6 entries, from the Figma texts), plus the assurance line and the payments note.
  - `<Faq items>`: buttons with `aria-expanded`/`aria-controls`; the first item opens by default; one item open at a time.
- Consumes: `getViewer`, `buyCreditsHref` (Task 1), `Button`, `SectionBadge`-style labels.

- [ ] **Step 1: Write the failing tests.**
  - `pricing-content.test.ts`:
    - Each pack's `perCredit` equals `price / credits` rounded to 2 decimals (1.20, 1.07, 1.01, 0.96).
    - Exactly one pack is `popular`.
  - `faq.test.tsx`:
    - The first question is expanded.
    - Clicking "What if a curator doesn't answer?" expands it and collapses the first.
  - `pricing.spec.ts`:
    - `h1` "Buy credits".
    - Four `article`s with headings Starter/Artist/Pro/Label and prices €12/€32/€76/€192.
    - "Most popular" sits inside the Artist card.
    - As a guest, "Buy 30 credits" goes to `/signup`.
    - Logged in as an artist, it goes to `/credits`.
    - Logged in as a curator, it goes to `/dashboard`.
- [ ] **Step 2: Run the two unit files.** Expected: FAIL.
- [ ] **Step 3: Implement content and components from `get_design_context` on each section node.**
  - Texts come verbatim from Figma.
  - "Buy credits" is the page's single gradient title.
  - The popular card has the cyan border and the "Most popular" tab.
  - Packs use 4 columns, then 2 under 1100 px, then 1 under 560 px.
- [ ] **Step 4: Run the unit tests and `npx playwright test pricing`.** Expected: PASS. Compare with `get_screenshot` of `4447:2279`.
- [ ] **Step 5: Commit** `feat(pricing): pricing page from Figma 06`.

### Task 5: Legal pages

**Files:**
- Create: `src/content/legal/types.ts`, `src/content/legal/index.ts`, plus one file per doc: `privacy.ts`, `gdpr.ts`, `cookies.ts`, `terms.ts`, `legal-notice.ts`
- Create: `src/app/(marketing)/legal/[doc]/page.tsx`
- Create: `src/components/legal/`: `LegalHeader.tsx`, `LegalToc.tsx` (client, scroll-spy), `LegalBody.tsx`, `PrintButton.tsx` (client)
- Modify: `src/app/globals.css` (`@media print` rules)
- Test: `tests/unit/legal-content.test.ts`, `tests/e2e/legal.spec.ts`

**Interfaces:**
- Produces:
  - `src/content/legal/types.ts`:
    - `type LegalBlock = { kind: "p"; text: string } | { kind: "list"; items: string[] } | { kind: "callout"; text: string } | { kind: "table"; head: string[]; rows: string[][] } | { kind: "preferences" }`.
    - `type LegalSection = { id: string; title: string; blocks: LegalBlock[] }`.
    - `type LegalDoc = { slug: LegalSlug; title: string; updated: string; readMinutes: number; intro: string; asideTitle: string; asideEmail: string; sections: LegalSection[] }`.
  - `getLegalDoc(slug: string): LegalDoc | null`.
  - The page exports `generateStaticParams()` returning the 5 slugs and `dynamicParams = false`.
  - `generateMetadata` sets the title to `doc.title`.
- Consumes: `LEGAL_DOCS`, `LegalSlug` (Task 1), `<CookiePreferences>` (Task 2) for the `preferences` block, `Tab` with `href`.

- [ ] **Step 1: Write the failing tests.**
  - `legal-content.test.ts`:
    - Every slug in `LEGAL_DOCS` resolves.
    - Section ids are unique within a doc and match `/^[a-z0-9-]+$/`.
    - `cookies` contains exactly one `preferences` block, in a section with id `preferences`.
    - `legal-notice` has a section with id `contact`.
    - `getLegalDoc("nope")` is null.
  - `legal.spec.ts`:
    - For each slug: status 200, `h1` = doc title, and the matching tab has `aria-current="page"`.
    - Clicking TOC entry "07 Your rights" on privacy updates the hash to `#your-rights`; the heading's `boundingBox().y` is ≥ the header height (`scroll-margin-top`) and it is in the viewport.
    - The TOC marks the current entry with `aria-current="location"` after scrolling.
    - `/legal/unknown` returns 404.
    - Saving preferences on `/legal/cookies` sets the `rr_consent` cookie; un-fixme the Task 2 case.
- [ ] **Step 2: Run `npx vitest run tests/unit/legal-content.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Fill the five content files.**
  - Pull each doc's draft text from `get_design_context` on its "Text column" and TOC nodes.
  - Copy it verbatim, keeping the `[Company name]` placeholders.
- [ ] **Step 4: Build the page per 09a.**
  - Breadcrumb Home / Legal / doc.
  - Title row: `text-page-title` plus "Last updated · N min read" and "Download PDF" (`PrintButton`).
  - Tabs, then a 300 px sticky TOC + aside box and a 720 px text column.
  - Section numbers `01…` in cyan.
  - Tables use `overflow-x-auto` inside their frame.
  - Under 1100 px the TOC stacks above the text and is no longer sticky.
  - The Legal header variant is `solid` (Task 1).
- [ ] **Step 5: Run the unit tests and `npx playwright test legal cookies`.** Expected: PASS. Compare each page with its Figma screenshot.
- [ ] **Step 6: Commit** `feat(legal): five legal documents with sticky table of contents`.

### Task 6: Responsive sweep, production smoke, docs

**Files:**
- Modify: `tests/e2e/prod-smoke.spec.ts`, `README.md` (public pages section)
- Create: `tests/e2e/public-responsive.spec.ts`

- [ ] **Step 1: Write `public-responsive.spec.ts`.**
  - For `/`, `/pricing` and each `/legal/<slug>`, at 375×812 and 1280×800:
    - `document.documentElement.scrollWidth <= innerWidth`.
    - No element in `main` is wider than the viewport, except inside an `overflow-x-auto` ancestor (evaluate in page).
  - At 375, the pricing cards are stacked: each card's `x` is equal.
- [ ] **Step 2: Run `npx playwright test public-responsive`.** Fix every overflow found, then rerun. Expected: PASS.
- [ ] **Step 3: Extend `prod-smoke.spec.ts`.**
  - `/pricing` and `/legal/privacy` answer 200.
  - The home `h1` "ReachRadar" is visible.
  - The cookie banner appears in a fresh context.
- [ ] **Step 4: Run the full gate.**
  - `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run test:integration`, `npx playwright test`, `npm run build`.
  - Expected: all green. The marketing layout reads cookies (viewer and consent), so these pages render dynamically; that is expected.
- [ ] **Step 5: Commit** `test: public pages responsive sweep and production smoke`.
