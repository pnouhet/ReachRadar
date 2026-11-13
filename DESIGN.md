---
name: ReachRadar
description: Dark, nightlife-inspired music platform that helps independent artists pitch songs to curators, get anonymous peer feedback and grow a fanbase.
colors:
  # Core palette (from the design reference — do not substitute)
  midnight: "#0D1B2A"        # page background, always
  white: "#FFFFFF"           # primary text, headlines
  soft-white: "#EEEEEE"      # secondary headlines, supporting labels
  slate: "#778DA9"           # muted text, inactive states, gradient end
  cyan: "#059BC0"            # brand, links, focus, gradient start, data
  rose: "#E54166"            # CTA, metrics, active accents — use sparingly
  # Derived surfaces (tonal steps of midnight, for app screens)
  surface-1: "#122338"       # cards, panels, inputs
  surface-2: "#182D45"       # hover, raised panels, chat bubbles (others)
  surface-3: "#1F3854"       # selected rows, active list items
  border: "#778DA933"        # slate at 20% — hairline dividers
  border-strong: "#778DA966" # slate at 40% — input outlines
  overlay: "#0D1B2ACC"       # midnight at 80% — photo overlays, modals
  success: "#2BC48A"
  warning: "#F2B33D"
  error: "#E54166"
gradients:
  heading: "linear-gradient(90deg, #059BC0 0%, #FFFFFF 50%, #778DA9 100%)"
  hero-photo-fade: "linear-gradient(180deg, transparent 55%, #0D1B2A 100%)"
  waveform: "linear-gradient(90deg, #059BC0 0%, #778DA9 100%)"
typography:
  display-hero:
    fontFamily: Syne
    fontWeight: 800
    fontSize: 90px
    lineHeight: 68px
    textTransform: uppercase
  display-hero-mobile:
    fontFamily: Syne
    fontWeight: 800
    fontSize: 48px
    lineHeight: 40px
    textTransform: uppercase
  headline-section:
    fontFamily: Syne
    fontWeight: 800
    fontSize: 60px
    lineHeight: 60px
    textTransform: uppercase
  headline-secondary:
    fontFamily: Syne
    fontWeight: 700
    fontSize: 48px
    lineHeight: 52px
    textTransform: uppercase
  page-title:          # app & auth screens (Figma style "Display/Page title")
    fontFamily: Syne
    fontWeight: 800
    fontSize: 40px
    lineHeight: 44px
    textTransform: uppercase
  headline-card:
    fontFamily: Syne
    fontWeight: 700
    fontSize: 24px
    lineHeight: 28px
    textTransform: uppercase
  nav-wordmark:
    fontFamily: Syne
    fontWeight: 700
    fontSize: 22px
    letterSpacing: 0.02em
    textTransform: uppercase
  body-lg:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 20px
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 16px
    lineHeight: 24px
  metric:
    fontFamily: Inter
    fontWeight: 600
    fontSize: 38px
    lineHeight: 44px
  label:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 16px
    lineHeight: 20px
    letterSpacing: 0.04em
    textTransform: uppercase
  label-sm:
    fontFamily: Inter
    fontWeight: 600
    fontSize: 13px
    lineHeight: 16px
    letterSpacing: 0.06em
    textTransform: uppercase
  button:
    fontFamily: Inter
    fontWeight: 600
    fontSize: 14px
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 2px
  full: 9999px   # avatars and status dots ONLY
skew:
  signature: -12deg   # parallelogram angle used for CTAs, badges, chips, image frames
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  2xl: 64px
  3xl: 96px
  section: 160px
layout:
  maxContentWidth: 1320px
  desktopGutter: 300px    # on a 1920px artboard
  navbarPadding: 32px 60px
  grid: 12 columns, 24px gutter
  appSidebarWidth: 264px
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    shape: parallelogram, skewX(-12deg); text and icon counter-skewed upright
    padding: 12px 28px
  button-secondary:
    backgroundColor: transparent
    border: 1px solid {colors.white}
    textColor: "{colors.white}"
    shape: parallelogram, skewX(-12deg)
    padding: 12px 28px
  button-ghost:
    textColor: "{colors.soft-white}"
    hover: 2px rose underline
  section-badge:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    font: Inter 800 italic 24px
    shape: parallelogram, skewX(-12deg)
    padding: 6px 12px
  tab:
    typography: "{typography.button}"
    textColor: "{colors.slate}"
    activeTextColor: "{colors.white}"
    activeIndicator: 2px rose underline, full tab width
  card:
    backgroundColor: "{colors.surface-1}"
    border: 1px solid {colors.border}
    rounded: "{rounded.sm}"
    padding: 24px
    hover: background surface-2, border cyan at 40%
  input:
    backgroundColor: "{colors.surface-1}"
    border: 1px solid {colors.border-strong}
    focusBorder: 1px solid {colors.cyan}
    rounded: "{rounded.sm}"
    height: 48px
    labelTypography: "{typography.label-sm}"
  filter-chip:
    border: 1px solid {colors.border-strong}
    textColor: "{colors.soft-white}"
    activeBackground: "{colors.cyan}"
    activeTextColor: "{colors.midnight}"
    shape: parallelogram, skewX(-12deg)
    padding: 8px 16px
  credit-pill:
    backgroundColor: transparent
    border: 1px solid {colors.cyan}
    textColor: "{colors.cyan}"
    icon: small radar / pulse glyph
    shape: parallelogram, skewX(-12deg)
  avatar:
    rounded: "{rounded.full}"
    border: 2px solid {colors.midnight}
  image-frame:
    shape: slightly skewed quadrilateral (clip-path, ~4° tilt), never a rounded rectangle
    treatment: duotone blue/cyan grading, dark vignette
---

# ReachRadar — Design System

## Overview

ReachRadar is a platform for independent artists: pitch songs to Spotify playlist curators, labels, radios and blogs (credit-based), earn free credits by rating other artists' songs anonymously, connect with other artists, and browse a catalogue of music professionals.

**Mood:** a concert at 1 a.m. Dark, cinematic, nightlife energy. It should feel like a music festival poster or an underground label site, **not** a generic SaaS dashboard. Think deep midnight backgrounds, cyan stage lights, a single hot rose accent, and huge, wide, uppercase type.

**Three signature moves are used on every screen:**
1. **Wide uppercase Syne headlines.** Syne ExtraBold is very wide. Headlines are big, tightly leaded and always uppercase.
2. **The -12° parallelogram.** CTAs, section number badges, filter chips, credit pills and image frames are skewed. Nothing is a rounded pill.
3. **The cyan → white → slate heading gradient.** Use it on one key headline per screen (the section title), never on body text.

## Colors

- **Midnight `#0D1B2A`** is the page background on every screen. There is no light mode and no white page.
- **White `#FFFFFF`** for headlines and primary text; **Soft white `#EEEEEE`** for secondary headlines and labels.
- **Slate `#778DA9`** for muted text, inactive tabs, placeholders and metadata.
- **Cyan `#059BC0`** is the brand colour: links, focus rings, progress, waveforms, selected filters, credit balance, data visualisation.
- **Rose `#E54166`** is the action colour. Use it for the primary CTA, key metrics (`+800`), active tab underlines, the quote mark and notification dots. Keep it to **max 1–2 rose elements per viewport**.
- Surfaces are tonal steps of midnight (`surface-1/2/3`). Separate things with hairline slate borders at 20%, not with shadows.
- Photography is colour-graded in **cyan/teal and electric blue**, with occasional red stage light. Add a subtle **dot-grid / halftone overlay** (1px dots, ~6px pitch, white at 8–10%) on hero photos.

## Typography

- **Syne** (Google Fonts) for all headlines, the wordmark and card titles. Always uppercase. Weights 700–800 only.
- **Inter** for body, UI, labels, metrics and buttons.
- **Hero wordmark:** "REACHRADAR" in Syne 800 at 90px, followed directly by a second copy as a **1.5px white outline (no fill)** that overlaps the first by about 30%. This "echo" effect is the brand signature. Use it on the homepage hero, and in a smaller size on auth and empty states.
- **Section titles:** Syne 800, 60px, uppercase, with the heading gradient fill.
- **Secondary headlines:** Syne 700, 48/52, soft white, often centred over 2–3 lines ("GO AHEAD, / LIVE FROM / YOUR MUSIC !").
- **Body:** Inter 400 at 20/30 for marketing paragraphs and 16/24 inside the app. Marketing paragraphs can be justified; app text is left-aligned.
- **Metrics:** Inter 600, 38px, rose, with an uppercase Inter label in white or soft white underneath.
- **Small labels:** Inter, uppercase, letter-spaced (e.g. "SUBMITTED SONGS", "SCROLL DOWN", "TEASER TRAILER").

## Layout

- 8px spacing base. Inline pairs use 8–16, related groups 24–32, major blocks 48–64. Marketing sections get 160px vertical rhythm.
- Measured from the reference: headline → body 24px, section title → body 32px, major content gap 48px.
- Desktop: 1320px max content width, centred (300px gutters on 1920). 12-column grid with 24px gutter.
- **Marketing pages** (Home, Pricing, Legal, Auth) use a full-bleed photo hero and centred stacked sections, each introduced by a white skewed number badge (`01`, `02`, `03`…) centred above the section title.
- **App pages** (Pitch, Rate, Chat, Catalogue, Profile) share one **app shell**:
  - top bar: same navbar as the homepage but on a solid midnight background with a bottom hairline. It holds the wordmark, global search, the **credit balance pill (cyan)**, notifications and the avatar.
  - left sidebar, 264px, surface-1. Nav items are Inter 16 with icons; the active item is white with a 3px rose left bar on a surface-3 background.
  - content area on midnight with 48px padding. The page title is a Syne 800 uppercase heading at 40–60px.
- Mobile: 16px side gutters, single column, hero type scales to 48px, the sidebar becomes a bottom tab bar.

## Elevation & Depth

- The design is flat. Depth comes from **photography, gradients and light**, not shadows.
- Hero photos fade into midnight at the bottom (`hero-photo-fade`), so sections flow seamlessly with no visible edge.
- Allowed glow: a soft cyan outer glow (`0 0 32px #059BC040`) on the currently playing track or a focused primary element.
- Modals: midnight overlay at 80% plus a surface-2 panel with a 1px border. No heavy drop shadows.

## Shapes

- Corners are sharp (0–2px). The only round shapes are avatars, status dots and the play button.
- The parallelogram (skewX -12°) is the brand shape. Text inside it stays upright.
- Images use skewed, slightly tilted quadrilateral frames, like the concert photo next to "GO AHEAD, LIVE FROM YOUR MUSIC !". Never use rounded-corner photo cards.

## Components

- **Navbar (marketing):** transparent over the hero, 32px/60px padding. Left: hamburger + search icons. Centre: "REACH RADAR" wordmark. Right: rose skewed "Sign Up" button with a user icon.
- **Primary CTA:** rose parallelogram with white Inter 600 text and an optional leading icon.
- **Secondary CTA:** outlined white parallelogram.
- **Section badge:** white parallelogram with a midnight bold italic number.
- **Stats row:** 4 metrics, centred, evenly spaced. Rose number on top, uppercase label below.
- **Social row:** SoundCloud, YouTube, Deezer, TikTok and Spotify glyphs in white at 20px, spaced 32px apart.
- **Tabs:** uppercase labels. The active tab is white with a rose underline; inactive tabs are slate.
- **Track card:** square cover art (duotone), song title in Syne 700 uppercase, artist and genre in slate, a cyan→slate waveform and a round rose play button.
- **Curator card:** avatar or logo, name, type tag (Playlist / Label / Radio / Blog) as a skewed outline chip, genre chips, follower or audience metric in rose, credit cost in a cyan pill, and a "Pitch" CTA.
- **Filter bar:** a horizontal row of skewed filter chips (Genre, BPM, Mood, Type, Audience size), with a search input and a sort dropdown on the right.
- **Rating module:** five skewed segments that fill cyan on select, plus a required feedback textarea with a live character counter.
- **Chat:** conversations list on the left (avatars with an online cyan dot) and the thread on the right. Others' messages sit on surface-2 bubbles and your own on cyan at 20% with a 1px cyan border. Bubbles have sharp corners. The composer has an attach-track button.
- **Credit pack card (pricing):** surface-1 card with the credit amount in huge Syne 800, the price in Inter 600 and a list of included items. The "Most popular" pack gets a rose skewed ribbon and a cyan 1px border.
- **Player bar (site-wide, not in Figma):** 72px surface-1 dock fixed to the bottom once a track is started; it keeps playing across pages. Left: 44px cover, title in Syne 700 uppercase 14px, artist in slate. Centre: previous, a 44px rose slanted play/pause square, next. Right: elapsed / total time, mute, a volume slider and a close button. A 3px rose seek line runs along the top edge. Sliders use a 3px track with a white 12px square thumb (2px radius) shown on hover, focus and touch. On phones the time and volume are hidden. The bar publishes its height as `--player-h` so pages pad themselves.

## Figma implementation (source of truth)

File: `ReachRadar` (figma.com/design/2HhgAcEIsgZm7tOcaergLH). Pages: **Reference** (original frames, untouched) · **Design System** · **Screens**.

- **Variables:** `RR Color` (bg/midnight, surface/1-3, text/primary·secondary·muted, brand/cyan·rose·slate, border/subtle·strong, state/success·warning) and `RR Space` (space/8 → space/160).
- **Text styles:** Display/Hero · Display/Section · Display/Page title (40/44) · Heading/Secondary · Heading/H3 · Heading/Card · Body/Large · Body/Medium · Body/Small · Metric/Large · Label/Default · Label/Strong · Button/Default · Tab/Default.
- **Components:**
  - Button (Primary / Secondary / Ghost), Section Badge, Tab (Active / Inactive), Chip (Default / Active), Credit Pill, Stat
  - Input (Default / Focus / Error, optional trailing action such as "Show"), Checkbox (On / Off)
  - Step, Category Card, Role Card (Default / Selected), Social Button (Google / Spotify), Step Indicator (1 / 2), Auth Visual Panel (editable Headline + Body)
  - App shell: App Top Bar (search, credit pill, notifications, account), App Sidebar (Nav Item list ending with Settings and **Help & FAQ** (Icon/help-circle), free-credits progress, log out), Nav Item (Default / Active, optional badge), Track Card
  - Curator Card (Default / Selected): avatar, type with Verified toggle, name, audience, genres, match bar, then cost, acceptance and response. The header has a min height of 96 so cards in a row line up. It is used in Pitch step 2 and will be used in Discover.
  - Component maintenance: when redesigning a component, edit the existing text layer or reconnect the new one to its TEXT property. Otherwise every instance falls back to the default text. This happened to Chip and Button, and both were rebound.
  - Icon/* (Lucide, swappable via INSTANCE_SWAP; includes inbox, clock, x, chevron-down, pause and wallet)
  - Patterns built in place on screens rather than as components: the skewed type chip (white parallelogram with midnight Label/Strong), the playlist card, the submission row (collapsed or open), the Accept / Decline segmented control, and the textarea with a min-length counter.
- **Screens built:**
  - `01 — Home`: hero with tagline + 2 CTAs, 01 Get heard, 02 How it works, 03 Pitch to the right ears, **04 Test before you pitch (Pre-test: copy + benefits + "Pre-test a track for free", with a readiness-score card mock)**, 05 Rate & earn (benefit: "Each rating earns your own track a rating back"), 06 Find your next collab, testimonials, final CTA band, footer.
  - `02a–02d`: sign up step 1 (role), step 2 Artist, step 2 Professional, log in. All are 1920×1080 split screens with the photo panel on the left and a 520px form column on the right.
  - `03a — Profile · Artist`: app shell (top bar 80px + sidebar 264px, active item via Nav Item State=Active). Banner with avatar overlapping its bottom edge, then name and actions (Share / Edit / **Pitch a track**). Tabs, then a 3-column track grid with a dashed upload card as the last item. A 400px right column holds pitch stats, recent feedback and credit balance.
  - `03b — Profile · Curator (public)`: the curator profile as an artist sees it (sidebar on Catalogue). Type chip "PLAYLIST CURATOR" with a cyan "Verified curator" tick. Actions are Message, Follow and **Pitch a song · 2 credits**. A 4-cell key-facts strip shows acceptance rate (in rose), average response time, response rate and followers. A "What I'm looking for" card covers genres, BPM range bar, moods and exclusions. Then "My playlists" (cover, followers in rose, "Open on Spotify") and recent placements. The right column holds a pitch card (price, guarantees, CTA, balance), submission guidelines and similar curators.
  - `03c — Curator · Inbox`: the owner view with a compact header and the Inbox (8) tab active. The sidebar is the Pro version: Inbox, My playlists and Earnings replace Pitch, Rate and Credits, and the promo reads "Stay verified". The top bar shows earned credits and "Withdraw". Status filter chips (New / Listened / Accepted / Declined / All) sort by deadline first, and the list has columns for track, pitched for, deadline (warning colour under 2 days) and credits earned. The open row has a player waveform, the artist's note, an Accept / Decline toggle, a "Add to playlist" select, required feedback (80 characters minimum, with counter and quick replies) and "Send decision". The right column shows inbox health, earnings and feedback tips.
  - `04a — Pitch · Step 1 Select track`: a "Choose a track" list with radio rows showing cover, meta, community rating and pitch status, plus a play button. A demo is disabled with "Demos can't be pitched yet", and "Upload a new track" sits in the header. A "Pitch details" card holds the required story (300-character counter), release status (Released / Upcoming), release date, an optional private link and up to 3 moods (chips). The right panel shows the selected track, a 4/5 readiness checklist with a segmented bar, a ratings tip and **Continue · choose curators**, with "No credits spent yet".
  - `04b — Pitch · Step 2 Choose curators`: "PITCH YOUR TRACK" in the gradient, with "Back to dashboard" and "Save draft". The skewed 3-step indicator marks step 1 as done (cyan outline + check), step 2 as active (white fill) and step 3 as to do (slate outline). The filter bar has type chips with counts and a search, then dropdown filters (genre, audience, response rate, credit cost, verified); active filters get a cyan border and tint, and "Clear filters" sits at the end. The results bar shows a count, "Select top 5 matches" and "Sort: Best match". Below is a 3×3 Curator Card grid. The sticky right "Your pitch" panel holds the mini player, the selected curators (removable), balance / this pitch / remaining, the 7-day guarantee note, **Continue to review · 12 credits** and "Buy credits".
  - `04c — Pitch · Step 3 Review & send`: "Track & story" and "Curators" cards each have an "Edit" link back to their step. The curators table lists match, answer-by date and cost, with a 12 cr total. A 4-step "What happens next" timeline runs Pitch sent → Curators listen → Answer + feedback → Credits back (in green). The "Confirm & send" panel shows track, curators, balance, this pitch and remaining, then the guarantee, a rights checkbox, **Send pitch — 12 credits** and "Back to curators". Credits are held at sending and only spent when a curator answers.
  - `05 — Rate & Earn`:
    - **Pre-test explainer** (top band, right under the header): "PRE-TEST · HOW IT WORKS", "Your ratings also test your music", the 1-rating-given = 1-rating-received rule, 3 outlined steps, the track being tested (Neon Rain, 17/20, Change) and a link to Help & FAQ.
    - **Header:** gradient "RATE & EARN" title and a "How ratings work" button.
    - **Progress module:** full width with a cyan gradient. It shows "12 / 20 songs rated", a 20-segment skewed bar (12 cyan), "8 more ratings…", "Cycle 4 · 3 completed" and a white skewed "+2 credits at 20 / 20" reward tag.
    - **Filters:** genre dropdown, BPM range slider (80–130, two handles), length dropdown, "Doesn't affect your progress" and Reset, then mood chips.
    - **Anonymous player:** "Anonymous track #4821 · Track 13 of 20" with a "Report this track" link. The 320px radar has concentric rings, an angular sweep and blips, and a rose round play/pause button. Its rings fit inside the frame, so there is **no clip**. Then genre / BPM / mood / length chips, a large waveform and "Rating unlocked" after 45 seconds.
    - **Your rating:** a 2×2 grid of criteria (Production, Melody, Vocals, Originality), each with a description, five 28px skewed segments and a word value (Weak → Outstanding). Then required written feedback (80 characters minimum, counter, prompt links), a moderation note, and "Skip track" (with "Skips don't count") and **Submit feedback**.
    - **Right column:** Up next (anonymous queue with radar thumbnails, "New batch"), feedback tips, and "Your reviews" stats with a "Top reviewer" badge progress bar.
  - `06 — Pricing` (marketing layout, 1920 wide, 300px side gutters):
    - **Hero:** 560px photo hero (CTA band fills, dot grid, bottom fade to midnight) with the home navbar. Eyebrow "Pricing · Pay per pitch, no subscription", "BUY CREDITS" in the gradient (the screen's only gradient headline) and the refund promise.
    - **How credits work:** "1 pitch = 1 to 3 credits", 4 tiles (1 = blogs and small playlists, 2 = playlist curators, 3 = labels and radios, 0 = refund if no answer, in green).
    - **Packs:** 4 cards (Starter 10 / €10, Artist 30 / €27 −10% MOST POPULAR, Pro 75 / €64 −15%, Label 200 / €160 −20%). Each shows the price per credit, a "Save x%" tag in green, ≈ pitches, features and a CTA. Only the Artist card has the rose CTA, cyan border, surface-2 fill and a white skewed chip; the others use Secondary. Below: "New here? first 2 credits free" and an assurance row.
    - **Earn band:** cyan gradient band "Or earn them for free" with a 20-segment progress bar (12/20), a "Start rating songs" CTA, and Listen → Rate & review → Earn steps.
    - **FAQ:** title column plus a 6-item accordion, with the first item open in cyan and a rotated chevron.
    - **Payments:** "Secure payment · processed by Stripe", text badges (Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay) and a VAT note. Then the Footer component.
    - Payments row: monochrome white brand marks from Simple Icons (Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay) in 112×56 outlined badges, and a Stripe mark plus "Stripe" in the "processed by" line.
  - `07 — Chat` (fixed 1920×1080 viewport, app shell with Messages active; content has no padding and three full-height columns):
    - **Conversations (400px, surface-1):** "Messages" with "+ New message", a search field, tabs All / Collabs (2) / Requests (1), and rows. Each row has a 44px gradient avatar (cyan online dot), name, tag (Collab / Curator / Request in rose), time, a one-line truncated last message and a rose unread counter. The active row gets surface-2 and a cyan bar.
    - **Thread (fill):** header with avatar, name, "Online · genres · city", "View profile" and a "…" menu. A pinned cyan-tinted "Collab in progress" bar shows title, status, target date and "Open collab". Messages are bottom-anchored with date dividers: incoming bubbles on surface-2 with a 32px avatar, outgoing ones cyan-tinted with a cyan border and right-aligned with "Seen". An inline **shared track card** has cover, title, meta, mini waveform and play; there is also a file attachment card with Download and a typing indicator.
    - **Composer:** "Track" (attach a track) and paperclip buttons, an input with cyan focus and an emoji icon, and a cyan **Send** button (rose stays for the collab CTA). Below: a shortcut hint and a moderation note.
    - **Profile panel (360px):** 96px avatar, name, role · city, an "Open to collabs" cyan tag, stats (listeners / tracks / collabs), genres, "Looking for", top tracks, "Shared in this chat", the **Propose a collab** CTA pinned to the bottom, and "Block or report".
    - With no clipping, the messages column must fit its height: keep the mock content short.
  - `08 — Discover` (app shell with Catalogue active):
    - **Header:** gradient "DISCOVER", a subtitle with counts and "Saved searches (2)".
    - **Search:** a 64px search input with cyan border, search icon and clear, then "Try:" suggestion links.
    - **Category tabs:** All · 1,248 / Artists / Playlists / Labels / Radios / Blogs, each with a count.
    - **Filter sidebar (300px card):** "Clear all (5)"; genre checkboxes with counts and "+36 more"; a location dropdown; an audience range slider (10k – 500k); and **square switches** (on = cyan fill + dark knob right, off = surface-3 fill + light knob left, radius 2, no pill) for Verified only, Open to submissions and Open to collabs.
    - **Results bar:** "214 results for …", Sort (Relevance), a grid/list toggle, removable active-filter chips and "Save this search".
    - **Result grid:** 3 × 393px **Result Card** instances, then "Showing 9 of 214" and "Load more results".
  - **Result Card** component (Design System): 104px banner photo fading to surface-1, a 72px gradient avatar overlapping it, type and Verified, name, meta, genres, and a status line with a cyan dot (slate when closed). Actions are a message icon button, "+ Follow" (or "✓ Following"), and a Secondary CTA (Pitch · x cr for pros, Collab for artists, Notify me when closed). There is no rose in the cards, because the grid would get too loud.
  - `09a–09e — Legal` (Privacy policy, Cookie policy, GDPR, Terms of use, Legal notice):
    - **Shared template:** marketing layout without a hero. A header band holds the home navbar and a bottom border. Then breadcrumb, a white Display/Page title (no gradient), "Last updated · x min read", "Download PDF", and Tab-component legal tabs across the 5 documents.
    - **Body:** a 300px **sticky table of contents** ("On this page"; numbered items with a 1px slate left rule, the active one white on surface-1 with a **3px rose bar**) and a help card with a contact email. Then a 96px gap and a **720px text column**: intro in Body/Large, numbered sections with a cyan "01" and a Heading/Card title, paragraphs in **Body/Long-form (Inter 16/28, new text style)**, square cyan bullets, and a cyan callout with a 3px left bar. Then the Footer.
    - **Cookie policy:** a preferences panel (Strictly necessary "Always on" in green, plus Analytics and Marketing square switches), Reject all and Accept all **both Secondary and the same size**, and **Save my choices** as Primary. Then a "saved for 6 months" note and a cookie table (name in lowercase Inter Semi Bold, provider, purpose, duration).
    - Company details are placeholders in brackets ([Company name], [SIREN], [host]…). **The legal texts are drafts and must be validated by a lawyer.**
  - **Cookie Banner** component: a full-width bar, surface-1 fill, cyan top border, **no shadow**. Shield icon, "We use cookies" and a short text, then Customize (Ghost), Reject all (Secondary) and Accept all (Primary). Reject and Accept have the same width (CNIL equal prominence). Shown on 09a at the bottom of the first 1080px viewport.
  - `12 — Dashboard · Artist · V2 (track-centric)` (node 4503:4149, x 40038, y 0; app shell with Dashboard active). **Validated 2026-10-14: this is the reference version.** V1 is kept below as an archive, don't delete it. Only the layout changes; tokens, type and components are the same. The structure follows Linear's calm hierarchy: one dominant panel, hairline-separated rows, and every piece of data shown once.
    - **Header:** gradient "WELCOME BACK, JOHN" + "since your last visit" summary on the left. On the right, 3 inline stats separated by 1px rules: Pitches in progress, Answers this month, Acceptance rate (rose). No header buttons and no KPI row.
    - **Track switcher** (full width): one tab per track (48px cover, name, status line, Rating tag), then a dashed **Upload** tile. The selected tab uses surface-2 with a cyan border. The status lines are "2 / 5 curators answered", "Ready to pitch" (cyan), "Placed on 1 playlist", and "Not tested yet" + "Test free". It replaces "Your tracks". Everything below the switcher belongs to the selected track (Midnight Drive in the mock).
    - **Left column (1128):**
      - **Track health (promise 2, the dominant panel):** 3 zones split by 1px rules:
        - score: "Track readiness" + PRE-TEST, "Ready to pitch", a **112px Syne score "84" / 100**, and "20 / 20 anonymous ratings · final score";
        - "What listeners rated": the 4 criteria bars;
        - "Most mentioned": a quote callout and "See all 20 comments".
      - **[Track] activity (promise 1):** the send status at the top: "Sent to 5 curators", segments 2/5, answer-by countdown in warning colour, "7 cr held". Then changelog-style event rows separated by top hairlines, with columns for date (64px), curator + decision tag + feedback text, and action (260px). The 3 action states are "Was this feedback useful?" with Useful / Not useful; "You marked this useful" + "Placement report available"; and "Dispute in review · reply within 48 h" + "2 of 3 disputes left".
      - **More curators for [track]:** Best matches limited to curators not pitched yet (Verified + Feedback %, Match % + chance, cost), with "Pitch these 3 for 4 credits" (Secondary) and the bonus-credits note.
    - **Right column (400):**
      - Credits: available, held, the purchased/bonus split, bonus validity, and a "History" link. "Buy credits" stays in the top bar only.
      - Rate & earn (cyan gradient card).
      - Live placements (promise 3).
    - The sidebar "Free credits" promo is hidden on this screen, because Rate & earn already sits in the right column.
  - `12c — Dashboard · Artist · New account` (x 37918, y 2128): the V2 shell with no tracks yet.
    - **Header:** "Welcome, Ilan" with no stats.
    - **"Unlock your 2 free credits" checklist (1 / 2 done):** 2 rows with a Section Badge:
      - "Verify your email": the badge at 40% opacity and a green ✓ Done;
      - "Upload your first track", with **Upload a track**, the only rose CTA.
      - Then a coins-icon note about the bonus credit rules.
    - **"Your first pitch, step by step":** 3 rows with an icon box: Pre-test it for free, Pitch the right curators, Get useful feedback.
    - **Right column:**
      - Credits: 0 available, "+ 2 bonus pending", "2 bonus credits unlock after your first upload" in cyan.
      - Rate & earn: 0 / 20 with "Start rating".
      - Your profile checklist (1 / 4 + "Complete your profile").
    - The top bar shows 0 credits and the sidebar shows 0/20.
  - `12d — Dashboard · Artist · Bonus expiry alert` (x 40420, y 2128): V2 for an account inactive since Nov 2025.
    - A **warning banner** under the header: clock icon, "Your 6 bonus credits expire on Nov 12, 2026 (in 29 days)", an explanation line, then "Rate a song to keep them" (Secondary) and "Pitch a track" (Ghost). The fill is warn at 8% with a warn border.
    - The Credits panel shows "Bonus expires Nov 12, 2026" in warning colour.
    - The history is old: a closed pitch, "Dispute upheld · 2 cr refunded", Past placements.
    - Rate & earn is at 0 / 20.
  - `12 — Dashboard · Artist` (x 35416, y 0): **V1, archive.** Kept for reference.
    - **Header:** date, gradient "WELCOME BACK, JOHN", a "since your last visit" summary, then "Rate songs" (Secondary) and **Pitch a track** (the only rose CTA).
    - **KPI row, 4 cards:**
      - Available credits (24, "+12 held in pitches", a 24-segment split bar with purchased segments filled cyan and bonus segments outlined, legend "18 purchased / 6 bonus", "Bonus active · valid until Oct 2027", Buy credits).
      - Pitches in progress (2, 6 curators waiting, next answer due in warning colour).
      - Answers this month (14, 12 rated useful, 1 refunded after a dispute).
      - Acceptance rate (33% in rose).
    - **Track readiness (promise 2):** track select, a 72px Syne score "78 / 100" with a green "Ready to pitch" tag, 17/20 ratings, 4 criteria with 5 skewed segments each, and a cyan quote callout. It is joined with **Best matches** (3 rows: avatar, name, meta, Verified + Feedback % useful, Match % + acceptance chance, cost tag) and "Pitch these 3 · 5 credits" (Secondary), with a note that bonus credits work there.
    - **Pitches in progress:** cover, meta, answered segments, deadline (warning under 2 days), "x cr held" tag, chevron.
    - **Latest feedback (promise 1):** 3 equal-height cards (decision tag + "on [track]" under the header) in 3 states: "Was this feedback useful?" with Useful / Not useful; "You marked this useful" + placement report link; "Dispute in review · answer within 48 h" + "2 of 3 disputes left".
    - **Right column (400):**
      - Live placements (promise 3): Verified, position in Syne, a trend icon, day and estimated streams, and an "estimates" note.
      - Rate & earn card: cyan gradient, 20 segments, 2/4 bonus this month, "each rating earns your track a rating back".
      - Your tracks: Readiness score tags, and "Test it first · free" on an untested track.
    - Persona and mock data are still John Doe (indie pop / R&B), for continuity with 03a–04c. Switching the mocks to electronic music is part of the 11b revision pass.
  - `12b — Help & FAQ` (x 37918, y 0; app shell with Help & FAQ active): gradient title, "Contact support" (Secondary), a 64px search with cyan border, "Popular" links, a 280px topics list (active topic on surface-1 with a 3px rose bar, counts), and accordions cloned from the Pricing FAQ. **Pre-test** comes first, with 2 open items: "What is the Pre-test?" with 3 step cards, and "Is it really free?". Then Credits & pricing. The right column holds "Still stuck?" support and "Your Pre-test" (17/20 bar + **Rate 3 songs**, the only rose CTA).
  - Wrap grids: give cards a FIXED width ((width − gaps) / columns). FILL children in a wrap layout all squeeze onto one line.
  - Plugin gotcha: when re-binding a paint to the variable it already uses, pass the variable's resolved colour as the base. Otherwise the raw colour stays white even though the binding looks right.

**Positioning (validated 2026-10-04):**
- **Why ReachRadar and not SubmitHub or Groover:** the core mechanics (credits, 1–3 per curator, 7-day guarantee, rate songs to earn credits) already exist at both. ReachRadar differs through **3 promises**, plus the community.
- **Tagline:** "Pitch smarter. Pay only for real feedback. Grow real fans."
- **Promise 1 — Useful feedback or refunded.**
  - The artist rates every answer ("Useful" / "Not useful"). A "Not useful" answer is reviewed by moderation within 48 h. If the dispute is confirmed, the artist is refunded and the curator isn't paid.
  - Disputes are limited to 3 per month. A useful answer is specific to the track (it mentions at least one musical element), is 80+ characters and explains the decision.
  - Each curator has a public **Feedback score** (% useful).
- **Promise 2 — Test before you pitch.**
  - Rate & Earn doubles as a free **pre-test**. The artist's track enters the anonymous queue, and **every song you rate earns your track one rating back**.
  - The result is a **Readiness score** (0–100) per track, with the 4 criteria averages and comment highlights.
  - It feeds a **Match score** and an estimated acceptance chance per curator in Pitch step 2.
- **Promise 3 — Real fans, not just placements.**
  - Every curator is audited (follower history, bot patterns) before getting the **Verified** badge (shield icon + "Verified", with the last audit date in its tooltip or profile). Curators who fail are delisted. The name "Bot-free" was dropped (2026-10-04), because it promises something absolute that can't be guaranteed.
  - After an acceptance, a **Placement report** shows playlist position, days in the playlist and estimated streams.
  - The community (chat, collabs, catalogue) turns the pitch into a network.
- **Go-to-market:** launch with **electronic music**, the founder's network: curators, labels, DJs and electronic radios first. The product and UI stay **genre-agnostic**: genre lists, copy and filters cover every style, and only the mock content and early marketing lean electronic. Expand to other genres once the electronic supply is solid.
- **Cold start (proposed, amounts to confirm):**
  - **Founding curator** programme: 100–200 curators recruited before launch, a higher payout for 6 months (e.g. €0.60 per credit), a lifetime badge and a guaranteed minimum of pitches.
  - Artists come for the free tools first (pre-test, Rate & Earn, community).
  - Launch offer: first pitch free, covered by the useful-feedback guarantee.

**Product rules (validated 2026-10-03):**
- **Curator pay:** curators are paid **per answer**, whether they accept or decline, always with written feedback. They are never paid per acceptance, which would be pay-for-placement and is against Spotify's rules. They get a **fixed €0.45 per credit**, whatever pack the artist bought. ReachRadar keeps the rest, and pack discounts come out of ReachRadar's share.
- **Credit packs (revised 2026-10-03):** list price **€1.20 incl. VAT** per credit (€1.00 excl. VAT). The maximum discount is **−20%**: Starter 10 = €12 (€1.20), Artist 30 = €32 (€1.07, save 11%), Pro 75 = €76 (€1.01, save 15%), Label 200 = €192 (€0.96, save 20%). A pitch costs 1–3 credits depending on the curator's tier.
- **Margin per credit** at €0.45 to the curator, after VAT and Stripe fees: about €0.33 (Label) to €0.51 (Starter). Each bonus credit spent costs **−€0.45**, so the share of bonus credits is the main margin lever. Target: about 10% of credits spent.
- **Refunds:** every pitch gets an answer within 7 days, or the credits are refunded automatically and the curator gets nothing.
- **Free credits (revised 2026-10-03):**
  - **Sign-up bonus:** 2 credits, unlocked only once the email is verified **and** the first track is uploaded.
  - **Rate & Earn:** 2 credits per 20 ratings, capped at **4 bonus credits per month**. Ratings beyond the cap still count toward the "Top reviewer" badge.
  - **Bonus credits can only be spent on curators priced at 1 or 2 credits.** Labels and radios at 3 credits need purchased credits.
  - ReachRadar pays the curator €0.45 when a bonus credit is spent.
- **Two kinds of credits (validated 2026-10-03):**
  - **Purchased credits** (paid packs): never expire. They are the only credits that can ever be refunded in money, subject to the Terms and the 14-day withdrawal right.
  - **Bonus credits** (sign-up bonus and Rate & Earn): never refundable and never transferable to another account. They expire after **12 months of inactivity**. Inactivity means no rating given and no pitch sent; any rating or pitch resets the 12 months for the whole bonus balance. There is one expiry date per account, not per batch.
  - In the UI the balance category is called **"Bonus credits"**, not "Earned". Marketing copy can still say "earn free credits", and those credits become bonus credits.
  - The UI always shows the balance split: "36 credits · 30 purchased · 6 bonus". Bonus credits show "Active · valid until [date]". The warning colour applies within 30 days of expiry.
  - **Reminders:** an email and a notification 30 days before expiry: "Your 8 bonus credits expire on [date]. Rate a song to keep them." This is also a re-engagement lever.
  - **Rationale:** each bonus credit costs ReachRadar €0.45 with no revenue. Expiry only clears abandoned accounts, and the 10-per-month cap already limits the cost.
- **Spending order (validated 2026-10-03):** bonus credits are spent first, then purchased credits. A refunded credit (pitch not answered within 7 days) returns to its original kind.
- **Credit hold (validated 2026-10-03):** credits are **held** when the pitch is sent and only **spent** when the curator answers. With no answer within 7 days, the hold is released and the credits go back to the balance.
- **Withdrawals:** curators can withdraw from **€20**. Anti-fraud and back-end rules (identity check, 14-day earnings hold, linked accounts) are in `DEV-NOTES.md`. They are out of scope for interface design, except for showing an "Available" vs "Pending" split on earnings.
- **Attracting curators:** playlist curators and blogs get revenue ("Get paid for your time"). Labels and radios get filtered discovery (pre-qualified submissions, community scores, a weekly volume cap they set, sorting tools). Later, in-demand curators can move up a price tier.
- **Verified badge (one badge, validated 2026-10-04):** a curator is Verified when **all** of these hold:
  - the audience audit passed (re-checked every 90 days);
  - they answer on time;
  - their Feedback score stays above the threshold.
  - Failing one criterion removes the badge. Failing the audience audit delists the curator.

**UX rules applied** (from ui-ux-pro-max):
- Labels are always visible and errors appear inline under the field.
- Password fields have a show/hide toggle and a strength meter.
- Sign-up asks for essentials only; genres and links move to onboarding (progressive disclosure).
- The CTA is repeated at the hero, after each feature section and at the bottom.
- Rose budget in lists: only the playing or active item gets a rose play button. The other rows use outlined buttons.
- Curator decisions always need written feedback, and the inbox is sorted by deadline so no pitch expires unanswered.
- Known issue: white text on rose `#E54166` is about 4.2:1, below AA for 15px text. The rose was kept by choice.

### 13 — My pitches & credits (row y 4300)

The V2 shell is used. In 13a/13b the sidebar active item is **Pitch to curators**; the App Sidebar component has no "My pitches" item. In 13c the active item is **Credits & pricing**.

- `13a — My pitches · History` (x 35416):
  - Header: title, subtitle and **Pitch a track** (rose).
  - Tab component row: All 14 / In progress 2 / Answered 9 / Refunded 1 / Drafts 2.
  - 3 outlined dropdown filters (Track, Sent, Type).
  - The table panel has hairline rows:
    - Columns: track (40px cover + name + genre), sent date, curators, answers (skewed segments + x/y), accepted (rose when > 0), credits ("5 held" in warn, "7 spent", "+2 refunded" in green) and a status label. Status colours: In progress cyan, Answered / Refunded green, Draft muted.
    - Each row ends with a chevron, or "Resume" on drafts.
  - Pagination underneath.
- `13b — My pitches · Pitch detail` (x 37918):
  - Breadcrumb, title = track name, sent date + deadline, and "Pitch this track again" (Secondary).
  - Track panel: 120px cover, meta + Readiness, mini player, story.
  - Summary strip of 6 stats: curators, answered, accepted (rose), spent, still held (warn), refunded (green).
  - "Answers · 3 of 5" with one row per curator: avatar, name/type, status + date, full feedback, and a 260px side column for cost + kind and the action. The actions are:
    - "You marked this useful" + Message curator, plus a **Placement report** box (position, days, est. streams, Verified, Open on Spotify, Full report);
    - Useful / Not useful;
    - Dispute in review + reason;
    - Waiting with the countdown in warn.
  - Right column:
    - "What happens next" vertical timeline: done green / current cyan / next outlined markers.
    - "Pitch credits" ledger: one row per curator with kind marker (filled = purchased, outlined = bonus), status and amount, then Spent / Still held totals split by kind and the bonus rule note.
    - "Report a problem" link.
- `13b·2 — Pitch detail · Dispute modal` (x 40420): 13b under an 82% midnight overlay, with a 600px modal:
  - context line and feedback excerpt (cyan 8% callout);
  - "Why isn't it useful?" with 4 radio cards (the selected one has a cyan border on surface-2);
  - optional details (Input), then a warn box "2 of 3 disputes left this month" with the 48 h review and refund rule;
  - Cancel (Ghost) + **Send dispute** (rose).
- `13c — Credits history` (x 42922):
  - Header with "Export CSV" (Ghost).
  - Balances strip: Available 24, Purchased 18 (filled marker, "Never expire"), Bonus 6 (outlined marker, "Valid until Oct 2027 · last activity Oct 4, 2026"), Held 10 (warn).
  - Ledger table: date, movement (type + description), kind marker, amount and balance. Amounts are coloured: held −x in warn, spent "x from held" in muted, earned/refunded +x in green, purchase +x in cyan.
  - "How credits work" rules box: 4 rules with markers.

### 14 — Checkout (row y 6200, light chrome)

- **Chrome:** no sidebar. A 1920 bar with a bottom hairline: logo left, shield "Secure checkout" centred, "Back to pricing" right. The content is a 1200 column.
- `14a — Checkout` (x 35416):
  - Gradient "Checkout" title + account line.
  - **"Your pack" (520):** 4 radio cards. The selected one is surface-2 with a cyan border, showing "Save x%" in green and €/credit. Then:
    - promo code (Input with "Apply" trailing);
    - Subtotal / VAT / Total (Metric/Large);
    - the coins note "Purchased credits never expire".
  - **"Payment":**
    - Apple Pay / Google Pay / PayPal use the new **Button · Type=Secondary wIcon** variant (Secondary outline + 18px icon slot before the label), with brand marks **Logo/Apple**, **Logo/Google** and **Logo/PayPal**. These are 24px components from Simple Icons, white text-primary fill, on the Design System page. They are followed by the "or pay by card" divider.
    - Inputs: email, card number (brands trailing), expiry + CVC, name, country.
    - Checkboxes for the company invoice and Terms (acceptance includes waiving the 14-day withdrawal right on credits used).
    - **Pay €32** (rose) and a Stripe note.
- `14b — Checkout · Confirmation` (x 37918): 880 card with:
  - a green ring check and gradient "+30 credits added";
  - the new balance split (48 purchased + 6 bonus);
  - the receipt box (pack, paid incl. VAT, card, date, receipt no.) and "Download invoice (PDF)";
  - **Pitch a track** + "Back to dashboard".
- `14c — Checkout · Payment failed` (x 40420): 14a with:
  - the card number Input in its Error state;
  - a rose-outlined 8% banner above the button: "Payment declined by your bank", reason, "No money was taken", "Try another method";
  - the button reads "Try again · €32".

### 15 — Curator earnings (row y 7700)

The 03c curator shell is used, with **Earnings** active in the Pro sidebar. The persona is Liam Mate.

- `15a — Curator · Earnings` (x 35416):
  - Header: "€0.45 per credit, paid on every answer" + Chip period selector (This month active / 3 months / Year / All time).
  - KPI strip:
    - Available €62.10 (cyan) with **Withdraw €62.10** (rose);
    - Pending €21.60 (warn, "unlock 14 days after each answer · next release");
    - Earned this month €83.70;
    - Answers 93 ("96% on time · Feedback score 94%").
  - Left column:
    - **Earnings per week:** single-series cyan bar chart, square ends, recessive grid at €0/10/20, current week dashed outline, one hover tooltip, no legend.
    - History table: date, artist, track · decision, credits, amount, status. Statuses: Pending · date in warn, Earned in green, Refunded to artist in muted, Withdrawn.
    - Withdrawals list with Paid + Receipt.
  - Right column:
    - Payout method (IBAN ending, Stripe Connect, "Edit", monthly payout note).
    - Tax & identity (identity verified, tax residency DAC7).
    - Stay verified (badge + next audit, on-time %, late answers in warn, Feedback score).
- `15b — Earnings · Withdraw modal` (x 37918): 82% overlay with a 560 modal:
  - amount Input ("Max", min €20 helper) and a selected IBAN radio card;
  - Fee €0.00, arrival "with the Nov 1 payout", You receive €62.10 (Metric);
  - pending note, Cancel + **Confirm withdrawal**.
- `15c — Earnings · Payout setup` (x 40420):
  - "Set up payouts" title.
  - Stepper with 3 Section Badges (01 Identity active, 02 Bank account, 03 Tax residency at 35%) joined by hairlines.
  - Identity form: legal names, birth date, country, and 2 ID dropzones (uploaded = green solid border, empty = dashed). Then **Continue · bank account** + "Finish later".
  - Right column "Why we ask": safety, 14-day unlock, monthly payouts, DAC7.

### 16 — Settings (row y 9700)

The V2 shell is used, with **Settings** active in the sidebar. Header "Settings".

- **Layout:** a 260px sub-nav (Profile / Account / Notifications / Privacy & data / Billing; the active tab is surface-1 with a 3px rose bar and white label) and a 720px section column.
- **Section structure:** each group has a Heading/Card title + muted description and is separated by a bottom hairline. Every section ends with **Save changes** + Cancel (Ghost).
- `16a — Settings · Profile` (x 35416):
  - 80px avatar + Change photo / Remove, and a dashed banner dropzone.
  - Artist name, bio (character count), location.
  - Genres as Chips (3 active), and 6 link Inputs in 2 columns.
- `16b — Settings · Account` (x 37918):
  - A green 8% success toast at the top ("Password updated").
  - Email with "Verified" trailing.
  - Password current / new + a 4-segment strength meter (green) / confirm.
  - Connected accounts (Google connected, Spotify "Connect" Secondary).
  - Account type "Artist" + "Add a Pro profile".
- `16c — Settings · Notifications` (x 40420):
  - A matrix panel of events × Email / In-app / Push with **square switches** (on = cyan fill + dark knob right, off = surface-3 fill, strong border + light knob left). The events include "Bonus credits expiring".
  - Quiet hours (From / To).
- `16d — Settings · Privacy & data` (x 42922):
  - Visibility radio cards (Public selected / Members only).
  - "Open to collabs" switch and "Who can message me".
  - Your data: **Export my data** (Secondary) + Cookie preferences / Privacy policy links.
  - **Danger zone:** rose outline box at 6% with "Delete my account" in an outlined rose button, plus a note about typing the artist name to confirm. The confirmation modal is not drawn yet.
- `16e — Settings · Billing` (x 45424):
  - Credit balance strip (purchased / bonus with validity / held) + Credits history / Buy credits links.
  - Invoices table (PDF links), saved payment method (Replace / Remove), billing details incl. optional VAT number.
- **Not drawn:** curator extras (submission settings, payout link → 15).

### 17 — Upload a track (row y 11800)

The V2 shell is used, with **My profile** active. Breadcrumb "My profile / Upload a track". The mock track is **Afterlight** (Melodic techno, 123 BPM, 6:42, feat. Mara Lune, Upcoming Nov 21).

- `17a — Upload a track` (x 35416): numbered panels (01–05, cyan number + Heading/Card).
  - **Audio:** file row + "Uploaded" in green, a green progress line, a cyan play square and a 150-bar waveform (played part cyan, rest slate).
  - **Artwork:** 160px preview, specs, "Replace artwork" + Remove.
  - **Details:** title / featured, artist, release status Chips (Upcoming active), release date, private link, explicit checkbox.
  - **Tags:**
    - primary and secondary genre;
    - moods Chips (2 of 3 active);
    - BPM and key marked "Auto-detected";
    - vocals and length.
  - **Rights:** rights checkbox, optional ISRC.
  - **Right column:**
    - Track Card preview with the artwork;
    - "Ready to publish 5 / 6" checklist (green filled boxes);
    - **Publish track** + "Save as draft";
    - next-step note (free pre-test, then pitch).
- `17b — Upload a track · Published` (x 37918): the checklist is replaced by a green-outlined "Afterlight is live" panel with **Pitch this track now** (rose) + "Pre-test it first · free" (Secondary) and a note that the Readiness score feeds the Match %.

### 11b revision pass (2026-10-14)

- **Mock persona:**
  - Ilan Mercier (initials IM), "Producer & DJ", replaces John Doe on every app screen except the V1 dashboard archive.
  - Tracks:
    - Neon Rain: Melodic techno, 124 BPM, Readiness 78.
    - Midnight Drive: Deep house, 122 BPM, Readiness 84.
    - Night Swim (formerly Paper Hearts): Drum & bass, 174 BPM, Readiness 88.
    - Golden Hour: Afro house, 120 BPM, not tested.
    - Slow Dance (demo): Downtempo, 98 BPM.
  - Curators:
    - Late Night Indie → **Late Night Grooves** (LG).
    - Bedroom Pop Diaries → **Warehouse Diaries** (WD).
    - Pop Notes → **Pulse Notes** (PN).
    - Soft Hours / Soft R&B Hours → **Sunset Grooves** (SG).
    - Indie Waves → **Deep Waves**.
  - Genres:
    - Indie pop → Melodic techno.
    - Bedroom pop → Deep house.
    - Dream pop → Progressive house.
    - Alt R&B → Afro house.
    - Neo-soul → Organic house.
    - Lo-fi → Downtempo.
  - The genre filter lists stay generic (Electro, Hip-hop, etc. remain).
- **01 Home:**
  - Section 02 is now **"Three promises"**: the tagline as subtitle, then "Useful or refunded" (shield-check), "Test before you pitch" (headphones) and "Real fans" (trending-up).
  - Section 03: subtitle "2 180 Verified curators, audience audited every 90 days…". Each category card shows "from x credits · xx% useful".
- **03b Curator profile:**
  - "Verified · audited Sep 2026".
  - Key facts: Feedback score 94% replaces Response rate. The avg. response caption reads "96% on time · max. 7 days".
  - Price card: "94% match with Neon Rain" and "~41% acceptance chance".
  - The guarantee "Useful feedback, or refunded".
- **03c Inbox:** the Feedback score stat replaces Response rate. A tip 04 explains that artists rate every answer and disputes can lead to refunds.
- **Curator Card (component):** the Response stat becomes **"Useful feedback"** (%). The match line reads "xx% match · ~xx% chance".
- **Result Card (08):** the status line reads "Open · xx% acceptance · xx% useful".
- **04a:** a Readiness tag (Rating component) + "Readiness" per track, "Test it first · free" on an untested track, and "Pre-test · 6 / 20 ratings" on the demo.
- **04b / 04c:**
  - The total is split into "Bonus credits (1–2 cr curators)" and "Purchased credits".
  - The guarantee reads "Answer within 7 days and useful feedback, or your credits come back / are refunded".
  - 04c timeline: "After Oct 10 · Credits back" now mentions disputes. The track tag reads "Readiness 84 / 100".
- **06 Pricing:**
  - Hero subtitle with the guarantee.
  - The "0 credits" item now covers feedback confirmed not useful.
  - Starter pack lists "Verified curators" and "Useful feedback, or refunded". Pro lists "Placement reports".
  - The trust row shows "Useful feedback or refunded".
- **09d Terms:** the Curators section gains the dispute rule (48 h, 3 a month, refund + no curator pay), the Verified badge conditions, and an 80-character minimum for feedback.

## Do's and Don'ts

**Do**
- Keep every screen on the midnight background with high contrast and lots of negative space.
- Use real, moody concert photography (crowds, hands up, stage lasers, DJ booths), graded cyan and blue.
- Repeat the skew motif consistently so the brand reads at a glance.
- Use one gradient headline and at most two rose accents per screen.
- Write all display text in UPPERCASE Syne.

**Don't**
- No white or light backgrounds, no light mode.
- No purple/violet gradients, no glassmorphism, no neon rainbow, no 3D blobs.
- No rounded pill buttons, no bubbly rounded cards (radius > 4px), no soft drop shadows.
- No generic SaaS dashboard look (light grey cards, blue default buttons, stock illustrations, emoji).
- Don't use any typefaces other than Syne and Inter, and never set Syne in lowercase or sentence case.
- Don't use rose for large surfaces. It is an accent only.
