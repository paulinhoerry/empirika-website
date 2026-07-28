# Empirika Scroll-Cinema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o one-pager da Empirika em uma experiência scroll-cinema: duas cenas pinadas com scrub (Hero e CarbonTrace) + repaginação das demais seções com sistema de numerais estêncil, manifesto de carga e marca d'água — GSAP ScrollTrigger puro, sem dependências novas.

**Architecture:** Layout estático por seção em `src/components/*.astro` (Astro), toda animação centralizada em `src/scripts/animations.ts` via contratos de `data-*` attributes. Dois blocos `gsap.matchMedia`: scrubs não-pinados em `(prefers-reduced-motion: no-preference)` (todos os tamanhos) e cenas pinadas em `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`. Sem JS / reduced-motion / mobile, cada seção renderiza completa e estática.

**Tech Stack:** Astro 5, Tailwind 4 (`@theme` tokens em `src/styles/global.css`), GSAP 3 + ScrollTrigger (já instalados).

**Spec:** `docs/superpowers/specs/2026-07-27-empirika-scroll-cinema-design.md`

## Global Constraints

- Só `transform` e `opacity` animam. O flood verde é um painel transladado (`translateY`), nunca `background-color`/`clip-path` animado.
- Nenhum conteúdo escondido por CSS estático. GSAP `from`/`fromTo` apenas; sem JS a página é a versão estática completa. Única exceção: o painel `data-tide-cover` (overlay decorativo que SÓ existe para a cena JS) nasce `opacity-0` e é ativado por `gsap.set(..., { autoAlpha: 1 })` dentro do matchMedia desktop.
- One Green Rule: `#3BE377` (carbon) e `#0C2415` (carbon-deep) existem apenas dentro da seção CarbonTrace.
- Elementos controlados por GSAP não podem ter classes de transform do Tailwind (`translate-*`, `-translate-*`, `scale-*`) — GSAP sobrescreve o transform inteiro. Posicionar só com `top/right/left/bottom`.
- Numerais estêncil e marca d'água são decorativos: `aria-hidden="true"` + `pointer-events-none`, tom-sobre-tom (`text-raised` sobre Breu; `text-carbon/10` dentro do CarbonTrace).
- Seções com elementos que sangram/derivam recebem `overflow-clip` no `<section>` — nunca pode haver scroll horizontal na página (390/768/1440).
- Contraste AA: texto `text-muted` (#A9A296) sobre `raised` (#1E1913) = 6.5:1 (pior caso da marca d'água) — OK; nenhum par novo pode ficar abaixo de 4.5:1.
- Paridade PT/EN garantida por `Dictionary = typeof pt` — toda mudança de estrutura em `pt.json` se repete em `en.json`.
- Mecânica do formulário de contato intocada: ids `cf-*`, names, `aria-describedby`, `#form-status`, `data-msg-*`, `contact-form.ts`.
- Commits em inglês com prefixos `feat:`/`fix:`/`docs:`.
- Verificação por task: `npm run build` verde + `npx tsc --noEmit` limpo. Screenshots em passes em lote (não por tweak) — pass completo na Task 9.
- Header e Footer não mudam.

## File Structure

- `src/styles/global.css` — ganha `@utility type-numeral` (Task 1) e `@utility type-poster` (Task 4).
- `src/i18n/pt.json` / `en.json` — `about.lead` (Task 1), `contact.emailLabel`/`contact.locationLabel` (Task 4). `src/i18n/index.ts` não muda.
- `src/components/About.astro` (Task 1), `Services.astro` (Task 2), `Recife.astro` (Task 3), `Contact.astro` (Task 4), `CarbonTrace.astro` (Task 5), `Hero.astro` (Task 7) — layout estático + anchors `data-*`.
- `src/scripts/animations.ts` — reescrito na Task 6 (scrubs não-pinados), cenas adicionadas nas Tasks 7–8.

### Contrato de data-attributes (produzido pelas Tasks 1–5/7, consumido pelas 6–8)

| Attribute | Onde | Animação |
|---|---|---|
| `data-numeral` | numeral estêncil, filho direto do `<section>` | parallax `y: 60 → -60` scrubbed |
| `data-draw-line` | spans de hairline (h-px) | `scaleX: 0 → 1` scrubbed, origin left |
| `data-watermark` | palavra RECIFE | parallax `y: 90 → -90` scrubbed |
| `data-manifest-row` | `<li>` de serviço | from `y: 32, opacity: 0`, once |
| `data-reveal` | elemento solo (heading do Services) | from `y: 28, opacity: 0`, once |
| `data-animate="reveal"` + `data-animate-children` | About, Recife, Contact (contrato existente) | stagger dos filhos do wrapper, once |
| `data-animate="hero"` / `data-animate-line` / `data-animate-item` | Hero (existente) | entrada no load + cena pinada |
| `data-hero-line` / `data-hero-coords` | linha de maré e coordenadas do Hero | scrubbed dentro da cena pinada |
| `data-tide-cover` / `data-ct-heading` / `data-ct-item` | CarbonTrace | cena pinada "maré sobe" |

---

### Task 1: About — sentença-manifesto, numeral 01 e utility `type-numeral`

**Files:**
- Modify: `src/styles/global.css` (nova utility após `type-label`, ~linha 54)
- Modify: `src/i18n/pt.json` (bloco `about`)
- Modify: `src/i18n/en.json` (bloco `about`)
- Modify: `src/components/About.astro` (arquivo inteiro)

**Interfaces:**
- Produces: `@utility type-numeral` (usada pelas Tasks 2–5); estrutura i18n `about: { heading, lead, paragraphs }`; anchors `data-numeral` e `data-draw-line` (consumidos pela Task 6).

- [ ] **Step 1: Adicionar a utility `type-numeral` em `src/styles/global.css`** (logo após o bloco `@utility type-label`):

```css
/* Numeral role: giant tone-on-tone stencil numbering — the page's spine.
   Color is set per-usage (text-raised on Breu; text-carbon/10 in CarbonTrace). */
@utility type-numeral {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(8rem, 22vw, 22rem);
  line-height: 0.8;
  letter-spacing: 0.01em;
  user-select: none;
}
```

- [ ] **Step 2: Reestruturar o bloco `about` em `src/i18n/pt.json`** (primeira frase promovida a `lead`):

```json
"about": {
  "heading": "Quem somos",
  "lead": "A Empirika nasceu no Recife, entre o mangue e o Porto Digital.",
  "paragraphs": [
    "Somos uma empresa de software que gosta de duas coisas: resolver problemas difíceis e ver código virar negócio.",
    "Trabalhamos em dois modos. No primeiro, construímos software sob medida para empresas que precisam de tecnologia bem feita. No segundo, criamos produtos próprios — como o CarbonTrace.",
    "Sem corporativês, sem promessa vazia. A gente prefere entregar."
  ]
}
```

- [ ] **Step 3: Mesma reestruturação em `src/i18n/en.json`:**

```json
"about": {
  "heading": "About us",
  "lead": "Empirika was born in Recife, between the mangroves and Porto Digital.",
  "paragraphs": [
    "We are a software company that loves two things: solving hard problems and watching code become business.",
    "We work in two modes. In the first, we build custom software for companies that need technology done right. In the second, we create our own products — like CarbonTrace.",
    "No corporate jargon, no empty promises. We'd rather deliver."
  ]
}
```

- [ ] **Step 4: Substituir `src/components/About.astro` inteiro por:**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['about']; }
const { t } = Astro.props;
---
<section id="about" class="relative overflow-clip px-gutter py-section" data-animate="reveal">
  <span class="type-numeral absolute top-[-0.05em] right-[-0.08em] text-raised pointer-events-none" aria-hidden="true" data-numeral>01</span>
  <div class="relative mx-auto max-w-[1440px]" data-animate-children>
    <div class="mb-10 h-px bg-line origin-left" aria-hidden="true" data-draw-line></div>
    <h2 class="type-label text-muted mb-8">{t.heading}</h2>
    <p class="type-headline max-w-[24ch] mb-14">{t.lead}</p>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div class="lg:col-start-5 lg:col-span-8 md:columns-2 md:gap-x-12">
        {t.paragraphs.map((p) => <p class="mb-5 text-lg leading-relaxed break-inside-avoid">{p}</p>)}
      </div>
    </div>
  </div>
</section>
```

Notas: o `h2` continua sendo o heading semântico da seção (agora em estilo label — hierarquia visual invertida é intencional; níveis de heading não dependem de tamanho). O numeral fica FORA do wrapper `data-animate-children` (não participa do stagger de reveal). `break-inside-avoid` impede parágrafo cortado entre colunas.

- [ ] **Step 5: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: build verde (2 páginas), tsc sem erros. Se `tsc` acusar `lead` faltando em `en.json`, o Step 3 ficou incompleto.

- [ ] **Step 6: Screenshot único de sanidade (desktop)**

Suba `npm run dev` (porta 4321), tire um screenshot de `http://localhost:4321/#about` a 1440×900 (Playwright MCP ou `npx playwright screenshot --viewport-size=1440,900 http://localhost:4321/#about /tmp/about.png`). Verifique: numeral 01 gigante tom-sobre-tom cortado na borda direita, lead em headline, parágrafos em 2 colunas, sem scroll horizontal. Derrube o dev server ao final (`lsof -ti:4321 | xargs kill`).

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/i18n/pt.json src/i18n/en.json src/components/About.astro
git commit -m "feat: repage About with manifesto lead and stencil numeral system"
```

---

### Task 2: Services — manifesto de carga

**Files:**
- Modify: `src/components/Services.astro` (arquivo inteiro)

**Interfaces:**
- Consumes: `@utility type-numeral` (Task 1).
- Produces: anchors `data-manifest-row`, `data-reveal`, `data-draw-line`, `data-numeral` (consumidos pela Task 6).

- [ ] **Step 1: Substituir `src/components/Services.astro` inteiro por:**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['services']; }
const { t } = Astro.props;
---
<section id="services" class="relative overflow-clip px-gutter py-section">
  <span class="type-numeral absolute top-[-0.05em] right-[-0.08em] text-raised pointer-events-none" aria-hidden="true" data-numeral>02</span>
  <div class="relative mx-auto max-w-[1440px]">
    <h2 class="type-headline mb-14" data-reveal>{t.heading}</h2>
    <ul>
      {t.items.map((item) => (
        <li data-manifest-row>
          <span class="block h-px bg-line origin-left" aria-hidden="true" data-draw-line></span>
          <div class="group grid md:grid-cols-12 md:gap-x-8 py-8 md:py-10 -mx-4 px-4 transition-colors duration-200 hover:bg-paper hover:text-ink">
            <h3 class="md:col-span-5 font-display text-2xl md:text-4xl font-bold uppercase leading-none">{item.title}</h3>
            <p class="md:col-start-7 md:col-span-6 mt-3 md:mt-0 max-w-[55ch] text-lg leading-relaxed text-muted transition-colors duration-200 group-hover:text-ink/75">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
    <span class="block h-px bg-line origin-left" aria-hidden="true" data-draw-line></span>
  </div>
</section>
```

Notas: sai o grid 2×2, entra linha full-width por serviço (título condensado à esquerda via `font-display`, descrição à direita). Hover inverte a linha em tinta (papel sobre breu → breu sobre papel) — micro-interação ink-like permitida pelo DESIGN.md; a transição de cor é hover CSS, não animação de scroll. O span final fecha o manifesto com uma última hairline. A seção NÃO usa `data-animate="reveal"` (as linhas animam individualmente; o heading usa `data-reveal` solo).

- [ ] **Step 2: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 3: Screenshot único de sanidade (desktop + hover)**

Com `npm run dev`, screenshot de `http://localhost:4321/#services` a 1440×900. Verifique: 4 linhas full-width com hairlines, numeral 02, hover invertendo uma linha (passe o mouse via Playwright MCP `browser_hover` na primeira linha e capture). Contraste do hover: título `text-ink` sobre `bg-paper` (16.1:1) e descrição `text-ink/75` sobre paper — ambos AA. Derrube o dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services.astro
git commit -m "feat: repage Services as cargo-manifest rows with ink hover"
```

---

### Task 3: Recife — marca d'água de xilogravura

**Files:**
- Modify: `src/components/Recife.astro` (arquivo inteiro)

**Interfaces:**
- Consumes: `@utility type-numeral` (Task 1).
- Produces: anchor `data-watermark` (consumido pela Task 6); `data-numeral`, `data-draw-line`.

- [ ] **Step 1: Substituir `src/components/Recife.astro` inteiro por:**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['recife']; }
const { t } = Astro.props;
---
<section id="recife" class="relative overflow-clip px-gutter py-section" data-animate="reveal">
  <span class="type-numeral absolute top-[-0.05em] right-[-0.08em] text-raised pointer-events-none" aria-hidden="true" data-numeral>04</span>
  <div class="relative mx-auto max-w-[1440px]">
    <span class="type-display absolute top-4 left-[-0.03em] text-raised pointer-events-none select-none whitespace-nowrap" aria-hidden="true" data-watermark>RECIFE</span>
    <div class="relative" data-animate-children>
      <div class="flex items-center gap-5 mb-10" aria-hidden="true">
        <span class="h-px flex-1 bg-line origin-left" data-draw-line></span>
        <span class="type-label text-muted">Porto Digital · 8°03′S · 34°52′W</span>
      </div>
      <h2 class="type-headline mb-10">{t.heading}</h2>
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div class="lg:col-start-4 lg:col-span-7 max-w-[65ch]">
          {t.paragraphs.map((p) => <p class="mb-5 text-lg leading-relaxed">{p}</p>)}
        </div>
      </div>
    </div>
  </div>
</section>
```

Notas: a palavra RECIFE é a mesma nos dois idiomas (decorativa, `aria-hidden`) — hardcoded, não vai para o i18n. Ela fica atrás do conteúdo (`data-animate-children` é `relative`, empilha por ordem de DOM). NENHUMA classe `translate-*` no watermark/numeral — o parallax GSAP controla o transform inteiro. Pior caso de contraste: `text-muted` sobre a marca d'água `#1E1913` = 6.5:1 (AA ok).

- [ ] **Step 2: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 3: Screenshot único de sanidade (desktop + 390)**

Com `npm run dev`, screenshots de `http://localhost:4321/#recife` a 1440×900 e 390×844. Verifique: RECIFE tom-sobre-tom atrás do texto, legível por cima; numeral 04; sem h-scroll em 390 (o `overflow-clip` da section deve segurar o `whitespace-nowrap`). Derrube o dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Recife.astro
git commit -m "feat: repage Recife with woodcut watermark and port meta line"
```

---

### Task 4: Contact — heading cartaz e bloco estêncil

**Files:**
- Modify: `src/styles/global.css` (nova utility após `type-numeral`)
- Modify: `src/i18n/pt.json` (bloco `contact`: duas chaves novas)
- Modify: `src/i18n/en.json` (idem)
- Modify: `src/components/Contact.astro` (apenas o bloco info, linhas ~14–21; o `<form>` NÃO muda)

**Interfaces:**
- Consumes: `@utility type-numeral` (Task 1).
- Produces: `@utility type-poster`; chaves `contact.emailLabel`, `contact.locationLabel`.

- [ ] **Step 1: Adicionar a utility `type-poster` em `src/styles/global.css`** (após `type-numeral`):

```css
/* Poster role: the closing call — bigger than headline, smaller than display */
@utility type-poster {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.75rem, 7vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
```

- [ ] **Step 2: Adicionar chaves no bloco `contact` de `src/i18n/pt.json`** (depois de `"subtitle"`):

```json
"emailLabel": "E-mail",
"locationLabel": "Onde estamos",
```

- [ ] **Step 3: Idem em `src/i18n/en.json`:**

```json
"emailLabel": "Email",
"locationLabel": "Where we are",
```

- [ ] **Step 4: Em `src/components/Contact.astro`,** trocar a abertura da section e o bloco de info (o `<form>` e o `<script>` ficam byte-idênticos). A section passa a abrir assim:

```astro
<section id="contact" class="relative overflow-clip px-gutter py-section" data-animate="reveal">
  <span class="type-numeral absolute top-[-0.05em] right-[-0.08em] text-raised pointer-events-none" aria-hidden="true" data-numeral>05</span>
  <div class="relative mx-auto max-w-[1440px]">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8" data-animate-children>
      <div class="lg:col-span-5">
        <h2 class="type-poster mb-6">{t.heading}</h2>
        <p class="text-lg leading-relaxed text-muted mb-12 max-w-[40ch]">{t.subtitle}</p>
        <div class="border-t border-line pt-6 mb-8">
          <p class="type-label text-muted mb-2">{t.emailLabel}</p>
          <a href={`mailto:${t.email}`} class="text-lg underline decoration-1 underline-offset-4 hover:text-muted transition-colors">{t.email}</a>
        </div>
        <div class="border-t border-line pt-6">
          <p class="type-label text-muted mb-2">{t.locationLabel}</p>
          <p class="text-lg text-muted leading-relaxed">{t.location}</p>
        </div>
      </div>
```

O antigo cabeçalho `05` + hairline (linhas 9–12 atuais) é removido — o numeral gigante o substitui. O `data-animate-children` desce para o div do grid (filhos = coluna de info + form → stagger de 2). Tudo do `<form ...>` em diante permanece intacto (confira com `git diff`: nenhuma linha do form pode aparecer no diff).

- [ ] **Step 5: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 6: Verificar que o form não mudou**

Run: `git diff src/components/Contact.astro | grep -E '^[+-].*(cf-|form-status|access_key|botcheck|web3forms)' || echo "FORM INTACTO"`
Expected: `FORM INTACTO`.

- [ ] **Step 7: Screenshot único de sanidade (desktop)**

Com `npm run dev`, screenshot de `http://localhost:4321/#contact` a 1440×900: heading em escala cartaz, bloco estêncil de e-mail/local com hairlines, numeral 05, form ao lado. Derrube o dev server.

- [ ] **Step 8: Commit**

```bash
git add src/styles/global.css src/i18n/pt.json src/i18n/en.json src/components/Contact.astro
git commit -m "feat: repage Contact with poster heading and stencil info block"
```

---

### Task 5: CarbonTrace — markup da cena (paridade estática)

**Files:**
- Modify: `src/components/CarbonTrace.astro` (arquivo inteiro)

**Interfaces:**
- Consumes: `@utility type-numeral` (Task 1).
- Produces: anchors `data-tide-cover`, `data-ct-heading`, `data-ct-item` (consumidos pela Task 8); `data-numeral`.

- [ ] **Step 1: Substituir `src/components/CarbonTrace.astro` inteiro por:**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['carbontrace']; }
const { t } = Astro.props;
---
<section id="carbontrace" class="relative overflow-clip bg-carbon-deep px-gutter py-section">
  <div class="absolute inset-0 bg-ink opacity-0 pointer-events-none" aria-hidden="true" data-tide-cover></div>
  <span class="type-numeral absolute top-[-0.05em] right-[-0.08em] text-carbon/10 pointer-events-none" aria-hidden="true" data-numeral>03</span>
  <div class="relative mx-auto max-w-[1440px]">
    <div class="flex items-center gap-5 mb-10" data-ct-item>
      <span class="h-px flex-1 bg-carbon/30" aria-hidden="true"></span>
      <p class="type-label text-carbon">{t.kicker}</p>
    </div>
    <div class="overflow-clip">
      <h2 class="type-display text-carbon -ml-[0.04em]" data-ct-heading>{t.heading}</h2>
    </div>
    <p class="mt-8 max-w-[28ch] text-2xl md:text-3xl font-bold leading-tight" data-ct-item>{t.tagline}</p>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8 mt-10">
      <div class="lg:col-start-4 lg:col-span-7 max-w-[65ch]">
        {t.paragraphs.map((p) => <p class="mb-5 text-lg leading-relaxed text-paper/80" data-ct-item>{p}</p>)}
        <a href="#contact" class="type-label mt-5 inline-block border border-carbon text-carbon px-8 py-4 hover:bg-carbon hover:text-carbon-deep transition-colors" data-ct-item>{t.cta}</a>
      </div>
    </div>
  </div>
</section>
```

Notas: `data-tide-cover` é o painel Breu que a cena desliza para cima (nasce `opacity-0` — é a exceção documentada nos Global Constraints: overlay que só existe para a cena JS). O wrapper `overflow-clip` no `h2` é a máscara do line-reveal. `data-animate="reveal"`/`data-animate-children` saem desta seção (a cena é dona da coreografia; em mobile a seção é estática). O label pequeno `03` sai — o numeral gigante `text-carbon/10` o substitui (verde permanece confinado à seção). Sem JS, a seção renderiza exatamente como hoje: fundo Mangue Escuro, tudo visível.

- [ ] **Step 2: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 3: Paridade estática (screenshot)**

Com `npm run dev`, screenshot de `http://localhost:4321/#carbontrace` a 1440×900: deve estar visualmente igual a antes desta task, exceto o numeral 03 novo e o label pequeno removido (o cover é invisível). Derrube o dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/CarbonTrace.astro
git commit -m "feat: prepare CarbonTrace markup for the tide scene"
```

---

### Task 6: animations.ts — scrubs não-pinados (reescrita)

**Files:**
- Modify: `src/scripts/animations.ts` (arquivo inteiro)

**Interfaces:**
- Consumes: todos os `data-*` das Tasks 1–5 (tabela no File Structure).
- Produces: o arquivo final desta task; as Tasks 7–8 ADICIONAM um bloco `mm.add(SCENES, ...)` sem alterar o bloco `mm.add(MOTION_OK, ...)`.

- [ ] **Step 1: Substituir `src/scripts/animations.ts` inteiro por:**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

// ——— All viewports: load entrance + non-pinned scroll scrubs ———
mm.add(MOTION_OK, () => {
  // Hero: the one authored focal entrance on load (unchanged from v1).
  gsap.from('[data-animate="hero"] [data-animate-line]', {
    yPercent: 60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
  });
  gsap.from('[data-animate="hero"] [data-animate-item]', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    delay: 0.5,
    stagger: 0.1,
  });

  // Tide hairlines draw themselves as the scroll passes them.
  document.querySelectorAll<HTMLElement>('[data-draw-line]').forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: 'left center',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: true },
    });
  });

  // Stencil numerals drift slower than the content around them.
  document.querySelectorAll<HTMLElement>('[data-numeral]').forEach((el) => {
    const section = el.closest('section') ?? el;
    gsap.fromTo(
      el,
      { y: 60 },
      {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Recife woodcut watermark: an even slower layer behind the copy.
  document.querySelectorAll<HTMLElement>('[data-watermark]').forEach((el) => {
    const section = el.closest('section') ?? el;
    gsap.fromTo(
      el,
      { y: 90 },
      {
        y: -90,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Cargo-manifest rows arrive one by one as they enter.
  document.querySelectorAll<HTMLElement>('[data-manifest-row]').forEach((row) => {
    gsap.from(row, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: row, start: 'top 85%', once: true },
    });
  });

  // Solo reveals: standalone elements outside a grouped wrapper.
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // Grouped section reveals (existing contract: data-animate-children wrapper).
  document.querySelectorAll<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
    const target = el.querySelector<HTMLElement>('[data-animate-children]') ?? el;
    gsap.from(target.children, {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });
  });
});

// Variable fonts settle late; re-measure trigger/pin distances once ready.
document.fonts.ready.then(() => ScrollTrigger.refresh());
```

- [ ] **Step 2: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 3: Verificação de scroll (bounded, uma passada)**

Com `npm run dev` e Playwright MCP: navegue `http://localhost:4321/`, role até o fim da página em ~4 paradas capturando screenshot em cada (hairlines desenhando, numerais em parallax, linhas do manifesto entrando, RECIFE deslizando atrás do texto). Confirme zero erros no console. Derrube o dev server.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/animations.ts
git commit -m "feat: rewire animations with scroll-scrubbed draws, parallax and manifest rows"
```

---

### Task 7: Cena Hero — "O cartaz no muro"

**Files:**
- Modify: `src/components/Hero.astro` (section class + dois spans do rodapé)
- Modify: `src/scripts/animations.ts` (adicionar bloco de cenas ao final, antes do `document.fonts.ready`)

**Interfaces:**
- Consumes: `data-animate="hero"`, `data-animate-line`, `data-animate-item` (existentes).
- Produces: `data-hero-line`, `data-hero-coords`; a constante `SCENES` e o bloco `mm.add(SCENES, ...)` que a Task 8 estende.

- [ ] **Step 1: Em `src/components/Hero.astro`,** fazer exatamente três mudanças:
  1. Na linha 6, a class da section ganha `overflow-clip`:

```astro
<section class="relative overflow-clip min-h-svh flex flex-col justify-center px-gutter pt-28 pb-24" data-animate="hero">
```

  2. Na linha 16, a hairline ganha `origin-left` e `data-hero-line`:

```astro
    <span class="h-px flex-1 bg-line origin-left" data-hero-line></span>
```

  3. Na linha 17, as coordenadas ganham `data-hero-coords`:

```astro
    <span class="type-label text-muted" data-hero-coords>8°03′S · 34°52′W</span>
```

- [ ] **Step 2: Em `src/scripts/animations.ts`,** adicionar após o fechamento do `mm.add(MOTION_OK, ...)` (e antes de `document.fonts.ready...`):

```ts
// ——— Desktop-only pinned scenes ———
const SCENES = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

mm.add(SCENES, () => {
  // Cena Hero — "O cartaz no muro": the hero pins and scroll drives the scene.
  // Title lines drift sideways like hull lettering passing the dock, the tide
  // line draws itself, and at the end the sheet is torn off the wall upward.
  const hero = document.querySelector<HTMLElement>('[data-animate="hero"]');
  if (hero) {
    const lines = gsap.utils.toArray<HTMLElement>('[data-animate-line]', hero);
    const drift = [-7, 9, -5];
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=180%', pin: true, scrub: true },
    });
    lines.forEach((line, i) => {
      tl.to(line, { xPercent: drift[i % drift.length], ease: 'none', duration: 0.7 }, 0);
    });
    const heroLine = hero.querySelector<HTMLElement>('[data-hero-line]');
    if (heroLine) {
      tl.fromTo(
        heroLine,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, ease: 'none', duration: 0.6 },
        0,
      );
    }
    const coords = hero.querySelector<HTMLElement>('[data-hero-coords]');
    if (coords) tl.fromTo(coords, { opacity: 0.35 }, { opacity: 1, ease: 'none', duration: 0.6 }, 0.1);
    // The sheet is torn off: lines exit upward, staggered, near the pin's end.
    tl.to(lines, { yPercent: -130, opacity: 0, ease: 'power2.in', stagger: 0.05, duration: 0.28 }, 0.72);
    tl.to(
      hero.querySelectorAll('[data-animate-item]'),
      { y: -24, opacity: 0, ease: 'power2.in', duration: 0.2 },
      0.78,
    );
  }
});
```

Notas: os tweens do timeline são `to`/`fromTo` a partir do estado corrente — a entrada de load (bloco MOTION_OK) anima `yPercent`/`opacity` e termina em 0/1; a cena só toca `yPercent` das linhas a partir de 72% do pin, então não há conflito em uso normal. `xPercent` máximo de 9% fica contido pelo `overflow-clip` da section.

- [ ] **Step 3: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 4: Verificação da cena (bounded)**

Com `npm run dev` e Playwright MCP a 1440×900: carregue `/`, aguarde a entrada, então role devagar capturando ~4 screenshots ao longo do pin: (a) linhas derivando lateralmente, (b) linha de maré desenhando, (c) linhas saindo por cima perto do fim, (d) About chegando após o release — sem gap preto vazio prolongado, sem h-scroll. Confirme que em 1024px− (ex.: 768×1024) NÃO há pin (hero rola normal). Zero erros no console. Derrube o dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/scripts/animations.ts
git commit -m "feat: add pinned hero scene with drifting poster lines and tide draw"
```

---

### Task 8: Cena CarbonTrace — "A maré verde sobe"

**Files:**
- Modify: `src/scripts/animations.ts` (adicionar cena dentro do bloco `mm.add(SCENES, ...)` existente, após a cena Hero)

**Interfaces:**
- Consumes: `data-tide-cover`, `data-ct-heading`, `data-ct-item` (Task 5); constante `SCENES` e bloco `mm.add(SCENES, ...)` (Task 7).

- [ ] **Step 1: Dentro do callback `mm.add(SCENES, () => { ... })`,** após o `if (hero) { ... }`, adicionar:

```ts
  // Cena CarbonTrace — "A maré verde sobe": the section pins while still Breu;
  // scrolling raises the Mangue tide (the ink cover slides up), then the green
  // display heading rises through its mask and the copy lands last.
  const ct = document.querySelector<HTMLElement>('#carbontrace');
  if (ct) {
    const cover = ct.querySelector<HTMLElement>('[data-tide-cover]');
    const heading = ct.querySelector<HTMLElement>('[data-ct-heading]');
    const items = gsap.utils.toArray<HTMLElement>('[data-ct-item]', ct);
    if (cover) gsap.set(cover, { autoAlpha: 1 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ct, start: 'top top', end: '+=250%', pin: true, scrub: true },
    });
    if (cover) tl.to(cover, { yPercent: -101, ease: 'none', duration: 0.45 }, 0);
    if (heading) {
      tl.from(heading, { yPercent: 110, ease: 'power1.out', duration: 0.3, immediateRender: true }, 0.3);
    }
    tl.from(
      items,
      { y: 36, opacity: 0, ease: 'power1.out', stagger: 0.07, duration: 0.3, immediateRender: true },
      0.5,
    );
  }
```

Notas: `gsap.set(cover, { autoAlpha: 1 })` só roda dentro deste matchMedia — em mobile/reduced-motion/no-JS o cover fica `opacity-0` e a seção é a versão estática verde de hoje. O cover desliza `yPercent: -101` (borda inferior sobe = maré de Mangue subindo por baixo). `immediateRender: true` explícito nos `from` garante que heading/itens já estejam no estado oculto quando a seção entra no viewport — a seção chega como muro de Breu e o scroll revela ("pina ainda em Breu", spec Part 1).

- [ ] **Step 2: Build e type-check**

Run: `npm run build && npx tsc --noEmit`
Expected: verde/limpo.

- [ ] **Step 3: Verificação da cena (bounded)**

Com `npm run dev` e Playwright MCP a 1440×900: role até o CarbonTrace e capture ~5 screenshots ao longo do pin: (a) seção pinada ainda Breu (cover cobrindo), (b) maré Mangue no meio da subida (fronteira visível), (c) heading verde emergindo da máscara, (d) tagline/parágrafos/CTA chegando, (e) estado final = idêntico ao estático de hoje. Confirme no viewport 768: sem pin, seção verde estática completa. Zero verde visível fora da seção em qualquer frame. Derrube o dev server.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/animations.ts
git commit -m "feat: add pinned CarbonTrace scene with rising green tide"
```

---

### Task 9: QA completo + sync de documentação

**Files:**
- Modify: `DESIGN.md` (seção de motion + tipos novos)
- Test: passes de verificação abaixo (sem arquivos de teste — site estático)

**Interfaces:**
- Consumes: tudo das Tasks 1–8.

- [ ] **Step 1: Âncoras × pins (desktop 1440×900, Playwright MCP)**

Para cada link do header (`#about`, `#services`, `#carbontrace`, `#recife`, `#contact`) e o CTA do hero (`#contact`): clique real e screenshot do destino. Critério: a seção-alvo aterrissa com o topo visível sob o header (scroll-padding 4.5rem). `#carbontrace` aterrissa no início da cena (muro de Breu) — esperado por design; confirme apenas que continuar rolando dispara a maré normalmente.

- [ ] **Step 2: Mobile 390×844 (PT e EN)**

Página inteira em ~4 paradas: sem pinning, sem h-scroll, numerais/watermark contidos, manifesto empilhado legível, form ok.

- [ ] **Step 3: Reduced motion**

Com emulação `prefers-reduced-motion: reduce` (Playwright `emulateMedia`), recarregue `/`: nenhuma animação, nenhum pin, página inteira visível e estática, CarbonTrace verde desde o início.

- [ ] **Step 4: Sem JavaScript**

Com JS desabilitado no contexto do browser, carregue `/`: todo o conteúdo visível (hero, seções, CarbonTrace verde, form renderizado).

- [ ] **Step 5: h-scroll nos três viewports**

Em 390, 768 e 1440: `document.documentElement.scrollWidth <= window.innerWidth` via browser_evaluate nas duas rotas.

- [ ] **Step 6: Lighthouse (build de produção)**

Run: `npm run build && npm run preview` e rode Lighthouse mobile em `http://localhost:4321/` e `/en/` (`npx lighthouse http://localhost:4321/ --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless" --only-categories=performance,accessibility --output=json --output-path=/tmp/lh-pt.json` e idem para `/en/`).
Expected: performance ≥ 90, accessibility ≥ 95 nas duas rotas.

- [ ] **Step 7: Screenshots finais em lote**

pt-1440, pt-390, en-1440, en-390 (página inteira ou por seção) salvos no scratchpad da sessão, substituindo o set anterior.

- [ ] **Step 8: Sync `DESIGN.md`**

Na seção de motion do DESIGN.md, documentar: as duas cenas pinadas (nomes, gatilhos matchMedia, durações de pin 180%/250%), o sistema de numerais estêncil (`type-numeral`), `type-poster`, hairlines `data-draw-line`, e a exceção documentada do `data-tide-cover`. Manter o resto do arquivo intacto.

- [ ] **Step 9: Commit**

```bash
git add DESIGN.md
git commit -m "docs: document scroll-cinema scenes and stencil numeral system in DESIGN.md"
```
