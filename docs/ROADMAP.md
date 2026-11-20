# Portfolio World roadmap

## Phase 1 — Foundation (this pull request)
- [x] Replace the single-file dependency with modular Next.js App Router architecture
- [x] Preserve the pixel-game aesthetic and major interactions from the theme reference
- [x] Populate projects from real public GitHub repositories, no fictional demo URLs
- [x] Add project detail routes, search/filter UI, career information, world map and game
- [x] Add mobile navigation, palette, dark theme, persistence and loading/error states
- [x] Add metadata, OG image, sitemap, robots and GitHub CI
- [x] Implement an honest contact fallback with no paid backend

## Phase 2 — Content and credibility
- [x] Audit featured case-study claims against source-repository READMEs
- [x] Include repository-hosted artwork/screenshots where actually present
- [x] Add a local interactive developer console and more visual polish
- [x] Add two additional GitHub-backed case studies
- [ ] Supply approved personal photo/illustration and more original project screenshots
- [ ] Confirm precise professional role descriptions, dates and relevant public work
- [ ] Add verified production URLs (only when live)
- [ ] Provide a current resume PDF for a download button
- [ ] Add meaningful outcomes and measurable impact where evidence exists
- [ ] Add LinkedIn or other profiles after confirming the correct URLs

## Phase 3 — Advanced interaction
- [x] Expand the platformer into three themed levels with checkpoint saves per world
- [x] Add a level selector and distinct level scenery, keeping sound user-enabled and default-muted
- [x] Make portfolio world secrets discoverable without blocking standard navigation
- [x] Improve keyboard support, focus trapping/restoration, and direct links to all game portals
- [ ] Complete hands-on mobile and screen-reader acceptance tests as part of Phase 4

## Phase 4 — Production optimization
- [ ] Run Lighthouse and Web Vitals on a deployed preview (independent browser audit pending)
- [x] Add Playwright desktop/mobile navigational and keyboard/touch smoke tests to CI
- [ ] Verify live desktop/mobile flows and Canvas touch gameplay against the preview
- [ ] Audit contrast in both themes and with reduced-motion enabled
- [x] Add a bounded content security policy and baseline browser security headers
- [x] Commit the v3 npm lockfile and add scheduled security auditing plus a high-severity production dependency gate
- [x] Add automated checks for navigation, sitemap and canonical metadata
- [x] Verify the 10 published public GitHub repository URLs (2026-11-20)
- [ ] Independently verify any external live demo domains
- [ ] Add free email delivery only if a robust, abuse-resistant backend is needed

## Principles
- Keep the conventional portfolio accessible even if JavaScript/gameplay is unavailable.
- Don't fake metrics, employment claims, customer testimonials or live demo links.
- Favor static content and zero paid dependencies until a feature needs more.
- Merge only after CI and a manual browser review pass.

## Phase 5 — Project discovery & showcase
- [x] Add local-only project bookmarking without an account or backend
- [x] Add project sorting and saved-project filtering
- [x] Create a side-by-side comparison workbench for up to three projects
- [x] Allow sharing a reproducible comparison via a query-string URL
- [x] Validate and ignore unknown bookmarked/shared project slugs
- [x] Add browser acceptance tests for the save, compare, reload and share flows
- [ ] Confirm any additional public case-study artwork and measurable outcomes with the portfolio owner


## Phases 6–12 — Interactive portfolio upgrade (development branch)
- [x] Phase 6: CSS-based, keyboard-friendly interactive developer room with discoverable destinations
- [x] Phase 7: recruiter-focused career route and printable, source-backed profile
- [x] Phase 8: conceptual stack overview, section navigation and case-study depth
- [x] Phase 9: reduced-motion and print support, static content and tests (real Lighthouse/accessibility audit pending)
- [x] Phase 10: skill-to-project universe without arbitrary proficiency scores
- [x] Phase 11: private device-local visitor achievements
- [x] Phase 12: transparent deterministic assistant backed by published portfolio data
- [ ] Supply an owner-approved original resume to offer an actual downloadable resume file
- [ ] Run real assistive-technology and Lighthouse/Web Vitals acceptance against staging

## Phase 13 — Production readiness and audits
- [x] Audit all ten documented GitHub repositories for public availability
- [x] Add canonical URLs for all first-level pages
- [x] Fix navigation reachability at intermediate laptop widths
- [x] Apply global reduced-motion safeguards and consider offscreen rendering
- [x] Add axe-core WCAG 2.1 A/AA automated browser audits
- [x] Add repeatable Lighthouse mobile/desktop lab measurements with archived JSON
- [x] Add scoped npm vulnerability scanning and lockfile bootstrap workflow
- [x] Validate the generated lockfile and convert CI installs to npm ci
- [ ] Review axe/Lighthouse findings and fix remaining significant deficiencies (contrast and home CLS under active remediation)
- [ ] Stage exact passing commit for manual responsive, keyboard, and screen-reader review

- [x] Self-host the original DM Sans and Press Start 2P fonts from open-license Fontsource packages; remove third-party font requests and constrain font CSP to self

- [x] Add diagnostic axe output for exact failed foreground/background combinations to speed up theme contrast remediation

- [x] Eliminate the reveal animation that lowered rendered text opacity to 45% and violated WCAG contrast before scroll
