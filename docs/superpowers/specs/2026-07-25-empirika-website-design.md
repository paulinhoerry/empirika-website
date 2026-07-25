# Empirika Website — Design Spec

**Data:** 2026-07-25
**Status:** Aprovado em brainstorming, aguardando revisão final do spec

## Visão geral

Site institucional da Empirika, empresa de software de Recife-PE que atua de forma híbrida: desenvolvimento sob medida (software house) e produtos próprios. O produto em destaque é o **CarbonTrace**, plataforma de créditos de carbono.

- **Formato:** one-pager (página única com navegação por âncoras)
- **Idiomas:** PT-BR (rota `/`, padrão) e EN (rota `/en/`), com switch discreto no header
- **Objetivo:** presença institucional — credibilidade para quem pesquisa a empresa, com o CarbonTrace apresentado como produto
- **Vibe:** dark, bold, animado — referência principal: [cappen.com](https://cappen.com/pt/) (tipografia gigante, animações de scroll, drama visual)

## Fora de escopo (YAGNI)

Blog, página de carreiras, cases de clientes, chatbot, CMS, área logada. Podem vir em versões futuras; nada no design atual deve prepará-los antecipadamente.

## Conteúdo e narrativa (ordem de scroll)

1. **Hero** — declaração de posicionamento em tipografia display gigante; momento mais dramático do site, com animação de entrada forte.
2. **Quem somos** — 2–3 parágrafos: software house + produtos próprios, baseada em Recife-PE. Tom confiante e direto, sem corporativês.
3. **O que fazemos** — 3–4 itens de serviços de desenvolvimento sob medida, enxutos.
4. **CarbonTrace** — seção mais longa depois do hero: o que é (plataforma de créditos de carbono), para quem, CTA próprio ("Conheça o CarbonTrace"). Ganha acento de cor próprio (verde vivo) dentro do mundo dark.
5. **Recife** — momento de personalidade regional (Porto Digital, cena tech local). Curto. O regional entra no copy e em detalhes gráficos — sem clichês visuais (sol/coqueiro literal está banido).
6. **Contato** — formulário (nome, e-mail, empresa, mensagem) + e-mail direto clicável e localização.

O copy inicial nas duas línguas é escrito durante a implementação; o cliente refina depois. Paridade completa de conteúdo entre PT e EN é obrigatória.

## Arquitetura técnica

**Stack:** Astro 5 (estático) · Tailwind CSS 4 · GSAP + ScrollTrigger · deploy na Vercel (deploy fica documentado como passo posterior; conta/domínio a confirmar).

```
src/
  pages/
    index.astro          → PT-BR (/)
    en/index.astro       → EN (/en/)
  components/            → um componente por seção
    Header.astro, Hero.astro, About.astro, Services.astro,
    CarbonTrace.astro, Recife.astro, Contact.astro, Footer.astro
  i18n/
    pt.json, en.json     → todo o copy centralizado por língua
  scripts/
    animations.ts        → setup GSAP/ScrollTrigger centralizado
  styles/
    global.css           → tokens de design (cores, tipografia, espaçamento)
```

- Componentes de seção recebem texto via props a partir do dicionário i18n; `/` e `/en/` montam os mesmos componentes com dicionários diferentes. Zero duplicação de markup.
- **Formulário:** Web3Forms (sem backend próprio). Validação no cliente (obrigatórios + formato de e-mail), estados de sucesso/erro visíveis. Fallback permanente: e-mail `mailto:` visível na seção de contato.
- **Animações:** GSAP carregado uma vez; animações registradas por seção via atributos `data-`. Somente `transform` e `opacity` (nunca animar propriedades de layout). `prefers-reduced-motion` desliga as animações de scroll.
- **SEO/A11y:** HTML semântico, contraste AA no dark, `hreflang` PT↔EN, Open Graph, favicon, meta description por língua.

## Direção visual e workflow (impeccable)

Todo trabalho de UI segue o skill impeccable (`.agents/skills/impeccable/`), conforme CLAUDE.md:

1. `node .agents/skills/impeccable/scripts/context.mjs` uma vez por sessão antes de trabalho de design.
2. **`init`** captura o contexto durável em `PRODUCT.md` — identidade nasce do zero; o brief abaixo é input, não decisão final.
3. **`shape`** (new-work) define o mundo visual — paleta exata, tipografia, textura — registrado em `DESIGN.md`.
4. **`craft-floor.md`** carregado imediatamente antes de editar UI.
5. Verificação visual em passes de screenshot em lote (desktop + mobile), nunca por tweak.

**Brief de direção (input para o impeccable):**
- Mundo dark e dramático; tipografia display gigante como elemento gráfico principal (linha Cappen).
- Verde vivo como acento exclusivo da seção CarbonTrace — um "momento" dentro do site escuro.
- Personalidade recifense via copy e detalhes gráficos.
- Movimento com propósito narrativo (revelar, dar ritmo) + micro-interações em hover; sem animação decorativa gratuita.

**Ordem de implementação:** (1) conteúdo e estrutura semântica completos e legíveis sem animação → (2) direção visual aplicada → (3) camada de animação. O site nunca fica quebrado entre etapas.

## Falhas previstas e degradação

- **Web3Forms fora do ar / erro de rede:** mensagem de erro clara no form + `mailto:` sempre visível como alternativa.
- **`prefers-reduced-motion`:** site 100% funcional sem animações de scroll.
- **JavaScript desabilitado:** todo conteúdo visível e legível. Regra dura: estado inicial dos elementos é visível; GSAP apenas aprimora (nunca `opacity: 0` no CSS base esperando o JS revelar).

## Testes e critérios de pronto

Sem suíte de testes unitários (não se justifica para one-pager estático). Verificação = build do Astro + checklist abaixo + passes de screenshot (Playwright, 1440px e 390px, PT e EN).

**Checklist final:**
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95
- [ ] Contraste AA em todo texto
- [ ] Paridade PT/EN completa + `hreflang` correto
- [ ] Formulário testado com envio real
- [ ] Sem scroll horizontal em 390px, 768px e 1440px
- [ ] `prefers-reduced-motion` e no-JS verificados

## Decisões registradas

| Decisão | Escolha |
|---|---|
| Objetivo do site | Presença institucional |
| Atuação da empresa | Híbrido: serviços + produto próprio |
| CarbonTrace | Plataforma de créditos de carbono |
| Identidade visual | Criada do zero (via impeccable) |
| Vibe | Cappen: dark, bold, animado |
| Escopo | One-pager |
| Idiomas | PT-BR + EN |
| Contato | Formulário (Web3Forms) + mailto fallback |
| Stack | Astro 5 + Tailwind 4 + GSAP, deploy Vercel |
