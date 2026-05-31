# Claude prompt — rebuild this portfolio in Next.js (1:1, SEO-optimized)

Copy everything below the line into Claude (Claude Code works best, since it can create files and run the dev server). Paste your existing `portfolio.html` and `portfolio.js` alongside it so Claude has the source of truth.

---

You are a senior front-end engineer. Rebuild an existing single-page portfolio as a **Next.js 14 (App Router, TypeScript) project**. I will paste the original `portfolio.html` and `portfolio.js`. **Reproduce it pixel-for-pixel and behavior-for-behavior — no creative changes, no "improvements," no omissions.** Every color, font, animation, SVG, string, and interaction must match the original exactly. Then add best-in-class SEO targeting people searching for a **software developer / engineer in Algeria**.

## Hard rules
- **Do not change any copy, layout, spacing, colors, or animations.** If the original says "Four years of considered software work," yours says exactly that. Same for every SVG path, every project card, every form label.
- **Same dependencies, same versions:** `three@0.160.0`, `gsap@3.12.5` (+ ScrollTrigger), `lenis@1.1.13`. Install via npm, do **not** keep the CDN `<script>` tags.
- Keep the exact design tokens (CSS custom properties), fonts (Instrument Serif, Geist, Geist Mono via `next/font` or the same Google Fonts link), the custom cursor + trail, the WebGL background scene, the loading veil, the Tweaks panel, the custom dropdowns, and the contact form behavior.
- It must look **identical** at every breakpoint (the original has `@media` rules at 1100px, 900px, 860px, 720px, 480px — keep them all).

## Architecture
- App Router: `app/layout.tsx` (metadata + fonts + global wrappers), `app/page.tsx` (the page).
- All the Three.js / GSAP / Lenis logic from `portfolio.js` goes into a **client component** (`"use client"`), initialized inside `useEffect` so it only runs in the browser. Guard against double-init in React Strict Mode (use a ref flag) and **clean up** on unmount (cancel rAF, dispose renderer/geometries/materials, destroy Lenis, kill ScrollTriggers).
- Put the giant `<style>` block into `app/globals.css` verbatim (keep the CSS variables under `:root`). Don't convert to Tailwind/CSS-modules unless it stays byte-identical visually.
- The inline SVGs in the Work cards and Service icons: keep them exactly — render as JSX (lowercase attributes become camelCase where required: `stroke-width` → `strokeWidth`, `stroke-linecap` → `strokeLinecap`, etc.) but identical geometry, fills, gradients, `<animate>` blink caret, the `<pattern>` dot grid, all of it.
- The custom cursor relies on `body { cursor: none }` and mouse-tracking — keep it, including the `@media (pointer: coarse)` fallback that re-enables the native cursor on touch.
- Keep the host-protocol `postMessage` "tweaks-mode" listener and the `T` key toggle as-is.

## Exact content to preserve (verbatim)
- **Name / brand:** Gouder Haithem · nav brand "G.H. · '26" · title "Gouder Haithem — Software Engineer".
- **Hero:** coordinates line "N 36.7°  E 3.0°  ·  Algiers", "Portfolio / vol. iv", animated headline "GOUDER HAITHEM" (per-character blur-in), role line, two CTAs ("Start a project" / "See services"), scroll cue.
- **Nav:** About / Services / Work / Skills / Contact, status pill "Available · Q3 2026", mobile burger.
- **About:** "01 — About", "Four years of *considered* software work.", both lead paragraphs, three stats (4+ years building / Web · CRM · ERP / Algiers).
- **Services:** "02 — Services", three cards — Websites & web apps, CRM platforms, ERP systems — with their exact icons, descriptions, and bullet lists.
- **Work:** "03 — Selected Work", three projects (Halcyon, Driftboard, Loom) with exact meta text, outcome lines, full SVG previews, and tech-stack chips.
- **Skills:** "04 — Toolkit", "The *constellation*.", the four category rows (Languages / Runtime / Frontier / Interface) with exact values.
- **Contact:** "05 — Contact", "Let's *talk.*", sub paragraph, the full form (name, email, Project type dropdown, Budget (DA) dropdown with the DA ranges, message, status line, "Reply within 12h · NDA on request", "Send message" button), the "Or reach out directly" divider, email `gouderhaithem@gmail.com`, GitHub `https://github.com/gouderhaithem`, LinkedIn `https://dz.linkedin.com/in/gouder-h-689164244`.
- **Footer:** "© 2026 · Gouder Haithem", "Built in a terminal, finished by hand.", "Algiers · Remote".
- **Tweaks panel:** Accent swatches (#7c5cff, #0071e3, #f97316, #4ade80), Hero object (Gem/Knot/Dodeca), Grain slider, Particle density slider, Motion intensity (Calm/Default/Wild) — all wired exactly as in `portfolio.js`.
- **Contact form:** keep the client-side validation + simulated send (setTimeout, "✓ Sent. I'll reply within 12 hours."). Optionally wire it to a real endpoint via a Next.js Route Handler (`app/api/contact/route.ts`) — but keep the UX identical.

## SEO — make it rank for "developer / software engineer in Algeria"
Implement all of the following. Keep it honest and consistent with the site content.

1. **Metadata API** in `app/layout.tsx` using Next's `Metadata`:
   - `title`: default `"Gouder Haithem — Software Engineer in Algeria"` + a `template` like `"%s · Gouder Haithem"`.
   - `description`: ~150 chars, e.g. *"Gouder Haithem is a software engineer in Algiers, Algeria building high-performance websites, custom CRM, and ERP systems. Available for remote and local projects."*
   - `keywords`: software engineer Algeria, developer Algeria, développeur Algérie, web developer Algiers, CRM developer Algeria, ERP developer Algeria, Next.js developer Algeria, freelance developer Algiers, مطور برمجيات الجزائر.
   - `metadataBase`, `alternates.canonical`, and `alternates.languages` (`en`, `fr-DZ`, `ar-DZ`) if you add locales.
   - Open Graph (`type: website`, locale `en_DZ`, title, description, `url`, `siteName`, and an `images` entry — generate an OG image via `app/opengraph-image.tsx` using `next/og` ImageResponse, dark bg + violet accent matching the brand).
   - Twitter card (`summary_large_image`).
   - `robots`: index, follow, max-image-preview large.
2. **JSON-LD structured data** injected via a `<script type="application/ld+json">`:
   - A `Person` schema: name "Gouder Haithem", jobTitle "Software Engineer", `address` with `addressLocality: "Algiers"`, `addressCountry: "DZ"`, `email`, `sameAs` = [GitHub, LinkedIn URLs], `knowsAbout` = [Web development, CRM, ERP, Rust, TypeScript, Next.js].
   - A `ProfessionalService` / `LocalBusiness`-style schema with `areaServed: "Algeria"` and the three service offerings (Websites, CRM, ERP) as `hasOfferCatalog`.
   - A `WebSite` schema.
3. **Semantic HTML for crawlability:** the headline must be a real `<h1>` containing the text "Gouder Haithem" (the per-letter spans are fine, but ensure the accessible name and a crawlable text node read "Gouder Haithem — Software Engineer in Algeria"; you can use a visually-hidden `<h1>` if the animated one is decorative). Section `<h2>`s for About/Services/Work/Skills/Contact. Add descriptive `alt`/`aria-label`s. The original uses `cursor:none` and decorative canvas — make sure all real content is in the DOM as text, not just canvas.
4. **`app/robots.ts`** and **`app/sitemap.ts`** (Next file conventions) exposing `/robots.txt` and `/sitemap.xml`. Set the production domain (ask me for it; placeholder `https://gouderhaithem.com`).
5. **Performance / Core Web Vitals** (these are ranking signals):
   - Self-host fonts with `next/font` and `display: swap`; preload the display font.
   - Lazy-init the WebGL scene after first paint; respect `prefers-reduced-motion` (skip or scale down the heavy animation when set).
   - Add `<link rel="preconnect">` only if still using Google Fonts; otherwise none.
   - Ensure no layout shift from the loading veil.
6. **PWA-ish niceties:** `app/manifest.ts` (name, theme color `#0a0a0f`, icons), favicon set.
7. **Accessibility passes** (also helps SEO): labels tied to inputs, focus-visible states, `aria-expanded` on dropdowns (already present), color-contrast intact.

## Deliverables
1. A complete, runnable Next.js project (`package.json`, `next.config.js`, `tsconfig.json`, `app/`, `components/`, `public/`).
2. The page rendering **identically** to the original at desktop and mobile.
3. All SEO files above wired and validating (test the JSON-LD in Google's Rich Results Test mentally; no schema errors).
4. A short `README.md` with run instructions (`npm i`, `npm run dev`), where to set the production domain, and where to wire the contact endpoint.

When you're unsure about a detail, **match the original file exactly rather than guessing.** Start by restating your file plan, then generate the files.

---

### Tips for using this prompt
- Paste the **actual `portfolio.html` and `portfolio.js`** contents right after the prompt — Claude reproduces far more accurately from the real source than from description alone.
- Tell Claude your **real production domain** and whether you want **French/Arabic locales** (big win for Algeria SEO — French especially).
- After it builds, ask it to run `npm run build` and fix any SSR/"window is not defined" errors (Three/GSAP/Lenis must be client-only).
