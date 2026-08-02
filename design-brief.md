# STAMP BURGER — design brief

## Concept spine

**Scroll is the press.**

The brand is called STAMP. A stamp is a single downward gesture that leaves a
permanent mark. So the visitor's scroll *is* that gesture: as they pull the page
down, they drive a stamp down through three beats of a burger being made, and
the film resolves at the moment the mark lands — which is the logo.

Scroll down = press down. The page cannot end until the stamp has struck.

### The three chapters (= the three film clips)

| # | Chapter | On-screen headline | What the camera does |
|---|---|---|---|
| 1 | **HEAT** | `THE FLAT-TOP IS ALREADY HOT` | Slow push-in across a scorching black flat-top; a beef patty presses down, crust forming, smoke drawn sideways by extraction |
| 2 | **THE BUILD** | `120G ANGUS. BRISKET. STAMP SAUCE.` | Continuous drift upward along the stack as cheddar slumps over the seared crust and stamp sauce falls |
| 3 | **THE PRESS** | `GET STAMPED` | Camera rises to meet the descending top bun; everything darkens to the ground colour and the emblem resolves out of the shadow |

Chapter 3 is where the logo landing happens — belt and braces: `end_image` on the
Seedance clip **and** a code-side logo overlay in the last 5% of scrub progress,
so the final mark is always the real, pixel-crisp logo file.

## Palette — locked

Derived from the material world of a Saudi smash-burger counter: seared crust,
blackened flat-top steel, stamp-pad ink, sesame bun, jalapeño heat.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#17110F` | Ground. Charred steel with a warm brown cast — deliberately *not* pure black |
| `--bun` | `#F2E7D5` | Light text tone. Sesame bun / butcher paper |
| `--stamp` | `#C4392B` | **The single accent.** Stamp-pad ink red, earthy not fluorescent |
| `--ash` | `#4A3F39` | Rules, borders, muted meta text. A tint of the ground, not a fourth brand colour |
| `--sear` | `#8C4A22` | Reserved for image grading targets only. Never used as UI colour |

Explicitly avoided: black + orange (generic "tech"), neon on black, beige +
brass "artisan", purple glow. The warm-charcoal / bun-cream / ink-red triad
reads as butcher paper and stamp pad, which is the brand's own material world.

Every image and video prompt names `#17110F`, `#F2E7D5` and `#C4392B` verbatim
so the generated film and the CSS agree.

## Type

| Role | Face | Why |
|---|---|---|
| Display | **Archivo Black** | Heavy grotesque with flat terminals — reads as a struck, inked mark |
| Workhorse | **Archivo** (variable) | Same superfamily as the display, so headings and body share skeleton |
| Meta / mono | **IBM Plex Mono** | Receipt-and-ticket character for addresses, hours, captions, spec rows |
| Arabic | **IBM Plex Sans Arabic** | Covers ستامب برجر and any Arabic strings; harmonises with Plex Mono |

All self-hosted via `@fontsource` — no external font CDN, which also keeps the
page working under the strict network policy.

Display is always set in uppercase with tight tracking. Mono rows are uppercase
with wide tracking. No serif anywhere.

## Section plan — 7 sections, no two adjacent layout families alike

| # | Section | Layout family | Notes |
|---|---|---|---|
| 1 | **Film hero** | Pinned scrub canvas | Sticky viewport, poster under canvas, chapter stages, progress rail, logo landing |
| 2 | **About / الحكاية** | Editorial offset | Oversized statement set left, meta rail right (street, rating, branch list) |
| 3 | **The Stamps** (menu) | Accordion rows | One row per burger; opening a row reveals its real spec line and photo |
| 4 | **Gallery** | Staggered masonry | Uneven columns, mono captions, transform-only scroll parallax |
| 5 | **How it's built** | Numbered rail journey | Accent rail draws with scroll; four steps annotated with the sliced icon set |
| 6 | **What people say** | Giant-numeral stats | `7.5` set enormous against the three real Foursquare tips |
| 7 | **Order / Find us** | Colour-blocked diptych | Accent CTA block + info column; footer strip with logo and address |

## CTA inventory — one garment each, never a shared button

| Where | Label | Interaction identity |
|---|---|---|
| Hero | `ORDER NOW` | Notched-corner block (stamp corner cut) with an ink fill that sweeps from the left |
| Menu | `FULL MENU ON HUNGERSTATION` | Underline-draw text link with a mono kicker above |
| Process | — | No CTA. The section is a pause |
| Reviews | `READ ALL 29 TIPS` | Ticket-perforation edges; dotted rule animates on hover |
| Contact | `ORDER ON HUNGERSTATION` | Solid stamp-press block that physically depresses — `translateY(2px)` with the drop shadow collapsing |
| Footer | `OPEN IN GOOGLE MAPS` | Small mono link with a chevron that slides |

Every intent has exactly one label page-wide. "Order" always means HungerStation.

## Texture

A CSS film-grain overlay at ~5% opacity sits above the whole page. It is what
makes the AI-generated film, the generated plates and any real client photos
read as one piece of material rather than three sources.

## Motion rules

- Scroll-driven animation is **transform and clip-path only**. Never
  opacity-to-zero on scroll — text must survive with JS off.
- Lenis smooth scroll with `autoRaf: false`, driven by `gsap.ticker`, wired into
  `ScrollTrigger.update`.
- `prefers-reduced-motion` kills the pin entirely: static final frame, chapter 1
  text, no parallax, everything readable.
- Mobile shortens the hero scroll runway to ~70% and drops cursor-only effects.
