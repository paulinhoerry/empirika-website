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
