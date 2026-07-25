# Product

<!-- impeccable:product-schema 1 -->

> Provenance note: this record was captured from the approved design spec
> (`docs/superpowers/specs/2026-07-25-empirika-website-design.md`) and its
> brainstorming decisions in an unattended session — no live interview was
> possible. Facts marked *(inferred)* were derived from that spec rather than
> answered directly by the user; everything else is confirmed spec content.

## Platform

web

## Users

- **Primary:** people at companies who are researching Empirika — a prospect,
  partner, or client's stakeholder doing due diligence before or during a
  conversation. They arrive with the question "is this company real, capable,
  and serious?" and need institutional credibility fast.
- **Secondary:** companies evaluating **CarbonTrace** (carbon-credit buyers,
  sustainability/ESG teams) who land here to understand the product and who is
  behind it. *(inferred from the spec's requirement that CarbonTrace be
  presented as a product with its own CTA)*
- Both audiences read in Portuguese (PT-BR, default) or English; full content
  parity between the two languages is mandatory.

## Product Purpose

Institutional one-pager for **Empirika**, a software company from Recife-PE,
Brazil. The site exists to give the company a credible public presence: say
plainly what Empirika is (hybrid: custom software development + own products),
present CarbonTrace as its flagship product, and open a contact channel.
Success means a visitor understands the company and its competence within one
scroll, and reaches out via the form or direct e-mail.

## Positioning

Empirika is a hybrid software house: it builds custom software for clients
*and* ships its own products. CarbonTrace — a carbon-credit platform with
verification and traceability — is the living proof that the team can carry a
product from zero to market, not just execute briefs. The company is rooted in
Recife's tech scene (Porto Digital), and wears that origin with pride rather
than hiding behind a placeless corporate identity.

## Operating Context

- Single page with anchor navigation; scroll order is fixed by the spec:
  Hero → Quem somos → O que fazemos → CarbonTrace → Recife → Contato.
- Routes: `/` (PT-BR, default) and `/en/` (English), with a discreet language
  switch in the header. `hreflang` pairing between them.
- Contact: form (name, e-mail, company, message) submitted via Web3Forms (no
  own backend), with client-side validation and visible success/error states;
  a clickable `mailto:` e-mail and the company location remain permanently
  visible as fallback.
- Deploy target: Vercel as a static Astro build (account/domain still to be
  confirmed — documented as a later step).

## Capabilities and Constraints

- **Stack (binding):** Astro 5 (static output) · Tailwind CSS 4 · GSAP +
  ScrollTrigger. Copy centralized per language in `src/i18n/pt.json` /
  `en.json`; section components receive text via props; zero markup
  duplication between routes.
- **Progressive enhancement (hard rule):** all content is visible and legible
  with JavaScript disabled; the CSS base state of every element is visible and
  GSAP only enhances (never `opacity: 0` in base CSS waiting for JS).
  `prefers-reduced-motion` disables scroll animations entirely.
- **Animation constraints:** GSAP loaded once, animations registered per
  section via `data-` attributes; only `transform` and `opacity` are animated,
  never layout properties.
- **Out of scope (YAGNI, confirmed):** blog, careers page, client case
  studies, chatbot, CMS, logged-in area. Nothing in the design should
  pre-build for them.
- **Undecided product facts:** final domain and Vercel account; the real
  contact e-mail address and exact office location/address; final copy (the
  initial PT/EN copy is written during implementation and refined by the
  client afterwards).
- **Terminology:** "CarbonTrace" is the product name, always written in
  CamelCase. Section names in PT as listed above.

## Brand Commitments

- **Name:** Empirika. **Flagship product:** CarbonTrace.
- **Voice:** confident and direct, no corporate-speak ("sem corporativês"), in
  both languages.
- **Regional identity:** Recife pride expressed through copy and graphic
  details. **Literal regional clichés are banned** — no sun, no palm trees, no
  postcard tropicalia.
- **Visual reference (binding):** [cappen.com](https://cappen.com/pt/) — dark,
  bold, animated; giant display typography; scroll-driven drama. This is a
  bar for ambition and craft, not a template to copy.
- **CarbonTrace accent:** a vivid green belongs exclusively to the CarbonTrace
  section — a color "moment" inside the dark site. No other section may use it.
- **Motion:** movement must have narrative purpose (reveal, pacing) plus
  hover micro-interactions; no gratuitous decorative animation.
- No existing logo, wordmark, or visual identity: the identity is created from
  scratch for this site (recorded in DESIGN.md).

## Evidence on Hand

- None yet. There is **no logo file, no photography, no client list, no
  testimonials, no case studies, no metrics** in the repository. Future work
  must not fabricate customers, numbers, certifications, or press. If a
  section needs demonstration material, it must be clearly authored as
  illustrative — commercial and factual claims stay real or absent.
- Contact e-mail and street address are placeholders until the client
  provides them.

## Product Principles

1. **Credibility over spectacle.** The drama serves trust: every bold moment
   must leave the visitor more convinced the company is competent, never
   distracted from it.
2. **Prove the hybrid claim.** "Services + own product" is the position;
   CarbonTrace is the proof. The page structure must make that argument, not
   just state it.
3. **Content first, always working.** Semantic, readable, complete without
   JavaScript or animation; visual direction and motion are layers on top.
4. **Two languages, one site.** PT and EN are equals — full parity of content
   and quality, never a degraded translation.
5. **Recife in the voice, not in the postcard.** Regional identity lives in
   copy and graphic detail; clichés are a failure state.

## Accessibility & Inclusion

- WCAG AA contrast for all text on the dark ground (≥ 4.5:1 body text).
- Lighthouse targets (mobile): Performance ≥ 90, Accessibility ≥ 95.
- Semantic HTML, per-language meta description, Open Graph, favicon.
- `prefers-reduced-motion` fully respected; site 100% functional without JS.
- No horizontal scroll at 390 px, 768 px, and 1440 px.
