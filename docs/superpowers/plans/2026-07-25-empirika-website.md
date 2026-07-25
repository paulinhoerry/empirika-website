# Empirika Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-pager institucional bilíngue (PT-BR/EN) da Empirika, dark/bold estilo Cappen, com o CarbonTrace em destaque e formulário de contato via Web3Forms.

**Architecture:** Site estático Astro 5 com duas rotas (`/` PT-BR, `/en/` EN) que montam os mesmos componentes de seção alimentados por dicionários JSON. Estilo via Tailwind 4 com tokens em `@theme` (definidos pelo workflow impeccable). Animações GSAP/ScrollTrigger como camada final, sempre progressive-enhancement.

**Tech Stack:** Astro 5 · Tailwind CSS 4 (`@tailwindcss/vite`) · GSAP 3 + ScrollTrigger · Web3Forms · deploy Vercel (documentado, não executado).

## Global Constraints

- Spec de referência: `docs/superpowers/specs/2026-07-25-empirika-website-design.md` — vale em caso de dúvida.
- Idiomas: PT-BR em `/` (padrão, `lang="pt-BR"`), EN em `/en/` (`lang="en"`). Paridade completa de conteúdo.
- Animações: somente `transform` e `opacity`; nunca `opacity: 0` no CSS base (estado inicial sempre visível; GSAP apenas aprimora); `prefers-reduced-motion: reduce` desliga animações de scroll.
- Sem blog, carreiras, cases, chatbot, CMS ou área logada (YAGNI).
- Workflow impeccable é obrigatório para trabalho visual: `node .agents/skills/impeccable/scripts/context.mjs` uma vez por sessão antes de design; carregar `.agents/skills/impeccable/reference/craft-floor.md` imediatamente antes de editar UI; verificação em passes de screenshot em lote (1440px e 390px, PT e EN), nunca por tweak.
- Proibido visualmente: clichês regionais literais (sol, coqueiro).
- Acento verde vivo é exclusivo da seção CarbonTrace.
- Critérios finais: Lighthouse mobile Performance ≥ 90 e Accessibility ≥ 95; contraste AA; sem scroll horizontal em 390/768/1440px.
- Commits frequentes; mensagens em inglês no padrão `feat:`/`chore:`/`docs:`.

---

## File Structure

```
astro.config.mjs                  → config Astro: site, i18n, plugin Tailwind
package.json / tsconfig.json      → deps e TS strict
.gitignore                        → node_modules, dist, .env, .astro
public/favicon.svg                → favicon
src/
  styles/global.css               → import Tailwind + tokens @theme (fonte única de tokens)
  i18n/pt.json                    → todo o copy PT-BR
  i18n/en.json                    → todo o copy EN (mesmas chaves)
  i18n/index.ts                   → tipos + getDictionary (paridade garantida pelo TS)
  layouts/Layout.astro            → <html>, SEO, hreflang, OG, skip-link, carrega animations
  components/Header.astro         → nav por âncoras + switch de idioma
  components/Hero.astro           → seção 1
  components/About.astro          → seção 2
  components/Services.astro       → seção 3
  components/CarbonTrace.astro    → seção 4 (acento verde)
  components/Recife.astro         → seção 5
  components/Contact.astro        → seção 6 (form Web3Forms + mailto fallback)
  components/Footer.astro         → rodapé
  scripts/animations.ts           → todo o GSAP/ScrollTrigger centralizado
  pages/index.astro               → monta PT
  pages/en/index.astro            → monta EN
PRODUCT.md / DESIGN.md            → gerados pelo impeccable (Task 2)
README.md                         → setup + deploy Vercel (Task 9)
```

---

### Task 1: Scaffold Astro 5 + Tailwind 4 + GSAP

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `src/pages/index.astro`, `public/favicon.svg`
- Modify: `CLAUDE.md` (seção "Current State" → comandos)

**Interfaces:**
- Produces: projeto que roda com `npm run dev` (porta 4321) e `npm run build`; `src/styles/global.css` é a fonte única de tokens de design via `@theme`.

- [ ] **Step 1: Criar arquivos de configuração**

`package.json`:

```json
{
  "name": "empirika-website",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.12.0",
    "gsap": "^3.13.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "tailwindcss": "^4.1.0"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://empirika.com.br',
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

`.gitignore`:

```
node_modules/
dist/
.astro/
.env
.DS_Store
```

- [ ] **Step 2: Criar CSS global com tokens provisórios**

`src/styles/global.css` (valores provisórios — a Task 7 os substitui pelos do DESIGN.md):

```css
@import "tailwindcss";

@theme {
  --color-ink: #0b0b0d;      /* fundo dark */
  --color-paper: #f2f0ea;    /* texto principal */
  --color-muted: #8a8a93;    /* texto secundário */
  --color-carbon: #35d97b;   /* acento exclusivo CarbonTrace */
  --font-display: system-ui, sans-serif;
  --font-body: system-ui, sans-serif;
}

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
body { background-color: var(--color-ink); color: var(--color-paper); }
```

- [ ] **Step 3: Criar página mínima e favicon**

`src/pages/index.astro`:

```astro
---
import '../styles/global.css';
---
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Empirika</title>
  </head>
  <body>
    <h1 class="text-4xl font-bold p-8">Empirika — em construção</h1>
  </body>
</html>
```

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0b0b0d"/><text x="16" y="22" font-family="system-ui" font-size="18" font-weight="bold" fill="#f2f0ea" text-anchor="middle">E</text></svg>
```

- [ ] **Step 4: Instalar e verificar que falha/passa**

Run: `npm install && npm run build`
Expected: build conclui com `1 page(s) built`. Se falhar por versão de dependência, ajustar minor da dependência apontada e re-rodar.

Run: `npm run dev` em background e abrir `http://localhost:4321` (Playwright: `browser_navigate`).
Expected: fundo escuro, texto "Empirika — em construção".

- [ ] **Step 5: Atualizar CLAUDE.md**

Substituir o corpo da seção "## Current State" por:

```markdown
Site estático Astro 5 + Tailwind 4 + GSAP. Comandos:

- `npm run dev` — dev server em http://localhost:4321
- `npm run build` — build de produção em `dist/`
- `npm run preview` — serve o build

Rotas: `/` (PT-BR) e `/en/` (EN). Copy em `src/i18n/*.json`. Tokens de design em `src/styles/global.css` (`@theme`). Animações centralizadas em `src/scripts/animations.ts`.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 5 + Tailwind 4 + GSAP"
```

---

### Task 2: impeccable init + shape (PRODUCT.md e DESIGN.md)

**Files:**
- Create: `PRODUCT.md`, `DESIGN.md` (gerados seguindo os playbooks do impeccable)

**Interfaces:**
- Produces: `DESIGN.md` com paleta exata, tipografia (fontes nomeadas) e textura do mundo visual. A Task 7 traduz esses valores para os tokens `@theme` de `src/styles/global.css`. Decisões do DESIGN.md **substituem** os tokens provisórios da Task 1.

- [ ] **Step 1: Carregar contexto do impeccable**

Run: `node .agents/skills/impeccable/scripts/context.mjs`
Expected: saída indicando que PRODUCT.md/DESIGN.md ainda não existem.

- [ ] **Step 2: Executar `init`**

Ler `.agents/skills/impeccable/reference/init.md` e segui-lo para gerar `PRODUCT.md`. Input de contexto (do spec):

> Empirika: empresa de software de Recife-PE, híbrida (desenvolvimento sob medida + produtos próprios). Produto destaque: CarbonTrace, plataforma de créditos de carbono com verificação e rastreabilidade. Público: empresas que pesquisam a Empirika (credibilidade institucional). Personalidade: confiante, direta, sem corporativês, orgulho recifense sem clichê visual. Site: one-pager PT/EN dark, bold, animado (referência: cappen.com).

- [ ] **Step 3: Executar `shape` (new-work)**

Ler `.agents/skills/impeccable/reference/shape.md` (e `new-work.md` se o playbook mandar) e segui-los para definir o mundo visual e gerar `DESIGN.md`. Brief obrigatório (do spec):

> Mundo dark e dramático; tipografia display gigante como elemento gráfico principal; verde vivo como acento exclusivo da seção CarbonTrace; personalidade recifense via copy e detalhes gráficos (sem sol/coqueiro); movimento com propósito narrativo.

Expected: `DESIGN.md` existe e nomeia paleta (hex), fontes e regras de textura/espacamento.

- [ ] **Step 4: Commit**

```bash
git add PRODUCT.md DESIGN.md
git commit -m "docs: add PRODUCT.md and DESIGN.md via impeccable init/shape"
```

---

### Task 3: Dicionários i18n + helper tipado

**Files:**
- Create: `src/i18n/pt.json`, `src/i18n/en.json`, `src/i18n/index.ts`

**Interfaces:**
- Produces: `getDictionary(locale: 'pt' | 'en'): Dictionary` e o tipo `Dictionary` (shape do `pt.json`). Componentes das Tasks 4-5 consomem sub-objetos: `t.nav`, `t.hero`, `t.about`, `t.services`, `t.carbontrace`, `t.recife`, `t.contact`, `t.footer`, `t.meta`, `t.a11y`. Paridade PT/EN é garantida em compile-time: `en` é tipado como `typeof pt`.

- [ ] **Step 1: Criar `src/i18n/pt.json`** (copy inicial completo; cliente refina depois)

```json
{
  "meta": {
    "title": "Empirika — Software com sotaque de Recife",
    "description": "A Empirika é uma empresa de software do Recife-PE: desenvolvimento sob medida e produtos próprios, como o CarbonTrace, plataforma de créditos de carbono."
  },
  "a11y": { "skip": "Pular para o conteúdo" },
  "nav": {
    "about": "Quem somos",
    "services": "O que fazemos",
    "carbontrace": "CarbonTrace",
    "recife": "Recife",
    "contact": "Contato",
    "langLabel": "EN",
    "langHref": "/en/",
    "langAria": "Switch to English"
  },
  "hero": {
    "kicker": "Empirika — Recife, PE",
    "titleLines": ["SOFTWARE", "COM SOTAQUE", "DE RECIFE"],
    "subtitle": "Construímos produtos digitais sob medida para quem precisa — e produtos próprios para o que o mundo precisa.",
    "cta": "Fale com a gente"
  },
  "about": {
    "heading": "Quem somos",
    "paragraphs": [
      "A Empirika nasceu no Recife, entre o mangue e o Porto Digital. Somos uma empresa de software que gosta de duas coisas: resolver problemas difíceis e ver código virar negócio.",
      "Trabalhamos em dois modos. No primeiro, construímos software sob medida para empresas que precisam de tecnologia bem feita. No segundo, criamos produtos próprios — como o CarbonTrace.",
      "Sem corporativês, sem promessa vazia. A gente prefere entregar."
    ]
  },
  "services": {
    "heading": "O que fazemos",
    "items": [
      { "title": "Produtos digitais sob medida", "description": "Da ideia ao deploy: aplicações web e mobile desenhadas para o seu problema, não para o nosso portfólio." },
      { "title": "Plataformas e integrações", "description": "Sistemas que conversam entre si: APIs, integrações e automações que tiram trabalho manual do caminho." },
      { "title": "Dados e inteligência", "description": "Pipelines, dashboards e modelos que transformam dado bruto em decisão." },
      { "title": "Evolução de sistemas", "description": "Aquele sistema legado que ninguém quer tocar? A gente moderniza sem parar a sua operação." }
    ]
  },
  "carbontrace": {
    "kicker": "Produto próprio",
    "heading": "CarbonTrace",
    "tagline": "Créditos de carbono com lastro, rastro e prova.",
    "paragraphs": [
      "O CarbonTrace é a nossa plataforma de créditos de carbono: conecta projetos que capturam ou evitam emissões a empresas que precisam compensar as suas — com verificação e rastreabilidade em cada etapa.",
      "Cada crédito carrega a própria história: origem, metodologia, verificação e aposentadoria. Transparência que o mercado voluntário de carbono ainda deve ao planeta."
    ],
    "cta": "Conheça o CarbonTrace"
  },
  "recife": {
    "heading": "Recife não é detalhe",
    "paragraphs": [
      "Estar no Recife não é acaso — é posição. A cidade abriga um dos maiores parques tecnológicos do país, o Porto Digital, e uma cena de tecnologia que cresce há mais de duas décadas.",
      "Daqui a gente constrói para qualquer lugar. Mas o sotaque, esse não sai."
    ]
  },
  "contact": {
    "heading": "Vamos conversar?",
    "subtitle": "Conte o que você precisa. A gente responde rápido.",
    "email": "contato@empirika.com.br",
    "location": "Recife, Pernambuco — Brasil",
    "form": {
      "name": "Nome",
      "email": "E-mail",
      "company": "Empresa",
      "message": "Mensagem",
      "submit": "Enviar mensagem",
      "sending": "Enviando…",
      "success": "Mensagem enviada! Respondemos em breve.",
      "error": "Não foi possível enviar. Tente de novo ou escreva para",
      "requiredError": "Preencha este campo.",
      "emailError": "Digite um e-mail válido."
    }
  },
  "footer": {
    "tagline": "Software feito no Recife.",
    "rights": "Todos os direitos reservados."
  }
}
```

Nota: `contact.email` assume `contato@empirika.com.br` — confirmar com o usuário na primeira oportunidade; se diferir, atualizar nos dois JSONs.

- [ ] **Step 2: Criar `src/i18n/en.json`** (mesmas chaves, traduzido)

```json
{
  "meta": {
    "title": "Empirika — Software with a Recife accent",
    "description": "Empirika is a software company from Recife, Brazil: custom development and in-house products like CarbonTrace, a carbon credit platform."
  },
  "a11y": { "skip": "Skip to content" },
  "nav": {
    "about": "About us",
    "services": "What we do",
    "carbontrace": "CarbonTrace",
    "recife": "Recife",
    "contact": "Contact",
    "langLabel": "PT",
    "langHref": "/",
    "langAria": "Mudar para português"
  },
  "hero": {
    "kicker": "Empirika — Recife, Brazil",
    "titleLines": ["SOFTWARE", "WITH A RECIFE", "ACCENT"],
    "subtitle": "We build custom digital products for those who need them — and products of our own for what the world needs.",
    "cta": "Talk to us"
  },
  "about": {
    "heading": "About us",
    "paragraphs": [
      "Empirika was born in Recife, between the mangroves and Porto Digital. We are a software company that loves two things: solving hard problems and watching code become business.",
      "We work in two modes. In the first, we build custom software for companies that need technology done right. In the second, we create our own products — like CarbonTrace.",
      "No corporate jargon, no empty promises. We'd rather deliver."
    ]
  },
  "services": {
    "heading": "What we do",
    "items": [
      { "title": "Custom digital products", "description": "From idea to deploy: web and mobile applications designed for your problem, not for our portfolio." },
      { "title": "Platforms and integrations", "description": "Systems that talk to each other: APIs, integrations and automations that remove manual work from the way." },
      { "title": "Data and intelligence", "description": "Pipelines, dashboards and models that turn raw data into decisions." },
      { "title": "System evolution", "description": "That legacy system nobody wants to touch? We modernize it without stopping your operation." }
    ]
  },
  "carbontrace": {
    "kicker": "In-house product",
    "heading": "CarbonTrace",
    "tagline": "Carbon credits with backing, trail and proof.",
    "paragraphs": [
      "CarbonTrace is our carbon credit platform: it connects projects that capture or avoid emissions to companies that need to offset theirs — with verification and traceability at every step.",
      "Every credit carries its own history: origin, methodology, verification and retirement. The transparency the voluntary carbon market still owes the planet."
    ],
    "cta": "Discover CarbonTrace"
  },
  "recife": {
    "heading": "Recife is not a footnote",
    "paragraphs": [
      "Being in Recife is not an accident — it's a stance. The city hosts one of the largest technology parks in Brazil, Porto Digital, and a tech scene that has been growing for over two decades.",
      "From here we build for anywhere. But the accent? That stays."
    ]
  },
  "contact": {
    "heading": "Shall we talk?",
    "subtitle": "Tell us what you need. We answer fast.",
    "email": "contato@empirika.com.br",
    "location": "Recife, Pernambuco — Brazil",
    "form": {
      "name": "Name",
      "email": "Email",
      "company": "Company",
      "message": "Message",
      "submit": "Send message",
      "sending": "Sending…",
      "success": "Message sent! We'll get back to you soon.",
      "error": "Could not send. Try again or write to",
      "requiredError": "This field is required.",
      "emailError": "Enter a valid email."
    }
  },
  "footer": {
    "tagline": "Software made in Recife.",
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Criar `src/i18n/index.ts`**

```ts
import pt from './pt.json';
import en from './en.json';

export type Dictionary = typeof pt;
export type Locale = 'pt' | 'en';

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
```

- [ ] **Step 4: Verificar paridade em compile-time**

Run: `npx astro check 2>/dev/null || npx tsc --noEmit -p tsconfig.json`
Expected: sem erros. (Se `en.json` divergir das chaves de `pt.json`, o TS acusa aqui — este é o teste de paridade.)

- [ ] **Step 5: Commit**

```bash
git add src/i18n
git commit -m "feat: add PT/EN i18n dictionaries with typed accessor"
```

---

### Task 4: Layout, Header, Footer e as duas páginas

**Files:**
- Create: `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro` (substituir conteúdo provisório)

**Interfaces:**
- Consumes: `getDictionary`, `Dictionary`, `Locale` de `src/i18n` (Task 3).
- Produces: `Layout.astro` com props `{ locale: Locale; t: Dictionary }` e um `<slot />`; `Header.astro` com props `{ t: Dictionary['nav'] }`; `Footer.astro` com props `{ t: Dictionary['footer'] }`. IDs de âncora canônicos que Header e seções compartilham: `#about`, `#services`, `#carbontrace`, `#recife`, `#contact`, `#main`.

- [ ] **Step 1: Criar `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';
import type { Dictionary, Locale } from '../i18n';

interface Props { locale: Locale; t: Dictionary; }
const { locale, t } = Astro.props;
const isPt = locale === 'pt';
const path = isPt ? '/' : '/en/';
const altPath = isPt ? '/en/' : '/';
const htmlLang = isPt ? 'pt-BR' : 'en';
const altLang = isPt ? 'en' : 'pt-BR';
---
<html lang={htmlLang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{t.meta.title}</title>
    <meta name="description" content={t.meta.description} />
    <link rel="canonical" href={new URL(path, Astro.site)} />
    <link rel="alternate" hreflang={htmlLang} href={new URL(path, Astro.site)} />
    <link rel="alternate" hreflang={altLang} href={new URL(altPath, Astro.site)} />
    <link rel="alternate" hreflang="x-default" href={new URL('/', Astro.site)} />
    <meta property="og:title" content={t.meta.title} />
    <meta property="og:description" content={t.meta.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={new URL(path, Astro.site)} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-paper focus:text-ink focus:px-4 focus:py-2">{t.a11y.skip}</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Criar `src/components/Header.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['nav']; }
const { t } = Astro.props;
const links = [
  { href: '#about', label: t.about },
  { href: '#services', label: t.services },
  { href: '#carbontrace', label: t.carbontrace },
  { href: '#recife', label: t.recife },
  { href: '#contact', label: t.contact },
];
---
<header class="fixed top-0 inset-x-0 z-40">
  <nav class="flex items-center justify-between px-6 py-4" aria-label="Main">
    <a href="#main" class="font-bold tracking-tight text-lg">empirika<span class="text-carbon">.</span></a>
    <div class="flex items-center gap-6">
      <ul class="hidden md:flex gap-6 text-sm">
        {links.map((l) => (
          <li><a href={l.href} class="hover:text-carbon transition-colors">{l.label}</a></li>
        ))}
      </ul>
      <a href={t.langHref} aria-label={t.langAria} class="text-sm border border-current px-2 py-1 rounded">{t.langLabel}</a>
    </div>
  </nav>
</header>
```

(Nav de âncoras fica oculta no mobile — one-pager com scroll dispensa menu hambúrguer; o switch de idioma permanece visível. Se o impeccable critique da Task 7 pedir menu mobile, tratar lá.)

- [ ] **Step 3: Criar `src/components/Footer.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['footer']; }
const { t } = Astro.props;
const year = new Date().getFullYear();
---
<footer class="px-6 py-10 text-sm text-muted">
  <p>{t.tagline}</p>
  <p>© {year} Empirika. {t.rights}</p>
</footer>
```

- [ ] **Step 4: Reescrever `src/pages/index.astro` e criar `src/pages/en/index.astro`**

`src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getDictionary } from '../i18n';
const t = getDictionary('pt');
---
<Layout locale="pt" t={t}>
  <Header t={t.nav} />
  <main id="main">
    <h1 class="text-4xl font-bold p-8 pt-24">{t.hero.titleLines.join(' ')}</h1>
  </main>
  <Footer t={t.footer} />
</Layout>
```

`src/pages/en/index.astro`: idêntico, trocando `getDictionary('pt')` por `getDictionary('en')` e `locale="pt"` por `locale="en"` (e o path do import de `../` para `../../`).

- [ ] **Step 5: Verificar as duas rotas**

Run: `npm run build && npm run preview` (background), depois Playwright `browser_navigate` em `http://localhost:4321/` e `http://localhost:4321/en/`.
Expected: `/` mostra header + título PT; `/en/` mostra EN; switch de idioma leva de uma à outra; `view-source` contém os três `hreflang`.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add layout, header, footer and PT/EN pages with hreflang"
```

---

### Task 5: Componentes de seção (estrutura semântica completa)

**Files:**
- Create: `src/components/Hero.astro`, `src/components/About.astro`, `src/components/Services.astro`, `src/components/CarbonTrace.astro`, `src/components/Recife.astro`, `src/components/Contact.astro`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`

**Interfaces:**
- Consumes: sub-objetos do `Dictionary` (Task 3); âncoras da Task 4.
- Produces: props por componente — `Hero: { t: Dictionary['hero'] }`, `About: { t: Dictionary['about'] }`, `Services: { t: Dictionary['services'] }`, `CarbonTrace: { t: Dictionary['carbontrace'] }`, `Recife: { t: Dictionary['recife'] }`, `Contact: { t: Dictionary['contact']; locale: Locale }`. Atributos `data-animate="hero"` (no Hero) e `data-animate="reveal"` (nas demais seções) que a Task 8 consome. Form com `id="contact-form"` que a Task 6 consome.

- [ ] **Step 0: Pré-requisito impeccable**

Rodar `node .agents/skills/impeccable/scripts/context.mjs` (se ainda não rodou nesta sessão) e ler `.agents/skills/impeccable/reference/craft-floor.md` antes de editar UI.

- [ ] **Step 1: Criar `Hero.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['hero']; }
const { t } = Astro.props;
---
<section class="min-h-svh flex flex-col justify-center px-6 pt-24" data-animate="hero">
  <p class="text-sm uppercase tracking-widest text-muted">{t.kicker}</p>
  <h1 class="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.95] uppercase">
    {t.titleLines.map((line) => <span class="block">{line}</span>)}
  </h1>
  <p class="mt-6 max-w-xl text-lg text-muted">{t.subtitle}</p>
  <a href="#contact" class="mt-8 inline-block w-fit border border-current px-6 py-3 uppercase text-sm tracking-wide hover:text-carbon transition-colors">{t.cta}</a>
</section>
```

- [ ] **Step 2: Criar `About.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['about']; }
const { t } = Astro.props;
---
<section id="about" class="px-6 py-24 max-w-3xl" data-animate="reveal">
  <h2 class="font-display text-4xl md:text-6xl uppercase mb-8">{t.heading}</h2>
  {t.paragraphs.map((p) => <p class="mb-4 text-lg leading-relaxed">{p}</p>)}
</section>
```

- [ ] **Step 3: Criar `Services.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['services']; }
const { t } = Astro.props;
---
<section id="services" class="px-6 py-24" data-animate="reveal">
  <h2 class="font-display text-4xl md:text-6xl uppercase mb-12">{t.heading}</h2>
  <ol class="grid gap-10 md:grid-cols-2">
    {t.items.map((item, i) => (
      <li>
        <span class="text-sm text-muted">{String(i + 1).padStart(3, '0')}</span>
        <h3 class="text-2xl font-bold mt-1">{item.title}</h3>
        <p class="mt-2 text-muted leading-relaxed">{item.description}</p>
      </li>
    ))}
  </ol>
</section>
```

- [ ] **Step 4: Criar `CarbonTrace.astro`** (único lugar onde `text-carbon`/verde é permitido como acento dominante)

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['carbontrace']; }
const { t } = Astro.props;
---
<section id="carbontrace" class="px-6 py-32" data-animate="reveal">
  <p class="text-sm uppercase tracking-widest text-carbon">{t.kicker}</p>
  <h2 class="font-display text-5xl md:text-8xl uppercase text-carbon">{t.heading}</h2>
  <p class="mt-4 text-2xl max-w-2xl">{t.tagline}</p>
  {t.paragraphs.map((p) => <p class="mt-6 max-w-2xl text-lg text-muted leading-relaxed">{p}</p>)}
  <a href="#contact" class="mt-10 inline-block border border-carbon text-carbon px-6 py-3 uppercase text-sm tracking-wide hover:bg-carbon hover:text-ink transition-colors">{t.cta}</a>
</section>
```

- [ ] **Step 5: Criar `Recife.astro`**

```astro
---
import type { Dictionary } from '../i18n';
interface Props { t: Dictionary['recife']; }
const { t } = Astro.props;
---
<section id="recife" class="px-6 py-24 max-w-3xl" data-animate="reveal">
  <h2 class="font-display text-4xl md:text-6xl uppercase mb-8">{t.heading}</h2>
  {t.paragraphs.map((p) => <p class="mb-4 text-lg leading-relaxed">{p}</p>)}
</section>
```

- [ ] **Step 6: Criar `Contact.astro`** (markup estático; comportamento JS é a Task 6)

```astro
---
import type { Dictionary, Locale } from '../i18n';
interface Props { t: Dictionary['contact']; locale: Locale; }
const { t, locale } = Astro.props;
const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
---
<section id="contact" class="px-6 py-24" data-animate="reveal">
  <h2 class="font-display text-4xl md:text-6xl uppercase mb-4">{t.heading}</h2>
  <p class="text-lg text-muted mb-10">{t.subtitle}</p>
  <form id="contact-form" method="POST" action="https://api.web3forms.com/submit" class="max-w-xl grid gap-6" novalidate data-locale={locale}>
    <input type="hidden" name="access_key" value={accessKey} />
    <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />
    <div>
      <label for="cf-name" class="block text-sm mb-1">{t.form.name}</label>
      <input id="cf-name" name="name" type="text" required class="w-full bg-transparent border-b border-muted py-2 focus:border-paper outline-none" />
      <p class="field-error text-sm text-carbon mt-1 hidden"></p>
    </div>
    <div>
      <label for="cf-email" class="block text-sm mb-1">{t.form.email}</label>
      <input id="cf-email" name="email" type="email" required class="w-full bg-transparent border-b border-muted py-2 focus:border-paper outline-none" />
      <p class="field-error text-sm text-carbon mt-1 hidden"></p>
    </div>
    <div>
      <label for="cf-company" class="block text-sm mb-1">{t.form.company}</label>
      <input id="cf-company" name="company" type="text" class="w-full bg-transparent border-b border-muted py-2 focus:border-paper outline-none" />
    </div>
    <div>
      <label for="cf-message" class="block text-sm mb-1">{t.form.message}</label>
      <textarea id="cf-message" name="message" rows="5" required class="w-full bg-transparent border border-muted p-3 focus:border-paper outline-none"></textarea>
      <p class="field-error text-sm text-carbon mt-1 hidden"></p>
    </div>
    <button type="submit" class="w-fit border border-current px-8 py-3 uppercase text-sm tracking-wide hover:text-carbon transition-colors">{t.form.submit}</button>
    <p id="form-status" role="status" aria-live="polite" class="text-sm"></p>
  </form>
  <p class="mt-10 text-muted">
    <a href={`mailto:${t.email}`} class="underline hover:text-paper">{t.email}</a><br />
    {t.location}
  </p>
</section>
```

- [ ] **Step 7: Montar as seções nas duas páginas**

Em `src/pages/index.astro`, dentro de `<main id="main">`, substituir o `<h1>` provisório por:

```astro
<Hero t={t.hero} />
<About t={t.about} />
<Services t={t.services} />
<CarbonTrace t={t.carbontrace} />
<Recife t={t.recife} />
<Contact t={t.contact} locale="pt" />
```

(com os imports correspondentes no frontmatter). Repetir em `src/pages/en/index.astro` com `locale="en"`.

- [ ] **Step 8: Verificar**

Run: `npm run build`, depois screenshots em lote via Playwright: `/` e `/en/` em 1440px e 390px (`browser_resize` + `browser_take_screenshot`).
Expected: as 6 seções na ordem do spec nas duas línguas; âncoras do header funcionam; nenhum texto vazando/overflow horizontal em 390px.

- [ ] **Step 9: Commit**

```bash
git add src
git commit -m "feat: add all page sections with semantic markup and full copy"
```

---

### Task 6: Comportamento do formulário (Web3Forms)

**Files:**
- Create: `src/scripts/contact-form.ts`, `.env` (local, não commitado)
- Modify: `src/components/Contact.astro` (adicionar `<script>` no fim do arquivo)

**Interfaces:**
- Consumes: form `#contact-form`, elementos `.field-error`, `#form-status`, atributo `data-locale` (Task 5); dicionários (Task 3).
- Produces: submissão AJAX com validação; textos de estado lidos de `data-*` attributes injetados no form (para não importar JSON no script do cliente).

- [ ] **Step 1: Passar textos de estado para o cliente**

Em `Contact.astro`, adicionar ao `<form>` os atributos:

```astro
data-msg-sending={t.form.sending}
data-msg-success={t.form.success}
data-msg-error={t.form.error}
data-msg-required={t.form.requiredError}
data-msg-email={t.form.emailError}
data-contact-email={t.email}
data-msg-submit={t.form.submit}
```

- [ ] **Step 2: Criar `src/scripts/contact-form.ts`**

```ts
const form = document.getElementById('contact-form') as HTMLFormElement | null;

if (form) {
  const status = form.querySelector('#form-status') as HTMLParagraphElement;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const d = form.dataset;

  const setFieldError = (input: HTMLInputElement | HTMLTextAreaElement, msg: string) => {
    const p = input.parentElement?.querySelector('.field-error') as HTMLParagraphElement | null;
    if (p) { p.textContent = msg; p.classList.toggle('hidden', msg === ''); }
    input.setAttribute('aria-invalid', msg === '' ? 'false' : 'true');
  };

  const validate = (): boolean => {
    let ok = true;
    for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')) {
      if (!el.value.trim()) { setFieldError(el, d.msgRequired ?? ''); ok = false; }
      else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) {
        setFieldError(el, d.msgEmail ?? ''); ok = false;
      } else setFieldError(el, '');
    }
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    status.textContent = d.msgSending ?? '';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      status.textContent = d.msgSuccess ?? '';
      form.reset();
    } catch {
      status.innerHTML = `${d.msgError ?? ''} <a class="underline" href="mailto:${d.contactEmail}">${d.contactEmail}</a>`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}
```

- [ ] **Step 3: Carregar o script no componente**

No fim de `Contact.astro`:

```astro
<script>
  import '../scripts/contact-form.ts';
</script>
```

- [ ] **Step 4: Configurar a access key**

Perguntar ao usuário a access key do Web3Forms (criada grátis em web3forms.com com o e-mail de contato). Criar `.env` na raiz:

```
PUBLIC_WEB3FORMS_KEY=<key-fornecida>
```

Se o usuário ainda não tiver a key, seguir sem ela (form renderiza; envio cai no estado de erro com mailto — comportamento previsto no spec) e registrar no README (Task 9).

- [ ] **Step 5: Testar comportamento**

Run: `npm run dev` + Playwright: (a) submeter vazio → erros de campo aparecem, sem request; (b) e-mail inválido → erro de e-mail; (c) preenchido corretamente → estado "Enviando…" e depois sucesso (com key válida) ou erro com mailto visível (sem key). Repetir (a) em `/en/` para conferir textos EN.
Expected: os três estados funcionam; `#form-status` anuncia via `aria-live`.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add contact form validation and Web3Forms submission"
```

---

### Task 7: Aplicação da direção visual (impeccable craft)

**Files:**
- Modify: `src/styles/global.css` (tokens do DESIGN.md, fontes), `package.json` (pacotes @fontsource das fontes escolhidas), `src/layouts/Layout.astro` (imports de fonte), todos os componentes de seção conforme necessário

**Interfaces:**
- Consumes: `DESIGN.md` (Task 2) — fonte da verdade para paleta/tipografia/textura; estrutura das Tasks 4-5.
- Produces: tokens finais em `@theme` com os mesmos nomes já usados (`--color-ink`, `--color-paper`, `--color-muted`, `--color-carbon`, `--font-display`, `--font-body`) — os componentes não precisam trocar de classe quando o token muda de valor.

- [ ] **Step 1: Pré-requisitos impeccable**

Rodar `node .agents/skills/impeccable/scripts/context.mjs --target src/pages/index.astro`; reler `DESIGN.md`; carregar `.agents/skills/impeccable/reference/craft-floor.md` e, se existirem, `polish.md`/`typeset.md`/`layout.md` conforme o trabalho pedir.

- [ ] **Step 2: Instalar e ligar as fontes do DESIGN.md**

Instalar os pacotes `@fontsource-variable/<fonte>` (ou `@fontsource/<fonte>`) que o DESIGN.md nomear, importá-los no frontmatter do `Layout.astro`, e atualizar `--font-display`/`--font-body` no `@theme`. Self-hosted via fontsource — sem Google Fonts CDN (desempenho e privacidade).

- [ ] **Step 3: Substituir tokens provisórios pelos do DESIGN.md**

Atualizar os valores hex em `@theme` mantendo os nomes. Adicionar tokens novos que o DESIGN.md exigir (ex.: cor de superfície elevada, tracking display).

- [ ] **Step 4: Passe de estilo seção a seção**

Aplicar o mundo visual em Header, Hero, About, Services, CarbonTrace, Recife, Contact e Footer seguindo o DESIGN.md e o craft-floor: escala tipográfica dramática no hero, ritmo de espaçamento entre seções, o "momento verde" do CarbonTrace, estados de hover/focus visíveis em tudo que é interativo.

- [ ] **Step 5: Verificação em lote + contraste**

Screenshots Playwright: `/` e `/en/` em 1440px e 390px (um passe, os 4 shots). Rodar o detector do impeccable se aplicável: `node .agents/skills/impeccable/scripts/detect.mjs --target http://localhost:4321`. Conferir contraste AA dos pares texto/fundo usados (ex.: `--color-muted` sobre `--color-ink` ≥ 4.5:1) — ajustar o token se falhar.
Expected: visual coeso nas 4 vistas; zero findings críticos do detector; AA em todo texto.

- [ ] **Step 6: Corrigir achados e repetir o passe uma vez**

Aplicar correções dos achados do Step 5 e refazer os 4 screenshots em um único segundo passe (não iterar por tweak).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: apply visual direction from DESIGN.md across all sections"
```

---

### Task 8: Camada de animação (GSAP + ScrollTrigger)

**Files:**
- Create: `src/scripts/animations.ts`
- Modify: `src/layouts/Layout.astro` (carregar o script)

**Interfaces:**
- Consumes: atributos `data-animate="hero"` e `data-animate="reveal"` (Task 5); gsap (Task 1).
- Produces: animações de entrada e scroll. Contrato: nenhum CSS estático esconde conteúdo; `gsap.from()` só roda dentro de `matchMedia('(prefers-reduced-motion: no-preference)')`.

- [ ] **Step 1: Criar `src/scripts/animations.ts`**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: entrada dramática linha a linha
  gsap.from('[data-animate="hero"] h1 > span', {
    yPercent: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
  });
  gsap.from('[data-animate="hero"] > p, [data-animate="hero"] > a', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    delay: 0.5,
    stagger: 0.1,
  });

  // Seções: reveal on scroll
  document.querySelectorAll<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
    gsap.from(el.children, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });
  });
});
```

- [ ] **Step 2: Carregar no Layout**

Antes de `</body>` em `Layout.astro`:

```astro
<script>
  import '../scripts/animations.ts';
</script>
```

- [ ] **Step 3: Verificar regra "estado inicial visível"**

Run: `grep -rn "opacity-0\|opacity: 0\|opacity:0" src/styles src/components src/layouts`
Expected: nenhuma ocorrência (opacidade inicial só via `gsap.from`, que é JS).

- [ ] **Step 4: Verificar comportamento nos três modos**

Playwright em `npm run dev`:
1. Normal: navegar `/`, scrollar até o fim — seções revelam; sem jank visível; screenshot final da página completa.
2. Reduced motion: `browser_run_code_unsafe` com emulação `prefers-reduced-motion: reduce` (ou DevTools emulation) → conteúdo todo visível sem animação.
3. Sem JS: `browser_navigate` com JavaScript desabilitado → todo o conteúdo visível.
Expected: conteúdo íntegro nos três modos.

- [ ] **Step 5: Rodar o passe `animate` do impeccable (calibragem)**

Ler `.agents/skills/impeccable/reference/animate.md` e conferir as animações contra ele (durações, easing, propósito narrativo); ajustar o que violar o playbook.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add GSAP scroll animations with reduced-motion support"
```

---

### Task 9: QA final, README e critérios de pronto

**Files:**
- Create: `README.md`
- Modify: o que os achados de QA exigirem

**Interfaces:**
- Consumes: tudo anterior.
- Produces: site atendendo o checklist do spec; README com setup e deploy.

- [ ] **Step 1: Criar `README.md`**

```markdown
# Empirika Website

One-pager institucional da Empirika (Recife-PE). Astro 5 + Tailwind 4 + GSAP.

## Desenvolvimento

- `npm install`
- `npm run dev` → http://localhost:4321 (PT) e /en/ (EN)
- `npm run build` → `dist/`

## Formulário de contato

Usa [Web3Forms](https://web3forms.com). Crie uma access key gratuita com o
e-mail de contato e defina em `.env`:

    PUBLIC_WEB3FORMS_KEY=sua-key

Sem a key o formulário exibe o estado de erro com o e-mail `mailto:` como alternativa.

## Deploy (Vercel)

1. Suba o repositório para GitHub/GitLab.
2. Em vercel.com → Add New Project → importe o repo (framework: Astro, detectado automaticamente).
3. Em Settings → Environment Variables, adicione `PUBLIC_WEB3FORMS_KEY`.
4. Aponte o domínio em Settings → Domains e atualize `site` em `astro.config.mjs` se o domínio final diferir de `https://empirika.com.br`.

## Conteúdo

Todo o copy vive em `src/i18n/pt.json` e `src/i18n/en.json` (chaves espelhadas;
o TypeScript acusa divergência). Tokens de design em `src/styles/global.css`.
```

- [ ] **Step 2: Lighthouse mobile**

Run: `npm run build && npm run preview` (background), depois:
`npx lighthouse http://localhost:4321 --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility --output=json --output-path=/tmp/lh.json --chrome-flags="--headless=new" && node -e "const r=require('/tmp/lh.json');console.log('perf',r.categories.performance.score*100,'a11y',r.categories.accessibility.score*100)"`
Expected: perf ≥ 90, a11y ≥ 95. Se falhar: tratar os itens apontados no relatório (imagens, contraste, fontes) e re-rodar.

- [ ] **Step 3: Scroll horizontal**

Playwright: para cada largura 390, 768 e 1440, `browser_resize` e `browser_run_code_unsafe` com `document.documentElement.scrollWidth <= window.innerWidth`.
Expected: `true` nas três larguras, em `/` e `/en/`.

- [ ] **Step 4: Paridade PT/EN e hreflang**

Run: `npx tsc --noEmit -p tsconfig.json` (paridade de chaves) e `grep -c hreflang dist/index.html dist/en/index.html`.
Expected: TS sem erros; 3 hreflang em cada página.

- [ ] **Step 5: Envio real do formulário**

Com `PUBLIC_WEB3FORMS_KEY` configurada, submeter o form preenchido em `/` e confirmar recebimento do e-mail com o usuário. Sem key disponível: verificar o estado de erro + mailto e registrar como pendência para o usuário no relatório final.

- [ ] **Step 6: Passe final de screenshots**

Playwright: `/` e `/en/` em 1440px e 390px, página completa. Comparar contra o checklist do spec (seções na ordem, momento verde só no CarbonTrace, sem clichê regional).

- [ ] **Step 7: Corrigir achados e commit final**

```bash
git add -A
git commit -m "docs: add README; final QA fixes"
```

---

## Self-Review (executado na escrita do plano)

- **Cobertura do spec:** hero/about/services/carbontrace/recife/contato → Task 5; bilíngue+hreflang → Tasks 3-4; Web3Forms+fallback → Task 6; impeccable init/shape/craft-floor/screenshots em lote → Tasks 2, 5, 7, 8; animações+reduced-motion+no-JS → Task 8; Lighthouse/AA/overflow/paridade/envio real → Task 9; README de deploy → Task 9. Sem lacunas.
- **Placeholders:** nenhum "TBD/TODO". Dois pontos dependem de input externo por natureza e estão explicitados como perguntas ao usuário: e-mail de contato (Task 3, default declarado) e access key Web3Forms (Task 6, comportamento sem key definido).
- **Consistência de tipos:** `Dictionary`/`getDictionary`/`Locale` idênticos nas Tasks 3-6; nomes de tokens (`--color-ink` etc.) idênticos nas Tasks 1 e 7; `data-animate="hero"|"reveal"` idênticos nas Tasks 5 e 8; `#contact-form`/`.field-error`/`#form-status` idênticos nas Tasks 5 e 6.
