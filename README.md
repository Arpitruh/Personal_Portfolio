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

## Phase 4 browser acceptance

Run `npm run build && npm run test:e2e` after `npm install` (Playwright installs Chromium using `npx playwright install chromium`). The browser tests start the built Next.js server, exercise desktop/mobile navigation, inspect production metadata and keyboard controls, and confirm that the gameplay exposes direct project links without requiring Canvas interaction. CI installs Linux browser dependencies and uploads failure traces/screenshots. This does **not** replace manual performance profiling or testing with real assistive technology.

## Phase 5: save and compare projects
The Projects page includes a device-local **Saved quests** list and a three-project comparison workbench. Save state uses browser local storage; no login or service receives it. Compare selections are encoded in the page URL (e.g. `/projects?compare=cacheloom,leadloop-crm`) so visitors can share a specific set of case studies. Unknown slugs are ignored; no arbitrary content is fetched from the query string. If clipboard access is blocked, the current browser URL remains available for manual copying.

## Phases 6–12 · Discover, evaluate and explore
The development branch adds an interactive room (`/room`), a clean recruiter profile (`/recruiter`), skill-to-project explorer (`/skills`), local achievement board (`/achievements`), and a rule-based portfolio guide (`/assistant`). Case studies now group the *documented* technology stack into a conceptual architecture view without claiming private implementation knowledge.

Recruiter mode is **print-to-PDF via the browser** rather than a fabricated downloadable PDF: replace it with a supplied, verified original when available. The assistant is a deterministic local content search, **not an external LLM or a live agent**. Badges and saved projects are device-local. See [the implementation plan](docs/PHASES_6_TO_12.md). No additional hosted service is required.

## Phase 13 quality audits
Run `npm run check`, `npm run test:e2e`, `npm run audit:security`, and `npm run audit:lighthouse` (the latter starts the built Next.js server on port 3100 and requires installed Playwright Chromium). CI saves Lighthouse JSON results and browser-test artifacts for review. Lighthouse scores are simulated lab measurements, not real-user CrUX/Web Vitals data. Axe-core catches a subset of WCAG issues; manual screen-reader, contrast, and keyboard review is still necessary. The staging deployment uses preview protection and is not promoted until reviewed.

The npm lockfile is generated on the existing development branch by a tightly scoped GitHub workflow whenever the dependency manifest changes; CI subsequently uses the committed lockfile for reproducibility. A weekly dependency-security audit runs without creating update branches.

The original fonts are self-hosted from the free SIL OFL Fontsource npm packages. Browser requests no longer depend on Google Fonts/CDN access; changes to their npm versions require regenerating and committing the lockfile on the existing development branch.

## Phase 14 · Content editing without touching code

**Editor:** [Pages CMS](https://app.pagescms.org) → sign in using GitHub → authorize `Arpitruh/Personal_Portfolio` → select **`feat/portfolio-world-nextjs`**. This GitHub App connection must be approved by the repository owner; no credentials are stored in the portfolio. The schema is in `.pages.yml`.

The editor offers:
- **Public profile:** headline, location, role and bio in `content/site.json`.
- **Experience:** add roles or edit dates, employers and job descriptions in `content/experience.json`.
- **Projects:** create or edit `content/projects/<slug>.json`. The filename and slug must agree. Change `featured` to add/remove a homepage card. The compiler will generate project listings, detail pages and navigation from this folder.
- **Skills/milestones:** edit structured lists; they feed the skills universe and timeline.
- **Beyond the Code:** `content/life.json` contains a small public personal introduction and optional hobby cards. No hobbies or photos are invented. **Real and illustrated portrait photography are intentionally postponed to Phase 15.**
- **Social profiles:** edit `content/socials.json` (add confirmed Unsplash, Instagram, LinkedIn or other HTTPS links, toggle `visible`). Unverified accounts aren't published.
- **Resume:** upload an *approved* PDF to the CMS resumes media folder and select it in `content/resume.json`. The recruiter page automatically displays its download button; otherwise browser Print / Save as PDF remains available.

**Publication workflow:** all CMS edits go to the **existing development branch**, triggering its usual Vercel preview and GitHub CI. Review the draft PR, then explicitly merge to `main` and deploy production when approved. No new branches, database, special API tokens or paid service are necessary. CMS edits are not silently published to production.

**Privacy:** resumes uploaded to `public/uploads/resumes` become publicly downloadable when merged. Do not upload private addresses, phone numbers, ID documents or confidential employer details. Replacing a file does not erase previous Git history; avoid uploading any sensitive PDF, and delete old published file entries when you rotate the active document. The repository's public history may retain previous copies.

**When using the repo locally:** `npm ci`, `npm run dev`, `npm run check`; project catalog is generated with `npm run content:validate` and automatically on builds/typechecks/tests. The generated JSON is not the CMS source of truth. Only edit `content/` files.

### Resume editor setup

The PDF picker in **Current resume** uses the named `resumes` media source (`public/uploads/resumes`) and only accepts PDF documents. The upload directory is tracked in Git with a `.gitkeep` file so the CMS can browse the source before the first upload. Select an existing PDF or upload an approved one; the saved path should be `/uploads/resumes/<filename>.pdf`. If the file selection screen fails in the CMS after refreshing, record the exact error or console message rather than uploading sensitive files through a workaround.

## Phase 15 — Personal Visual Identity
In Pages CMS (development branch), use **Portraits and personal photo gallery** to manage the optional real portrait, matching 2D illustration and a curated photo diary. All media is served from `public/uploads/images`, not a paid image host.

- **Real portrait:** add a publicly shareable image and accurate alt text; appears on About, and as a companion to the illustration in Beyond the Code.
- **Illustrated self:** upload a reviewed, theme-matched character illustration with alt text; appears in the homepage scene and on Beyond the Code.
- **Moments:** add an image, title, description, category and toggle **Approved for public display**. Hidden or incomplete entries will not be published.
- **No assets uploaded yet:** existing pixel-avatar fallback remains, and an honest empty-gallery state is shown. No stock photos, face swaps or invented personal details.
- **Privacy:** do not upload home addresses, ID documents, geotagged private images, bystanders without consent, or sensitive photos. Uploaded assets and commit history are public once merged. Compress originals for web and remove EXIF metadata before upload.

New pictures require owner review and publishing through the regular staging → PR → production flow. The visual components and CMS entries are not dependent on an external API.
