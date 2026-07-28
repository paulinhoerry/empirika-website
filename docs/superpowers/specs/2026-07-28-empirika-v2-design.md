# Empirika Website v2 — Design Spec

**Date:** 2026-07-28
**Branch:** `new` (tree cleared intentionally; v1 lives on `main`)
**Status:** Approved by Paulo (approach A, PT at root)

## Goal

New marketing site for Empirika, a Recife software house (process automation,
software development, websites, data dashboards). Audience: startup founders,
designers, mid-size companies — mature/enterprise tone. Bilingual PT/EN.
Style: dark editorial like Code and Theory (reference image) — black background,
oversized white grotesk headlines with gray second lines, monospace uppercase
labels, 1px hairline dividers, generous negative space. References:
codeandtheory.com, excited.agency, fantasy.co.

## Approach (chosen: A)

Single cinematic one-page site. Scroll-world hero (scroll-scrubbed video
journey) at the top; sections flow below with GSAP ScrollTrigger parallax.
Rejected: multi-page enterprise layout (breaks scroll narrative, ~2x work,
no clear gain).

## Stack

- **Astro 5** + **Tailwind 4** + **GSAP ScrollTrigger** (same stack as v1,
  proven in this repo).
- **scroll-world** skill (github.com/oso95/scroll-world) drives the hero:
  Higgsfield-generated isometric world, 1080p, no audio, scrubbed by scroll
  via its framework-agnostic `scrub-engine.js`.
- **Resend** for the contact form via an Astro server endpoint
  (`output: 'static'` + on-demand API route with the Vercel adapter).
  API key via `RESEND_API_KEY` env var — never committed.
- **impeccable** skill (restored from `main`'s `.agents/skills/impeccable`)
  for layout/typography refinement passes.
- i18n: JSON dictionaries; **PT at `/`**, **EN at `/en`**. Language switcher
  in header and footer. `hreflang` alternates in `<head>`.

## Sections (all copy written new, PT + EN)

1. **Hero** — scroll-world journey. Scene chain (proposal, tuned during
   generation): office/code → automation flows → data dashboard → Recife port.
   Overlaid headline in Code-and-Theory style (white line + gray line).
   1080p landscape master; mobile fallback per scroll-world pipeline (portrait
   canvases or crop encodes).
2. **Capabilities** — numbered editorial rows for the four offerings:
   process automation, software development, websites, data dashboards.
   Ink hover + subtle parallax.
3. **Approach** — short manifesto for founders/mid-size companies: how we
   work, seniority, delivery, code ownership.
4. **HQ Recife** — local presence block with full address.
5. **Contact** — form (name, email, company, message) posting to the Resend
   endpoint; visible mailto link as fallback. Client-side validation +
   honeypot; success/error states in both languages.
6. **Footer** — CNPJ 66.436.862/0001-70; Avenida Rio Branco 139, Recife PE,
   50030-310; language switcher; social links.

## Animation system

- Hero: scroll-scrub of the generated video (scroll-world engine, canvas
  frame-scrub with preloaded frames).
- Below the hero: GSAP ScrollTrigger — parallax offsets on section media/
  watermarks, reveal-on-scroll for headlines and rows, pinned moments only
  where they aid the narrative.
- `prefers-reduced-motion`: video shows a static poster frame; reveals become
  simple fades; no scroll hijacking anywhere (native scroll only).

## Error handling

- Contact endpoint: validates payload server-side, returns JSON status;
  form shows localized success/failure; Resend failures logged, user gets
  retry message with mailto fallback.
- Hero: if video/frames fail to load, hero falls back to poster image +
  headline (site remains fully usable).

## Testing / verification

- `astro build` clean; Playwright smoke pass over both locales (sections
  render, form validates, language switch works).
- Manual scroll QA at 1440/768/390 widths; reduced-motion check.
- Contact form tested against Resend test mode before deploy.

## Out of scope (YAGNI)

- CMS, blog, case-study pages, analytics, cookie banner (no tracking),
  dark/light toggle (site is dark by design).

## Dependencies / prerequisites

- Higgsfield CLI installed (`@higgsfield/cli` via npm) — **auth pending:
  Paulo must run `higgsfield auth login`** and have credits (~N image gens +
  2N−1 video gens for N scenes; N≈4 planned).
- ffmpeg/ffprobe installed (done, via Homebrew).
