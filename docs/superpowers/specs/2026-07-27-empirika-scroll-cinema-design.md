# Empirika Scroll-Cinema — Design Spec

**Date:** 2026-07-27
**Status:** Approved (user approved parts 1–3 in session)
**Base:** branch `feat/empirika-website` (site completo: Astro 5 + Tailwind 4 + GSAP, PT `/` + EN `/en/`)

## Origin

O usuário pediu para "reajustar o layout e as animações" usando a skill
[scroll-world](https://github.com/oso95/scroll-world). A skill exige a
plataforma paga Higgsfield (vídeo gerado por IA scrubbed pelo scroll); o
usuário não tem Higgsfield. Decisão registrada: **recriar a sensação de
scroll-cinema com GSAP ScrollTrigger puro** — sem vídeo IA, sem custo,
mantendo a identidade "O Manifesto de Cais" (DESIGN.md). Intensidade
escolhida: **momentos-clímax** (duas cenas pinadas com scrub) + **repaginação
das demais seções**.

## Goal

Transformar a página de "reveals discretos ao entrar na tela" em uma
experiência com dois clímax cinematográficos dirigidos pelo scroll e um ritmo
visual próprio por seção — sem trocar paleta, tipografia, copy (exceto
reestruturação mínima do About, abaixo) ou a One Green Rule.

## Part 1 — As duas cenas pinadas (desktop only)

### Cena Hero — "O cartaz no muro" (pin ≈ 2 viewport heights)

- O hero pina; o scroll scrubba a cena:
  - Linhas do título deslizam horizontalmente em velocidades levemente
    diferentes (letreiro de casco passando no cais). Deslocamento contido —
    nunca gera overflow horizontal (linhas dentro de wrapper com
    `overflow-x: clip` na seção, movimento em `xPercent` pequeno).
  - A linha de maré do rodapé do hero se desenha da esquerda para a direita
    (`scaleX`, `transform-origin: left`) atrelada ao progresso do pin.
  - As coordenadas `8°03′S · 34°52′W` fazem tick (opacity pulse discreto por
    progresso, não loop infinito).
- Saída: no último trecho do pin, as linhas do título saem por cima em
  stagger (`yPercent` negativo + opacity) — "a folha do cartaz é arrancada" —
  e a seção About chega por baixo em continuidade (sem gap visual).
- A animação de entrada atual do hero (load, não scroll) permanece.

### Cena CarbonTrace — "A maré verde sobe" (pin ≈ 2.5 viewport heights)

- A seção pina ainda em Breu. O scroll comanda, em ordem:
  1. Um painel full-bleed Mangue Escuro (`#0C2415`) **sobe como maré** por
     `translateY` (painel absoluto dentro da seção, `overflow: clip`),
     cobrindo a seção edge-to-edge. Só transform — nada de clip-path ou
     background-color animado.
  2. O display verde (`#3BE377`) revela linha a linha atrelado ao scroll
     (masked line reveal: wrapper `overflow: clip` + `yPercent`).
  3. Kicker/numeral, tagline, parágrafos e CTA entram por último (y +
     opacity, stagger por progresso).
- Estado base (sem JS / reduced-motion / mobile sem pin): a seção renderiza
  exatamente como hoje — fundo Mangue Escuro estático, tudo visível.
- One Green Rule intacta: verde e Mangue Escuro continuam existindo apenas
  dentro da seção.

## Part 2 — Repaginação das demais seções

### Sistema de numeração estêncil (espinha da página)

- `01`–`05` deixam de ser labels miúdos e viram numerais display gigantes
  tom-sobre-tom (Breu Alto `#1E1913` sobre Breu; na seção CarbonTrace, tom
  equivalente sobre Mangue Escuro), parcialmente cortados pela borda da seção
  (`overflow: clip` no contêiner; nunca overflow real da página).
- Parallax sutil no scroll (numeral anda mais devagar que o conteúdo, `y`
  scrubbed). `aria-hidden="true"` — são decorativos.

### Quem somos (`#about`)

- Copy reestruturada nos dois dicionários: `about.lead` (primeira frase,
  promovida a sentença-manifesto em headline largo) + `about.paragraphs`
  (restante em duas colunas de leitura, `columns` ou grid 2-col ≥ lg).
- Hairline de maré se desenha por scroll (`scaleX` scrubbed), substituindo o
  fade atual.

### O que fazemos (`#services`)

- Sai o grid 2×2 de cards; entra **manifesto de carga**: cada serviço é uma
  linha full-width — título condensado grande à esquerda, descrição à
  direita, hairline entre linhas que se desenha conforme o scroll.
- Hover: a linha inverte em tinta (fundo Papel, texto Breu) — transição de
  colors via CSS (hover não é animação de scroll; permitido como
  micro-interação ink-like por DESIGN.md).
- Semântica de lista preservada (`ul > li`).

### Recife (`#recife`)

- A palavra do heading em escala display tom-sobre-tom (Breu Alto) como marca
  d'água de xilogravura atrás do conteúdo, com parallax lento. Texto flutua
  por cima (contraste do texto medido contra o pior caso: sobreposto à marca
  d'água).
- Linha de meta ganha dados de porto (Porto Digital · 8°03′S · 34°52′W) — já
  existentes no copy/marcação, sem inventar dados novos.

### Contato (`#contact`)

- Mecânica do formulário intocada (ids, names, aria, contact-form.ts).
- Heading sobe para escala de cartaz; e-mail/localização viram bloco estêncil
  (labels + hairlines).

### Header / Footer

- Permanecem como estão.

## Part 3 — Arquitetura técnica

- **Tudo em `src/scripts/animations.ts`** (continua o único ponto de
  animação), organizado por cena/seção. GSAP + ScrollTrigger já instalados;
  nenhuma dependência nova.
- **Gating por matchMedia:**
  - Cenas pinadas: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`.
  - Reveals/scrubs não-pinados (hairlines, parallax, listas): todos os
    tamanhos, sob `(prefers-reduced-motion: no-preference)`.
  - Reduced-motion: zero choreografia; página estática 100% legível.
- **Progressive enhancement mantido:** nenhum estado inicial escondido por
  CSS estático; GSAP `from`/`fromTo` apenas. Sem JS a página é a versão
  estática completa.
- **Só `transform` e `opacity`** animam (constraint do DESIGN.md). O flood
  verde é um painel transladado, não background animado.
- **Âncoras × pin spacers:** ScrollTrigger insere spacers; âncoras
  (`#about`, `#carbontrace`, …) devem continuar aterrissando no lugar certo
  com `scroll-padding-top` atual. Critério de aceite explícito abaixo.
- **Mobile (<1024px):** sem pinning; as seções recebem os scrubs não-pinados
  (hairlines, parallax leve, staggers). Sem brigas com URL bar.
- **i18n:** única mudança de estrutura é `about.lead` + `about.paragraphs`
  nos dois dicionários (paridade garantida por `Dictionary = typeof pt`).
- **Refresh:** `ScrollTrigger.refresh()` após fonts prontas
  (`document.fonts.ready`) para medidas de pin corretas com as variable
  fonts.

## Out of Scope

- Higgsfield / vídeo IA / scrub de vídeo (scroll-world literal).
- Copy nova (além da divisão do About), novas seções, header/footer redesign.
- Pinning em mobile.
- Blog, cases, CMS etc. (out-of-scope da spec original permanece).

## Success Criteria

1. Duas cenas pinadas funcionam em desktop (1440/1280): pin, scrub e
   handoff contínuo, sem "pulos" e sem overflow horizontal.
2. Âncoras do header e do CTA aterrissam corretamente em todas as seções com
   os pins ativos (desktop) e sem pins (mobile).
3. `prefers-reduced-motion`: página completa, estática, sem pinning, tudo
   visível.
4. Sem JS: página completa e legível (nenhum conteúdo escondido).
5. Lighthouse mobile: performance ≥ 90 e a11y ≥ 95 nas duas rotas (hoje
   99/100 — regressão até esses pisos é aceitável, abaixo não).
6. Sem scroll horizontal em 390/768/1440.
7. Contraste AA mantido em todos os pares novos (numerais estêncil e marca
   d'água são decorativos aria-hidden; texto sobreposto à marca d'água em
   Recife medido no pior caso).
8. One Green Rule: verde continua exclusivo do CarbonTrace.
9. Formulário de contato continua funcionando (validação + estados) nas duas
   rotas.
10. `npm run build` verde, `tsc` limpo, paridade PT/EN preservada.

## Verification

- Passes de screenshot em lote (impeccable): desktop 1440 + mobile 390, PT e
  EN, incluindo estados intermediários do scrub (scroll parcial via
  Playwright).
- QA de scrub via Playwright: screenshots em posições de scroll
  antes/durante/depois de cada cena pinada; âncoras testadas com clique real.
- Lighthouse nas duas rotas ao final.
