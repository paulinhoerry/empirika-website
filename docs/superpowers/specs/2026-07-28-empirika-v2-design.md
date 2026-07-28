# Website Empirika v2 — Spec de Design

**Data:** 2026-07-28
**Branch:** `new` (árvore limpa intencionalmente; a v1 vive no `main`)
**Status:** Aprovada pelo Paulo (abordagem A, PT na raiz, sem seção HQ Recife)

## Objetivo

Novo site institucional da Empirika, software house do Recife (automação de
processos, desenvolvimento de software, websites, dashboards de dados).
Público: fundadores de startups, designers, empresas de médio porte — tom
maduro/enterprise. Bilíngue PT/EN. Estilo: dark editorial à la Code and
Theory (imagem de referência) — fundo preto, headlines gigantes em grotesk
branca com segunda linha cinza, labels em monospace uppercase, divisórias
hairline de 1px, muito espaço negativo. Referências: codeandtheory.com,
excited.agency, fantasy.co.

## Abordagem (escolhida: A)

One-page cinematográfica. Hero scroll-world (vídeo scrubado pelo scroll) no
topo; seções fluem abaixo com parallax via GSAP ScrollTrigger.
Rejeitada: multi-page enterprise (quebra a narrativa de scroll, ~2x de
trabalho, sem ganho claro).

## Stack

- **Astro 5** + **Tailwind 4** + **GSAP ScrollTrigger** (mesma stack da v1,
  já provada neste repo).
- Skill **scroll-world** (github.com/oso95/scroll-world) para o hero: mundo
  isométrico gerado no Higgsfield, 1080p, sem áudio, scrubado pelo scroll
  com o `scrub-engine.js` (framework-agnostic) da skill.
- **Resend** para o formulário de contato via endpoint server do Astro
  (`output: 'static'` + rota on-demand com adapter Vercel). Chave de API na
  variável de ambiente `RESEND_API_KEY` — nunca commitada.
- Skill **impeccable** (restaurada do `.agents/skills/impeccable` do `main`)
  para passes de refinamento de layout/tipografia.
- i18n: dicionários JSON; **PT em `/`**, **EN em `/en`**. Seletor de idioma
  no header e no footer. Alternates `hreflang` no `<head>`.

## Seções (copy 100% nova, PT + EN)

1. **Hero** — jornada scroll-world. Cadeia de cenas (proposta, ajustada
   durante a geração): escritório/código → fluxos de automação → dashboard
   de dados → porto do Recife. Headline sobreposta no estilo Code and Theory
   (linha branca + linha cinza). Master 1080p paisagem; fallback mobile
   conforme a pipeline do scroll-world (canvases portrait ou crop encodes).
2. **Capabilities** — linhas editoriais numeradas para as quatro ofertas:
   automação de processos, desenvolvimento de software, websites, dashboards
   de dados. Hover de tinta + parallax sutil.
3. **Approach** — manifesto curto para fundadores/empresas médias: como
   trabalhamos, senioridade, entrega, propriedade do código.
4. **Contact** — formulário (nome, e-mail, empresa, mensagem) postando no
   endpoint Resend; mailto visível como alternativa. Validação client-side +
   honeypot; estados de sucesso/erro nos dois idiomas.
5. **Footer** — CNPJ 66.436.862/0001-70; Avenida Rio Branco 139, Recife PE,
   50030-310 (endereço aparece apenas aqui); seletor de idioma; social.

## Sistema de animação

- Hero: scrub do vídeo gerado (engine do scroll-world, frames pré-carregados
  em canvas).
- Abaixo do hero: GSAP ScrollTrigger — offsets de parallax em mídias/
  watermarks das seções, reveal-on-scroll em headlines e linhas, momentos
  pinados só onde ajudam a narrativa.
- `prefers-reduced-motion`: vídeo vira poster estático; reveals viram fades
  simples; nenhum scroll hijacking em lugar algum (scroll nativo sempre).

## Tratamento de erros

- Endpoint de contato: valida o payload no servidor, retorna JSON de status;
  o form mostra sucesso/falha localizado; falhas do Resend são logadas e o
  usuário recebe mensagem de retry com fallback mailto.
- Hero: se vídeo/frames falharem ao carregar, cai para poster + headline
  (site permanece totalmente usável).

## Testes / verificação

- `astro build` limpo; smoke test com Playwright nos dois idiomas (seções
  renderizam, form valida, troca de idioma funciona).
- QA manual de scroll em 1440/768/390 de largura; checagem de
  reduced-motion.
- Formulário testado contra o modo de teste do Resend antes do deploy.

## Fora de escopo (YAGNI)

- CMS, blog, páginas de case study, analytics, banner de cookies (sem
  tracking), toggle dark/light (o site é dark por design), seção dedicada
  ao Recife/endereço (endereço só no footer).

## Dependências / pré-requisitos

- Higgsfield CLI instalado (`@higgsfield/cli` via npm) — **autenticado**;
  workspace "Private" (starter) com 210 créditos. Custo estimado da geração:
  ~N imagens + (2N−1) vídeos para N cenas (N≈4); calibrar custo real pelo
  CLI antes de gerar em lote.
- ffmpeg/ffprobe instalados (via Homebrew).
