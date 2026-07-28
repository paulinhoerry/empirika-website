# Empirika — Website

Site institucional da Empirika (v2). One-page cinematográfica, bilíngue (PT em `/`,
EN em `/en/`), com hero em vídeo scrubado pelo scroll, animações GSAP e formulário
de contato via Resend.

## Stack

- [Astro 5](https://astro.build) (`output: 'static'` + adapter Vercel para a rota `/api/contact`)
- Tailwind 4 (via `@tailwindcss/vite`)
- GSAP ScrollTrigger (reveals, parallax e o scrub do hero)
- Resend (envio do formulário)
- Vitest (i18n e validação do contato)

## Setup

Requisitos: Node ≥ 20.

```bash
npm install
npm run dev       # desenvolvimento em localhost:4321
npm run test      # testes unitários (vitest)
npm run build     # build de produção (dist/ + .vercel/)
npm run preview   # serve o build
```

## Variáveis de ambiente

Criar `.env` (nunca commitado):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `RESEND_API_KEY` | sim | Chave da API do Resend |
| `CONTACT_TO` | não | E-mail destino (default `paulinhoerry@gmail.com`) |
| `CONTACT_FROM` | não | Remetente (default `Empirika <onboarding@resend.dev>`; troque após verificar o domínio no Resend) |

## Hero (scroll-world / Higgsfield)

O vídeo do hero (`public/hero/journey.mp4`, 1080p, 23,75 s, sem áudio) foi gerado com a
skill [scroll-world](https://github.com/oso95/scroll-world) usando o Higgsfield CLI:
3 cenas em voo contínuo (arquitetura A — escritório dev → sala de controle de dados →
porto do Recife), geradas no `seedance_2_0_mini` a partir de frames encadeados,
concatenadas com crossfade de 0,2 s nos seams, upscaled para 1080p
(`bytedance_video_upscale`, preset aigc) e encodadas para scrub
(`crf 22, GOP 8, faststart, sem áudio`). O poster (`public/hero/poster.jpg`) é o
primeiro frame do vídeo final.

Para regenerar: instalar `@higgsfield/cli` + ffmpeg, `higgsfield auth login`,
`higgsfield workspace set <id>` e seguir a skill scroll-world (prompts das legs em
`docs/superpowers/specs/2026-07-28-empirika-v2-design.md` descrevem a jornada).
O scrub roda só em desktop (`pointer: fine` e ≥768px); mobile e
`prefers-reduced-motion` recebem o poster estático.

## Deploy (Vercel)

O adapter `@astrojs/vercel` já gera `.vercel/output`. Basta conectar o repositório na
Vercel e configurar as variáveis de ambiente acima. A rota `/api/contact` roda como
function on-demand; o resto é estático.
