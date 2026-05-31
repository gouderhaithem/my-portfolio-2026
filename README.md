# Gouder Haithem — Portfolio

Next.js 14 (App Router, TypeScript) rebuild of the standalone portfolio.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve production build
```

## Production domain

Change `https://gouderhaithem.com` in:
- `app/layout.tsx` — `metadataBase`, `alternates.canonical`, all `openGraph.url` / `twitter.images` values
- `app/sitemap.ts` — `url` field
- `app/robots.ts` — `sitemap` URL

## Contact form endpoint

`app/api/contact/route.ts` currently logs submissions. Wire your email provider there:

```ts
// Resend example:
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({ from: '...', to: 'gouderhaithem@gmail.com', ... })
```

Set your API key in `.env.local`:
```
RESEND_API_KEY=re_xxxxx
```

## Tweaks panel

Press `T` on desktop to open the live tweaks panel (accent color, hero shape, grain, particles, motion intensity).

## Architecture

| File | Role |
|---|---|
| `app/layout.tsx` | Root layout — fonts (Geist, Instrument Serif), metadata, JSON-LD |
| `app/globals.css` | All CSS — design tokens, animations, responsive breakpoints |
| `app/page.tsx` | Page HTML structure (server component) |
| `components/PortfolioInit.tsx` | All client-side JS: Three.js scene, GSAP, Lenis, cursor, form |
| `app/api/contact/route.ts` | Contact form POST endpoint |
| `app/robots.ts` / `app/sitemap.ts` | SEO crawl files |
| `app/manifest.ts` | PWA manifest |
| `app/opengraph-image.tsx` | Auto-generated OG image |
