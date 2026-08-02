# STAMP BURGER — cinematic scroll-scrub site

One page where **scroll is the press**: a pinned hero plays a three-chapter film
frame by frame under the visitor's thumb, chapter headlines swap as it plays, and
the film resolves onto the brand mark.

- `design-brief.md` — concept spine, locked palette, type, section plan, CTA inventory
- `research-facts.md` — every fact on the page and where it came from

## Run

```bash
npm install
npm run dev        # vite dev server
npm run build      # static build to dist/
npm run preview    # serve the build
npm run icons      # regenerate the favicon set from the stamp mark
```

## Current state

The site is complete and shipping-ready **except for the generated film and
stills**. See "Blocked: asset egress" below.

| Piece | State |
|---|---|
| Design system, palette, type | Done |
| Section 1 — film hero, scrub engine, chapter stages, progress rail, logo landing | Done, waiting on frames |
| Section 2 — about (editorial offset) | Done |
| Section 3 — menu (accordion rows) | Done |
| Section 4 — process (numbered accent rail) | Done |
| Section 5 — reviews (giant numeral) | Done |
| Section 6 — order/find us (colour-blocked diptych) | Done |
| Favicons, webmanifest, JSON-LD, OG tags | Done (OG image pending) |
| Reduced-motion and mobile passes | Done, verified in Chromium |
| Film frames, hero still, section plates, OG image | **Blocked** |
| Gallery section | Deferred — no real photography available yet |

## Blocked: asset egress

Higgsfield generates the imagery, but this environment's network policy denies
its asset CDN:

```
d8j0ntlcm91z4.cloudfront.net:443 -> gateway answered 403 to CONNECT
```

So generated pixels cannot be pulled to disk, which is what ffmpeg needs in
order to extract and chain the scrub frames. `WebFetch` is likewise 403 on every
host, which is why research came from search snippets only.

**To unblock:** allow `d8j0ntlcm91z4.cloudfront.net` in the session's egress
policy (Claude Code environment settings), then:

```bash
# 1. download the three approved clips into film/
# 2. build the scrub sequence
node scripts/build-frames.mjs film/c1.mp4 film/c2.mp4 film/c3.mp4
```

That writes `public/frames/hero/f-0001.webp …`, a `manifest.json`, and
`public/assets/hero-poster.jpg`. The hero picks all of it up with no code
change: it fetches the manifest on mount, and falls back to the poster and
ground gradient when the manifest is absent.

## The film pipeline

Three chapters, each a ~5s Seedance 2.0 clip, chained so the scrub plays as one
continuous take:

1. Clip 1 starts from the approved hero still.
2. `ffmpeg -sseof -0.1 -i c1.mp4 -frames:v 1 last1.png` gives clip 2 its
   `start_image`, and so on. `seedance_2_0` also accepts an `end_image`, so the
   final clip is pinned to the logo card.
3. `scripts/build-frames.mjs` extracts at 14fps/1280w webp and drops the
   duplicated handoff frame at each join so the seams do not stutter.

The logo landing is belt-and-braces: the film ends on the mark **and** the real
logo file is revealed in code over the last 5% of scrub progress, so it is
always crisp.

## Logo

`src/components/Logo.jsx` is an **interim wordmark**, not the client's real
logo, which has not been received. It is inline SVG so it renders with the
page's own Archivo Black webfont and stays sharp at the film's landing size.
Swap its internals when the real artwork arrives, then re-run `npm run icons`.

## Honesty notes

- Prices are deliberately absent. Only one price was recoverable in research;
  a partial list reads as broken and a full one would be invented.
- Review quotes are verbatim Foursquare tips, attributed to the platform. No
  reviewer names were retrievable, so none are shown.
- Opening hours and phone number are `null` in `src/data/business.js`. The
  contact section omits those rows entirely rather than guessing. Fill them in
  and they render automatically.
