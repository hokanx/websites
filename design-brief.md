# Shi — The Pleasure of Asia Cuisine · Design Brief

Cinematic scroll-scrub site. Köln-Mülheim, Am Kabellager 5.

## Concept spine

**Scroll is the wok fire.**

Google's own "know before you go" summary for Shi says diners *love watching the
chefs prepare fresh meals in the open kitchen*. That open kitchen is the
restaurant's actual differentiator, so the film is one continuous take of a
single dish being made in it: cold mise-en-place under the lanterns, the wok
igniting, the plate landing in the dining room. The visitor's thumb is the
flame — scrolling advances the cook. The film resolves into the Shi mark.

Chapters (3):

1. **Mise-en-place.** Macro push-in across cold prepped ingredients on steel
   under warm lantern light. Stillness before heat.
2. **Wok fire.** The same move continues into the wok; flame blooms, ingredients
   toss, steam sweeps the frame. The loudest beat.
3. **Service.** Camera rides the finished plate out of the pass into the dining
   room, past the teal banquettes, then pushes into deep shadow and resolves
   on the emblem.

## Palette

Derived from the restaurant's real interior (Google listing photo): petrol-teal
banquettes, warm wood slats, cream paper panels, amber pendant lanterns, black
steel pass.

| Role | Hex | Where it comes from |
|---|---|---|
| Ground (dark) | `#0C1F24` | banquette teal, driven to near-black |
| Surface | `#17414A` | the mid petrol of the seating and tiled pass |
| Light text | `#F2EAD9` | the cream shoji-style wall panels |
| Accent (only one) | `#E4863A` | the amber glow of the pendant lanterns |

Deliberately *not* black+neon, not beige+brass "artisan", not purple glow. The
teal ground is the unusual note and it is real — it is literally the color of
their chairs.

## Type

- **Display:** heavy grotesk, tight tracking, uppercase for chapter titles.
- **Workhorse:** neutral sans for body at generous line height.
- **Meta:** mono for the address/hours/rating rails and gallery captions.
- No serif. The room is modern, not a temple pastiche.

## Section plan (7, each a different layout family)

1. **Film hero** — pinned canvas scrub, chapter text stages, progress rail,
   logo landing. Height ≈ 140vh × 3.
2. **About / Am Kabellager** — editorial offset: oversized headline pushed off
   the grid, one interior image, mono meta rail (address · rating · hours).
3. **Aus dem Wok** — accordion rows, one per menu family (Vorspeisen, Suppen,
   Wok-Kreationen, Curry, Reis & Nudeln). Each row opens a real dish photo.
4. **Galerie** — staggered masonry of real photos, mono captions, transform-only
   scroll parallax.
5. **Offene Küche** — rail journey: numbered steps along an accent rail that
   draws with scroll, annotated with the sliced icon set.
6. **Bewertungen** — giant numeral `4,3` set against real Google quotes with
   real reviewer names, labelled "Google Rezension".
7. **Bestellen & Finden** — color-blocked diptych: accent block with the primary
   "Online bestellen" CTA, info column with address, phone, per-day hours,
   Instagram, maps link. Footer strip with logo + address.

No two adjacent sections share a layout family.

## CTA inventory (each gets its own garment)

| Intent | Where | Interaction identity |
|---|---|---|
| `Online bestellen` (primary) | hero, section 7 | notched accent block, fill wipes in from the left on hover |
| `Tisch anfragen` | section 2 | underline that redraws as a stroke |
| `Zur Speisekarte` | section 3 | mono label with a bracket that opens |
| `Route` | section 7 | outlined pin chip that lifts |
| `Anrufen` | footer | plain mono link, no chrome |

One label per intent page-wide.

## Facts (researched — nothing invented)

- Name: Shi — The Pleasure of Asia Cuisine · Köln
- Address: Am Kabellager 5, 51063 Köln-Mülheim
- Phone: 0221 80034714 · Email: info@shi-asia.de
- Site: shi-asia.de · Instagram: @shiasiakoeln
- Google: 4,3 ★ from 680 reviews · price band €20–30 · Asian restaurant
- Hours: daily 11:30–22:00
- Known for: open kitchen, outdoor terrace, large portions, Thai curry noodle
  soups, wok creations with tofu/chicken/beef, edamame and spring rolls
- Example price point: Thai-Curry-Suppe 7,50 €

## Open items

- Real logo file: still not available. The header/footer mark stays a coded
  typographic wordmark (no AI generation) rather than an invented logo.
- Named review quotes still needed; only paraphrased review themes were
  retrievable via search.

## Asset sourcing (rebuild pass)

This session's environment still can't reach `higgsfield.ai`/`.app` or its
CloudFront asset hosts by direct network access (org egress policy, confirmed
via the proxy status log) — so nothing could be downloaded into `public/`.
Instead, the hero film and gallery reference the already-generated Higgsfield
assets for this project **directly by their CDN URL**, spending zero new
generation credits:

- Hero poster + gallery stills: the existing petrol/amber-palette generations
  (mise-en-place macro, lantern bokeh, steam plate).
- Hero film: two existing clips, played as a **hard-cut chaptered film**
  rather than one blended take — they weren't generated with the last-frame
  chaining technique (each starts from an independent still), so faking a
  seamless single shot would only expose video-seek jitter. Clip A (mise en
  place push-in) covers chapter 1; clip B (wok ignition through to the
  plated dish) covers chapters 2–3.
- Scrubbing binds scroll progress to each `<video>`'s `currentTime` instead
  of the canonical baked-webp canvas sequence, since that needs local
  `ffmpeg` access to the source clips. Smooth in both directions on desktop;
  expect more jitter than the canvas method on scrubbing backward, especially
  on lower-end mobile. Swapping in the canonical frame sequence later (once
  the network policy allows fetching the clips) is a contained follow-up —
  `initFilm()` in `src/main.js` is the only place that needs to change.
- Trade-off accepted knowingly with the client-facing side: this build is
  meant to be shown to the client first; if they buy, the assets get migrated
  to self-hosting so the site doesn't depend on Higgsfield's CDN staying up.
