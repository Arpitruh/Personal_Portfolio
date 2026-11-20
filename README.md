# Arpit's Portfolio World ✦

A full Next.js portfolio inspired by the original **Mario-like HTML prototype**, reimagined as a modular, responsive, accessible experience. This is a real application, not a single-file template.

## Experience

- **Home:** character-led pixel-art hero, selected projects, explorable map, experience, skill inventory and contact CTA.
- **World:** six clickable locations, keyboard-friendly native controls and progress saved locally.
- **Play:** custom Canvas platformer with coins, enemies, pipes that open project previews, lives, scores, touch controls and an optional sound toggle.
- **Projects:** searchable/category-filterable repository-backed projects and individual case-study routes; original repository visuals are copied into local public assets with provenance captions, avoiding runtime GitHub image dependencies.
- **About:** authentic work history, technical stack and timeline.
- **Now:** curated in-progress work with direct repository links.
- **Developer console:** an accessible, local-only mini command explorer with help, skills, projects and `open <slug>` shortcuts (never executes real shell commands).
- **Contact:** honest, no-backend mailto workflow when an address is provided; GitHub fallback otherwise.
- **Global:** day/night theme, Ctrl/⌘+K navigation, subtle progressive-enhancement motion, route loading skeleton, responsive navigation, custom 404 and error states, Open Graph image, sitemap and robots.txt.

The original `Your Name _ Portfolio World.html` remains in the repository **as a design reference only**. It is not loaded by the application.

## Stack

Next.js 16 (App Router), React 19, TypeScript, CSS variables, Canvas 2D API. No paid infrastructure, authentication, database or service is required.

## Run locally

Requires Node.js 22+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Commands:

```bash
npm run typecheck
npm test
npm run build
npm run check
```

## Set up your public site

1. Import `Arpitruh/Personal_Portfolio` into Vercel as a Next.js project, root directory `.`.
2. Set `NEXT_PUBLIC_SITE_URL` to the public origin (for example `https://portfolio.example.com`). This controls canonical URLs and sitemap entries.
3. **Optional:** Set `NEXT_PUBLIC_CONTACT_EMAIL` to an inbox you explicitly want to publish. Until then, the contact page links to GitHub instead of pretending to send a message.
4. Deploy. No other environment variables or paid services are necessary.

> The contact form uses `mailto:` to open the visitor's email client. It does **not** send from a server or persist messages. Add a server-based delivery service only if you later need it.

## Edit the content

All portfolio content, project links, project status, skills, bio and experience live in **`src/data/portfolio.ts`**. No text is fetched from GitHub at request time, which keeps the site predictable, fast and rate-limit free.

Use `featured: true` to show a project on the homepage. Each project needs a unique `slug`, valid `github` URL, categories, case-study sections and a truthful status. Add a `live` link only after the deployment is verified. Never publish customer-confidential data, personal secrets or unverified performance numbers.

Pixel-world navigation lives in `src/components/world-map.tsx`; the hand-drawn game lives in `src/components/portfolio-game.tsx`. Design tokens and responsive styles live in `src/app/globals.css`.

## Project layout

```text
src/
  app/
    about/            About and work history
    contact/          Contact entry
    now/              Current projects
    play/             Canvas game
    projects/         Filterable work and [slug] case studies
    world/            Explorable world map
    layout.tsx        Metadata and shared shell
    globals.css       Theme and pixel-art design
  components/
    site-shell.tsx    Navigation, theme and command palette
    pixel-landscape.tsx
    portfolio-game.tsx
    world-map.tsx
    project-card.tsx
    project-explorer.tsx
    interactive-terminal.tsx
    contact-form.tsx
  data/portfolio.ts   Single content source of truth
tests/
  content.test.mjs     Project data integrity
.github/workflows/
  quality.yml         Typecheck, test and build on PRs
```

## Quality and accessibility

- Semantic landmarks, a skip link, accessible buttons, clear focus states and reduced-motion support.
- Project pages pre-render from static metadata.
- Mobile touch controls for the Canvas game (the map also works with normal buttons).
- GitHub CI checks TypeScript, content tests and Next build.
- Security headers disable MIME sniffing and framing, without requiring a backend.
- All project illustrations are decorative CSS/emoji artwork; no unlicensed screenshots.

## What's next

See [docs/ROADMAP.md](docs/ROADMAP.md) for future upgrades such as real screenshots, a verified resume PDF, editorial notes, end-to-end tests and optional email delivery.

---

Built by Arpit Yadav · [GitHub](https://github.com/Arpitruh)

### Verified asset provenance

- `public/projects/gemini-clone.png`: `Arpitruh/Gemini_Clone` → `screenshot.png` on its `main` branch.
- `public/projects/sisters-magical-spoon.webp`: `Arpitruh/Sisters_Magical_Spoon` → `public/images/brand/thali.webp` on its `main` branch.

Both files are assets from the portfolio owner's repositories. Add other images only after confirming ownership and permission.

### Staging and SEO behavior

If `NEXT_PUBLIC_SITE_URL` is unset, the deployment automatically uses Vercel's injected `VERCEL_URL` (localhost only when running locally). Preview and staging builds emit `noindex` metadata and a robots disallow rule; the intended production deployment should set `NEXT_PUBLIC_SITE_URL` to its confirmed canonical domain.
