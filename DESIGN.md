<!-- SEED: established with the approved spec brief before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

---
name: Empirika Website
description: Dark, typography-led institutional one-pager for a Recife software company — ink, paper, and one green flood.
---

# Design System: Empirika Website

## Overview

**Creative North Star: "O Manifesto de Cais" (The Dockside Manifesto)**

The site is a manifesto posted on the dark wall of a port-city warehouse.
Recife is a harbor town — reef, docks, converted warehouses that now house
Porto Digital — and Pernambuco's graphic heritage is the woodcut: cordel
covers printed in dry black ink on warm paper, hard edges, no halftones.
This world fuses the two. Giant display typography is the site's primary
graphic element — headlines set at poster scale, like hull lettering and
stencil marks on cargo, doing the work that photography or illustration would
do elsewhere. The ground is a warm ink-black (umber, not neutral gray-black),
the text is cordel-paper off-white, and the surface carries a faint print
grain. There is exactly one moment of color: the CarbonTrace section floods
green — the navigation light in a dark harbor — and that green appears
nowhere else on the page.

This is deliberately **not** the default dark-tech look: no neutral
`#0a0a0a`, no glowing edges, no glassmorphism, no gradient meshes. Ink is
dry, edges are hard, depth is tonal. Recife enters through voice and detail —
coordinates, tide-line hairlines, stencil labels, manguebeat attitude — never
through sun or palm trees (banned).

**Motion grammar (narrative only):** movement exists to reveal and to pace
the scroll, in the material's own logic — headlines rise line-by-line as if
pulled from under the fold (masked line reveals), hairlines draw themselves
across like a tide line, the CarbonTrace green floods its section on entry,
numbers/labels tick in. Hover micro-interactions are ink-like (fill, invert,
underline draw), never glow or blur. Only `transform` and `opacity` animate.
Base CSS state is always visible; GSAP enhances. `prefers-reduced-motion`
removes all scroll choreography.

**Key Characteristics:**
- Typography IS the imagery: condensed poster-scale display lines, stacked tight.
- Warm monochrome world (umber-black ink + cordel paper) with one exclusive green flood.
- Woodcut material logic: dry ink, hard edges, coarse grain, no glow, no glass.
- Flat and tonal; depth by layered ink tones and hairlines, never shadows.
- Motion as narrative reveal and pacing; zero decorative animation.

## Colors

Warm monochrome ink-and-paper, with one vivid green owned entirely by
CarbonTrace. Strategy: **Restrained at page scale, Committed inside the
CarbonTrace section** (the green owns that whole region, not scattered
accents).

### Primary
- **Sinal Verde** (#3BE377): the CarbonTrace green — a vivid signal green,
  like a starboard navigation light. Used ONLY inside the CarbonTrace
  section: its display type, CTA, data details, and keylines. 11.2:1 on
  Breu, 9.7:1 on Mangue Escuro — safe for text at any size.
- **Mangue Escuro** (#0C2415): deep green-black ground that the CarbonTrace
  section floods to, replacing Breu edge-to-edge within that region. Also
  CarbonTrace-exclusive.

### Neutral
- **Breu** (#14100B): the page ground — warm umber ink-black (burnt wood,
  mangrove sediment), not neutral gray. Maps to token `--color-ink`.
- **Papel de Cordel** (#F2ECE0): primary text and reversed grounds — warm
  paper off-white, never pure #fff. 16.1:1 on Breu. Maps to `--color-paper`.
- **Cinza Maré** (#A9A296): secondary text, captions, meta labels. 7.5:1 on
  Breu (clears AA with margin). Maps to `--color-muted`.
- **Breu Alto** (#1E1913): raised surface tone for tonal layering (cards,
  form fields) — one step lighter than Breu, same warmth.
- **Linha d'Água** (#332C22): hairlines, borders, dividers (non-text).

`--color-carbon` maps to Sinal Verde (#3BE377).

### Named Rules
**The One Green Rule.** #3BE377 and #0C2415 exist only inside the CarbonTrace
section. If green appears in the hero, nav, footer, or any other section, the
system is broken. The exclusivity is the drama.

**The Warm Ink Rule.** Every dark value is warm (umber/olive cast). Neutral
or cool grays (#111, #888, slate, zinc) are foreign material — do not
introduce them.

## Typography

**Display Font:** Big Shoulders (variable, `@fontsource-variable/big-shoulders`; fallback: `'Arial Narrow', 'Helvetica Neue', sans-serif`)
**Body Font:** Schibsted Grotesk (variable, `@fontsource-variable/schibsted-grotesk`; fallback: `system-ui, 'Helvetica Neue', sans-serif`)

**Character:** Big Shoulders is a condensed industrial poster grotesque —
tall, hard-shouldered, built for stacked capitals at enormous sizes, and its
narrowness is what lets long Portuguese words ("desenvolvimento sob medida")
stay huge on a 390 px screen. Schibsted Grotesk is a sharp-cut newspaper
grotesque for running text: plainspoken and confident, matching the
no-corporate-speak voice. `--font-display` → Big Shoulders,
`--font-body` → Schibsted Grotesk. No third face; no mono.

### Hierarchy
- **Display** (Big Shoulders 800, `clamp(4rem, 13vw, 12.5rem)`, line-height
  0.88, uppercase, letter-spacing 0.01em): hero statement and section-opening
  proclamations. The page's graphic element — set in stacked lines, edge to
  edge.
- **Headline** (Big Shoulders 700, `clamp(2.25rem, 6vw, 4.5rem)`, line-height
  0.95, uppercase): section titles inside the flow.
- **Title** (Schibsted Grotesk 700, `1.25rem`–`1.5rem`, line-height 1.2):
  service item names, form legend, card titles.
- **Body** (Schibsted Grotesk 400, `1.0625rem`–`1.125rem`, line-height 1.6,
  max-width 65ch): paragraphs. Papel de Cordel on Breu.
- **Label** (Schibsted Grotesk 500, `0.8125rem`, letter-spacing 0.14em,
  uppercase, usually Cinza Maré): stencil-style meta labels — section
  numbers, nav items, coordinates, form labels. This is where the cargo-mark
  detail lives (e.g. "02 — O QUE FAZEMOS", "8°03′S · 34°52′W").

### Named Rules
**The Poster Rule.** Display type is a graphic object: uppercase, line-height
below 1.0, cropped tight to the layout edges. If a display line fits
comfortably with room to spare, it is set too small.

## Layout

Full-bleed vertical scroll with a single fluid gutter:
`padding-inline: clamp(1.25rem, 4vw, 4.5rem)`; content max-width 1440 px,
except display type and section floods, which may run edge to edge. Body
paragraphs sit on a 12-column mental grid, usually offset (starting at
column 2–3, never centered symmetrically) — the asymmetry of a posted bill,
not a brochure.

Spacing rhythm on an 8 px base. Section vertical padding
`clamp(6rem, 16vh, 11rem)`; the page breathes in big blocks. Within a
section: more space above a heading than below it (e.g. 96/32). Density
alternates deliberately — a poster-dense passage (Hero, CarbonTrace) earns a
quiet one (Quem somos, Recife). Labels and hairlines mark section starts like
registration marks: number + rule + label.

Breakpoints: single column below 768 px (display type still huge via the
clamp scale); the 12-column offsets engage from 1024 px. No horizontal
scroll at 390/768/1440 px, ever.

## Elevation & Depth

Flat, tonal, printed. **No box-shadows, no glows, no blur, no glass.** Depth
comes from three devices: tonal layering (Breu → Breu Alto #1E1913 for raised
fields/cards), 1 px hairlines in Linha d'Água (#332C22), and print grain — an
SVG `feTurbulence` noise layer over the ground at 3–4% opacity (fixed,
non-animated, pointer-events none) that gives the black its paper tooth.

**The Dry Ink Rule.** If an element needs to come forward, lighten its ground
one ink step or draw a hairline around it. A drop shadow or glow anywhere is
a system violation.

## Shapes

Radius 0. Everything is hard-edged: buttons, inputs, cards, image frames —
cut like woodblock, not rounded like an app. Borders are 1 px solid (Linha
d'Água on dark grounds; Papel de Cordel for emphasis outlines, e.g. a ghost
button). The recurring silhouette is the **rule-and-label**: a thin
horizontal hairline with a small uppercase label sitting on it, used as
section registration marks and as the tide-line motif. Underlines (2 px,
drawn on hover) are the link affordance. `--radius` tokens, if ever added,
stay at 0 — rounding is foreign to this world.

## Do's and Don'ts

### Do:
- **Do** keep #3BE377 / #0C2415 locked to the CarbonTrace section, and let
  that section flood — full-bleed Mangue Escuro ground, green display type —
  so the color reads as an event, not an accent.
- **Do** set display type at the clamp scale defined above, uppercase, with
  line-height ≤ 0.95 and hard alignment to the gutter; let headlines be the
  image.
- **Do** express Recife through Label-layer details (coordinates, "Porto
  Digital", tide-line hairlines, manguebeat-inflected copy) and through
  voice.
- **Do** keep every animated element visible in base CSS; animate only
  `transform`/`opacity`; honor `prefers-reduced-motion` by disabling scroll
  choreography.
- **Do** verify text contrast against Breu (#14100B): body text ≥ 4.5:1
  (Papel 16.1:1, Cinza Maré 7.5:1, Sinal Verde 11.2:1 all pass).

### Don't:
- **Don't** use sun, palm trees, beach, or postcard-tropical imagery in any
  form — banned by brand commitment.
- **Don't** introduce cool/neutral grays, pure white (#fff), pure black
  (#000), a third typeface, or any color outside the palette above.
- **Don't** use border-radius, box-shadows, glows, glassmorphism, or gradient
  meshes — depth is tonal and edges are hard.
- **Don't** animate decoratively: no floating blobs, no parallax without
  narrative purpose, no scattered hover gimmicks.
- **Don't** center-and-shrink the display type into a conventional hero card;
  the poster scale and asymmetry are the identity.
