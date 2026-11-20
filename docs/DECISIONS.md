# Technical decisions

**Why Next.js App Router?** It supports static project pages, per-route metadata, custom Open Graph images and a clean path to future content without changing the design.

**Why custom CSS?** The original one-file sample used a distinctive palette, brick/sky motifs and platform-game art. CSS variables and small reusable React components preserve that personality without introducing a UI library or a large asset bundle.

**Why rewrite the game instead of loading the original script?** The prototype mutates globals across several script blocks and dynamically inserts HTML. A React-managed game isolates rendering, controls, state and cleanup and removes the need for third-party GSAP/confetti CDNs.

**Why local progress?** Map visits and best score are low-risk convenience data, so localStorage is sufficient. No cookies, database or account is necessary.

**Why no email backend?** The portfolio has no need for persistent user data on day one. The contact form creates a local email draft only after the owner opts in to publishing an email address; this is transparent and free.

**Why manually curated project details?** Live GitHub fetching can hit anonymous rate limits, change ordering unexpectedly and reflect work-in-progress inaccurately. Curated links remain stable. The repositories are linked as sources of truth for implementation.

**What the reference HTML is not:** It is neither the site's entrypoint nor a bundled runtime dependency. It stays only as an archive of the design inspiration.
