---
name: hokan-workflow
description: >
  Build a cinematic scroll-scrub website for any real business (tattoo studio,
  barber, restaurant, gym, florist, garage...) using the Higgsfield MCP for the
  visuals only — Claude does the research, code, ffmpeg and deploy locally, and
  the generation cost is quoted and approved before any job is submitted. The
  page is one continuous "film": the visitor's scroll plays an
  AI-generated multi-clip movie in a pinned hero, chapter headlines swap as it
  plays, and the film resolves into the business's logo. Use when the user asks
  for a "cinematic site", "scroll scrub website", "scrollytelling site", or a
  premium landing page for a local business. Research is mandatory: scrape the
  web and social profiles for real photos, reviews, hours, and the logo before
  designing anything.
---

# Cinematic scroll-scrub website for a real business

One page, one idea: **scroll IS the film.** A pinned hero plays a chained,
seamless AI-generated movie frame-by-frame under the visitor's thumb; the rest
of the page is built from the business's REAL content (photos, reviews, hours),
art-directed to match the film's grade. The film's last shot lands on the
business's logo.

## Non-negotiables

1. **Ask the intake questions FIRST** (one round, see Phase 0). The number of
   sections drives everything downstream.
2. **Real business data only.** Reviews, hours, addresses, phone numbers and
   portfolio photos come from research, never invented. Invented "Jane Doe"
   quotes or fake ratings are failures.
3. **Seamless clip chaining.** Every clip after the first STARTS from the exact
   last frame of the previous clip (extracted with ffmpeg, uploaded as the next
   clip's `start_image`). The scrub must play as ONE continuous take.
4. **The film ends on the logo.** The final clip resolves into the business's
   real logo (see Phase 4 for the two techniques).
5. **The user's own assets always win.** A real logo, real photos, real brand
   colors are used as-is; generation fills gaps only.
6. **Higgsfield is a generation service, not a runtime.** It is used for
   `generate_image` and `generate_video` ONLY (plus the media upload/import
   calls those two require). Everything else — research, design decisions,
   ffmpeg, all code, deploy — is done by Claude locally. See "Execution model".
7. **Quote the generation cost and get a yes BEFORE Phase 3.** No image or
   video job is submitted until the user has confirmed the budget.

---

## Execution model — Claude codes, Higgsfield generates

The intended setup is **Claude Code running on the user's own Anthropic
subscription**, with the Higgsfield MCP attached as a tool. Reasoning and
coding turns are then covered by the Claude plan, and Higgsfield credits are
spent only on pixels.

**Draws Higgsfield credits — the only things that should:**

| Call | Phase |
|---|---|
| `generate_image` (boards, stills, plates, icons, monogram, logo card, OG) | 3 |
| `generate_video` (the chapter clips) | 4 |
| `media_upload` / `media_import_url` / `media_confirm` feeding the above | 3, 4 |

**Never spend Higgsfield credits on:** web research, writing the design brief,
frame extraction, the scrub engine, section markup, the quality gate, or
deployment. Those are local work.

### Cost discipline (apply in every build)

- **Pre-flight quote.** Before the first generation, total up the planned image
  and video jobs, price them from the user's real ledger (`transactions`) rather
  than list prices, check `balance`, and present the number. Wait for a yes.
- **Agree the config first.** Section count and chapter count are the two
  dials that move the bill. Chapters are the expensive one — each is a full
  video generation. Recommend 3 chapters; treat 4 as a paid upgrade.
- **Preview cheap, finish expensive.** Rough the film with
  `seedance_2_0_mini`, or `seedance_2_0` at `mode:'fast'` / 720p. Only re-run
  at `std` / higher resolution once the user has approved the look.
- **Re-rolls are not free.** One automatic re-roll of a board that reads like
  a template is fine. A second re-roll of the same asset needs the user's
  go-ahead — say what is wrong with it and what the retry will cost.
- **Grade drift is an ffmpeg problem, not a re-roll problem.** Colour-match a
  drifting clip with `eq`/`colorbalance` before spending on a regeneration.
- **Cheap model for cheap jobs.** Background plates and textures do not need
  the premium image model; reserve it for the boards and the hero still.
- **Stop and report if the balance would go negative mid-build.** Running out
  after the film is paid for but before the site ships is the worst outcome —
  flag it at the quote stage, not halfway through.

---

## Phase 0 — Intake (ONE question round, then never again)

Ask the user, in a single message:

1. **How many sections** should the page have? (Recommend 6 to 8: film hero +
   about + offering/styles + gallery + process + reviews + contact. The hero
   film gets one chapter per ~2 sections, minimum 2, maximum 4 chapters.)
2. **Business identity**: name, address/city, phone/WhatsApp, website or Google
   Maps listing, social handles (whatever they have; the rest gets researched).
3. **Logo**: do they have a logo file? If yes, request it (SVG/PNG ≥512px). If
   no high-res logo exists anywhere, offer to design a monogram and get a yes
   before using it as "the logo".
4. **Booking/contact channel** for the primary CTA (WhatsApp, phone, booking
   link, form).

Defaults if unreachable: 7 sections, 3 film chapters, monogram designed from
the business initial, primary CTA = phone.

## Phase 1 — Research (mandatory, before any design)

- Web-search the business name + city. Extract the top listings (their own
  site, directory pages, press features) WITH images.
- Pull social profiles (Instagram/Facebook/TikTok) for: bio, follower-verified
  identity, profile picture (often the only logo), and real work/interior
  photos.
- Collect into a fact sheet: exact address, phone, opening hours (per day),
  rating + review count, 3 real short review quotes WITH reviewer names,
  services/specialties, staff names if public.
- Download every usable real photo (portfolio pieces, interiors) into
  `public/assets/work/`. Real photos of the actual business beat generated
  stand-ins every time.
- Grade check: if real photos clash with the film's grade, keep them but plan
  a subtle CSS filter (contrast/desaturation) rather than replacing them.

## Phase 2 — Design brief (write it down before code)

Commit a short `design-brief.md`:

- **Concept spine**: name the narrative that makes scroll meaningful for THIS
  trade (tattoo: "scroll is the needle"; bakery: "scroll is the oven's night";
  barber: "scroll is one cut"). Chapters of the film = beats of that story.
- **Palette**: derive 3 colors from the trade's material world (ink/steel/
  blood, flour/crust/fire...). One dark ground, one light text tone, ONE
  accent. Avoid the generic AI reaches (black+orange "tech", black+neon,
  beige+brass "artisan", purple glow). Lock hexes and reuse them in every
  image/video prompt.
- **Type**: one heavy display face + one workhorse sans + a mono for meta
  rows. No serif unless the brand genuinely demands it.
- **Section plan**: the N sections from intake, each with a DIFFERENT layout
  family (editorial offset, accordion rows, staggered masonry, rail journey,
  giant-numeral stats, color-blocked diptych...). No two adjacent sections
  share a family.
- **CTA inventory**: every CTA gets its own interaction identity (viewfinder
  brackets, notched fill block, stamp press...). Never one shared button style.

## Phase 3 — Boards, then stills (all async, submit and keep working)

- Generate ONE 16:9 design-board mockup image PER SECTION (strong image model,
  e.g. `nano_banana_pro`, quality high). Prompt each with: section role, exact
  hexes, typography character, composition anchor (vary it per section), real
  headline wording, "no watermark, no browser chrome". LOOK at every board;
  re-roll any that reads like a template.
- Generate the asset kit in the same batch window:
  - **Hero still** (2 candidates): the film's opening frame. Cinematic macro
    or interior in the locked palette, "no text, no logos".
  - **Section plates**: 1-2 dark atmospheric textures for section backgrounds.
  - **Icon sheet**: one image, 6 consistent 2px-stroke glyphs on the ground
    color, sliced into individual PNGs afterward.
  - **Monogram** (only if no real logo): simple mark, flat, on the ground color.
- Download boards to `refs/`, winners to `public/assets/`. Downscale for web
  (hero ≤1920w jpg/webp).

## Phase 4 — The film: chained clips, seamless, logo ending

Let C = chapter count (2-4). Each clip is ~5s, 16:9, 720p, generated with the
Higgsfield video model (`seedance_2_0`) via image-to-video.

**Chaining recipe (this is what makes it seamless):**

1. Clip 1: `start_image` = approved hero still. Prompt one continuous, cut-free
   camera move with a clear progression (push-in, rack focus, light sweep).
   Always include: "no cuts, no camera shake, one continuous slow move".
2. Extract the LAST frame of clip 1:
   `ffmpeg -sseof -0.1 -i c1.mp4 -frames:v 1 -q:v 2 last1.png`
3. Clip 2: `start_image` = `last1.png` (upload it or pass its URL). The motion
   continues from exactly where clip 1 ended. Repeat for every chapter.
4. **Final clip = the logo landing.** Two techniques, in order of preference:
   - If the video model accepts an `end_image` role (check the model's media
     roles via the MCP's model-explore tool): compose a "logo card" image
     (the real logo centered on the brand ground color) and pass it as
     `end_image` with `start_image` = previous last frame. Prompt: "the scene
     dissolves into darkness and resolves into the emblem, one continuous
     move".
   - Otherwise (or as a guarantee of pixel-perfect branding): prompt the final
     clip to end in near-darkness ("camera pushes past the subject into deep
     shadow"), then do the logo reveal IN CODE: an absolutely-positioned logo
     overlay inside the sticky hero that scales/unclips in during the last 5%
     of scrub progress. This always looks crisp and uses the REAL logo file.
5. **Grade continuity**: name the same hexes/grade words in every clip prompt.
   If one clip drifts, color-grade it toward the others with ffmpeg
   (`eq`/`colorbalance`) instead of re-rolling twice.

**Frames for the scrub:**

- Extract at 14 fps, 1280w webp:
  `ffmpeg -i cN.mp4 -vf "fps=14,scale=1280:-2" -c:v libwebp -q:v 62 out-%03d.webp`
- Concatenate all clips' frames into one numbered sequence
  `public/frames/hero/f-001.webp ... f-XXX.webp` (~70 frames/clip; keep the
  whole sequence under ~8 MB).
- Keep frame 1 as a jpg poster too.

## Phase 5 — The scrub engine (implementation contract)

Framework-agnostic recipe (React + GSAP ScrollTrigger + Lenis is the proven
stack; adapt to the project's conventions):

- Hero section height ≈ `140vh × C` (mobile ~70%), containing a
  `position: sticky; top: 0; height: 100dvh` viewport layer.
- Inside the sticky layer: a poster `<img>` (frame 1) UNDER a `<canvas>`.
  First paint must always show a finished hero even before JS runs.
- Canvas renderer: cover-fit draw, devicePixelRatio ≤2, preload frame 1
  immediately, stream the rest with ~6 parallel loaders, draw the nearest
  loaded frame while streaming.
- One ScrollTrigger (scrub 0.5-0.8) over the tall section maps progress →
  frame index. The same progress drives:
  - a thin accent **progress rail** (scaleY transform),
  - **chapter text stages**: one absolutely-positioned stage per chapter;
    swap them with clip-path inset + translateY (transform/clip only, never
    opacity-to-zero on scroll), stage 1 fully visible at scroll 0,
  - the **logo overlay reveal** in the last ~5% (if using the code-side logo
    landing).
- Smooth scroll: Lenis with `autoRaf: false`, driven by `gsap.ticker`, wired
  to `ScrollTrigger.update` (without the bridge the scrub stutters).
- **Reduced motion**: no pin, static final frame (or logo card), chapter 1
  text only. Gate every animation on `prefers-reduced-motion`.
- Mobile: shorter section height, same frames; cursor-only effects get scroll
  equivalents.
- SSR safety (if the stack server-renders): no `window`/`document` outside
  effects/handlers.

## Phase 6 — The rest of the page

Build the remaining N-1 sections to the boards, with the real researched
content:

- About/story section with a meta rail (address, rating) and one generated or
  real interior shot.
- Offering/styles as interactive rows or cards, each opening a REAL work photo.
- Gallery: staggered masonry of real photos with mono captions and slight
  scroll parallax (transform only).
- Process/journey: numbered steps along an accent rail that draws with scroll,
  annotated with the sliced icon set.
- Reviews: the real rating as an oversized numeral + 2-3 real quotes with real
  names, source labeled ("Google Rezension" / "Google review").
- Contact/booking: color-blocked diptych — accent CTA block (the intake's
  booking channel) + info column (address, phone, per-day hours, socials,
  maps link). Footer strip with logo + address.
- Film grain overlay (CSS noise, ~5% opacity) unifies generated and real
  imagery.

## Phase 7 — Quality gate (check every item before shipping)

- No placeholder text, no lorem, no empty `src`, no em-dashes in visible copy.
- No invented stats/quotes; every fact traces to research.
- Hero paints complete without JS (poster + stage 1 + CTA visible).
- Frames total ≤ ~8 MB; scrub tested forward AND backward.
- Clip seams invisible: step through the frame sequence around each seam; if
  a seam jumps, re-extract the handoff frame and regenerate that clip.
- Logo landing: real logo file, crisp, on brand ground; favicon set derived
  from the same logo (32/16 ico+png, apple-touch 180, 192/512 + webmanifest,
  theme-color).
- One label per CTA intent page-wide; each CTA has a distinct garment.
- Reduced-motion pass: page fully readable with animations off.
- OG/social card composed in the brand language and wired into `<head>`.
- Every downloaded asset is referenced somewhere; move rejects out of public.

## Phase 8 — Ship and report

Deploy to the user's own hosting by default — a static build on Cloudflare
Pages, Vercel, Netlify or whatever the project already uses. The frames
directory is just static assets, so any static host works. Higgsfield's
`create_website` / `deploy_website` are an option, not the default: use them
only when the user asks for Higgsfield hosting.

Report to the user:

- the live URL,
- the concept spine in one sentence,
- the generated brand assets they now own (film clips, stills, icon set,
  monogram/logo card, OG card),
- **the actual Higgsfield credits spent**, split images vs. video, against the
  pre-flight quote — and the closing balance,
- anything honestly skipped or approximated.
