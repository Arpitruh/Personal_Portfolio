export type ProjectCategory = "Products" | "Platform" | "AI" | "Frontend";
export type ProjectStatus = "Building" | "Shipped" | "Iterating";

export interface PortfolioProject {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  emoji: string;
  accent: string;
  stack: string[];
  github: string;
  live?: string;
  /** Verified image or illustration located in the project's public repository. */
  image?: { src: string; alt: string; caption: string };
  featured?: boolean;
  challenge: string;
  approach: string;
  highlights: string[];
  next: string;
}

export const profile = {
  name: "Arpit Yadav",
  initials: "AY",
  role: "Software Engineer · Frontend",
  headline: "I build interfaces that feel alive.",
  location: "Noida, India",
  summary: "Frontend engineer focused on thoughtful products, expressive interfaces and useful developer tools. I work primarily with React, Next.js and TypeScript.",
  github: "https://github.com/Arpitruh",
  // Public contact email is intentionally opt-in; never publish a personal inbox by accident.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"
};

export const skills = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Accessibility"] },
  { group: "Data & state", items: ["TanStack Query", "React Hook Form", "Zod", "Context API", "REST APIs"] },
  { group: "Backend & systems", items: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis concepts", "WebSockets"] },
  { group: "Workflow", items: ["Git & GitHub", "Vercel", "Docker", "CI/CD", "WSL", "Figma"] }
] as const;

export const experience = [
  {
    company: "mFilterIt",
    role: "Software Engineer · Frontend",
    period: "2025 — Present",
    description: "Building production-facing product experiences with Next.js, React and TypeScript. Work spans dashboards, reporting, user management, configurations and BRAND workflows.",
    tags: ["Next.js", "TypeScript", "React Query", "Design systems"]
  },
  {
    company: "Fortum Charge & Drive India (GLIDA)",
    role: "Development internship",
    period: "Earlier experience",
    description: "Worked on dashboards, role-based user experiences, testing and debugging in an EV-charging product environment.",
    tags: ["Dashboards", "Testing", "Role-based UI"]
  }
] as const;

export const milestones = [
  { label: "2024", title: "Graduated", description: "B.Tech in Computer Science." },
  { label: "BUILD", title: "From experiments to products", description: "Built with React, Next.js, Node.js and real-time web tooling." },
  { label: "NOW", title: "Shipping better experiences", description: "Working across frontend architecture, product UI and independent SaaS ideas." }
] as const;

export const projects: PortfolioProject[] = [
  {
    slug: "cacheloom",
    title: "CacheLoom",
    kicker: "Developer infrastructure",
    summary: "A reusable caching and job-queue service with TTL keys, PostgreSQL persistence, API keys and a JavaScript SDK.",
    category: "Platform", status: "Building", year: "2026", emoji: "🧵", accent: "mint",
    stack: ["Node.js", "PostgreSQL", "REST API", "Docker"],
    github: "https://github.com/Arpitruh/CacheLoom", featured: true,
    challenge: "Independent projects often need a dependable caching layer without committing to a paid managed service.",
    approach: "Build and evolve a reusable cache service with clear operational boundaries and straightforward integration points.",
    highlights: ["Key-value operations with TTL, NX/XX and counters", "Persistent PostgreSQL-backed mode alongside in-memory mode", "Project API keys, job queues and a JavaScript worker SDK", "Readiness endpoints, recovery simulations and CI smoke tests"],
    next: "Currently at the experimental v1.0.0-rc.1 milestone; continue operational hardening before production use."
  },
  {
    slug: "leadloop-crm",
    title: "LeadLoop CRM",
    kicker: "Customer relationships",
    summary: "A CRM product for managing leads, pipelines and follow-up workflows in one place.",
    category: "Products", status: "Building", year: "2026", emoji: "📇", accent: "peach",
    stack: ["Next.js", "TypeScript", "Prisma", "Better Auth"],
    github: "https://github.com/Arpitruh/LeadLoop-CRM", featured: true,
    challenge: "Lead tracking fragments across tools when status, ownership and follow-ups aren't connected.",
    approach: "Shape a focused workspace around the core CRM loop, from lead capture to pipeline management.",
    highlights: ["Multi-tenant owner/staff workspaces and invitations", "Contacts, leads, notes, tasks and Kanban pipeline", "Public forms, reporting and signed partner ingestion", "Prisma migrations and multi-layer automated test suite"],
    next: "Expand and harden the core CRM experiences."
  },
  {
    slug: "auth-service",
    title: "Auth Service",
    kicker: "Identity as a service",
    summary: "A reusable authentication service with session management and application-oriented workflows.",
    category: "Platform", status: "Iterating", year: "2026", emoji: "🔐", accent: "violet",
    stack: ["Express", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com/Arpitruh/Auth-Service", featured: true,
    challenge: "Rebuilding sign-in, sessions and account flows in every application creates needless complexity.",
    approach: "Centralize identity workflows and improve their reliability, observability and application management.",
    highlights: ["Refresh-token rotation and reuse detection", "Password reset and session management", "Application isolation and optional operator dashboard", "OIDC/PKCE foundation with documented configuration gates"],
    next: "Keep improving resilience and developer experience."
  },
  {
    slug: "open-job-pulse",
    title: "Open Job Pulse",
    kicker: "Career workflow SaaS",
    summary: "A workspace for discovering, prioritizing and tracking job opportunities.",
    category: "Products", status: "Building", year: "2026", emoji: "🛰️", accent: "blue",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com/Arpitruh/open-job-pulse", featured: true,
    challenge: "Job hunting wastes time across discovery, repetitive screening and manual application tracking.",
    approach: "Bring matches, qualification signals, application stages and skills insights into one product flow.",
    highlights: ["Job match and priority concepts", "Kanban-style tracking", "Skills-gap and analytics views"],
    next: "Validate product flows and improve reliability before a wider launch."
  },
  {
    slug: "gemini-clone",
    title: "Gemini Clone",
    kicker: "Conversational AI",
    summary: "A browser-based Gemini-inspired AI interface built with HTML, CSS and JavaScript.",
    category: "AI", status: "Shipped", year: "2025", emoji: "✨", accent: "yellow",
    stack: ["HTML", "CSS", "JavaScript", "UI"],
    github: "https://github.com/Arpitruh/Gemini_Clone",
    image: { src: "/projects/gemini-clone.png", alt: "Screenshot of the Gemini Clone interface from the project repository", caption: "Actual interface screenshot · Gemini_Clone repository" },
    challenge: "Explore how a polished AI chat interface can be assembled with browser-native frontend tools.",
    approach: "Build a responsive web interface using vanilla HTML, CSS and JavaScript. The repository currently shows a demo-style implementation and requires the developer to configure an API key; it is not described as a production-safe hosted API proxy.",
    highlights: ["Vanilla JavaScript UI", "Custom styling and layout", "Repository includes an actual screenshot"],
    next: "Move any secret-bearing AI API requests behind a server endpoint before publishing a public demo."
  },
  {
    slug: "resume-generator",
    title: "Resume Generator",
    kicker: "Practical web tooling",
    summary: "A resume builder with structured forms, validation and PDF export.",
    category: "Frontend", status: "Shipped", year: "2025", emoji: "📄", accent: "mint",
    stack: ["React", "Chakra UI", "React Hook Form", "PDF"],
    github: "https://github.com/Arpitruh/Resume_gen",
    challenge: "Writing and formatting a resume should not demand a design tool.",
    approach: "Turn resume sections into guided forms and generate an exportable document from the entered data.",
    highlights: ["Validated resume sections", "Context-driven form state", "PDF export"],
    next: "Refine templates and print consistency."
  },
  {
    slug: "sisters-magical-spoon",
    title: "Sisters Magical Spoon",
    kicker: "Small business website",
    summary: "A playful food-business website with an admin experience and a custom visual identity.",
    category: "Frontend", status: "Iterating", year: "2026", emoji: "🥘", accent: "peach",
    stack: ["Web UI", "Responsive design", "Admin workflows", "Vercel"],
    github: "https://github.com/Arpitruh/Sisters_Magical_Spoon",
    image: { src: "/projects/sisters-magical-spoon.webp", alt: "Illustrated thali artwork used by the Sisters Magical Spoon website", caption: "Original brand artwork · Sisters_Magical_Spoon repository" },
    challenge: "A small food brand needs a memorable storefront without a difficult administration workflow.",
    approach: "Balance an expressive food-focused design with straightforward content and admin interactions.",
    highlights: ["Original food-themed branding and artwork", "Public-facing responsive pages", "Admin workflows for menu, plans and gallery content", "Vercel Blob integration documented as optional"],
    next: "Continue visual polish and usability improvements."
  },
  {
    slug: "notification-service",
    title: "Notification Service",
    kicker: "Cross-app communication",
    summary: "A reusable notification API and worker with templates, background processing and audit records.",
    category: "Platform", status: "Building", year: "2026", emoji: "📨", accent: "blue",
    stack: ["Express", "TypeScript", "BullMQ", "PostgreSQL"],
    github: "https://github.com/Arpitruh/Notification-Service",
    challenge: "Separate applications need predictable delivery flows without reimplementing templates, retries and audit history.",
    approach: "Use an API and background worker with templated payloads, a queue and persistent records. The repository documents real email, mock SMS and several features still in development.",
    highlights: ["Express API and BullMQ worker", "Handlebars templates with variable validation", "PostgreSQL audit and idempotency", "Dashboard and app-scoped management work in progress"],
    next: "Complete delivery verification, opt-out controls and production hardening before treating it as a general-purpose messaging service."
  },
  {
    slug: "finance-tracker",
    title: "Finance Tracker",
    kicker: "Full-stack budgeting",
    summary: "A personal finance dashboard for transactions, spending views and monthly budgets.",
    category: "Products", status: "Iterating", year: "2026", emoji: "💸", accent: "yellow",
    stack: ["React", "Express", "MySQL", "JWT"],
    github: "https://github.com/Arpitruh/Finance-Tracker",
    challenge: "Personal finance data is easier to understand when transactions, budgets and spending patterns sit together.",
    approach: "Build separate React and Express layers with MySQL data storage and protected account routes.",
    highlights: ["Income and expense tracking", "Monthly budget targets and progress views", "Search and filter by date or category", "JWT-protected API routes documented in the repository"],
    next: "Polish validation, data quality and the experience on smaller screens."
  },
  {
    slug: "job-dashboard",
    title: "Job Dashboard",
    kicker: "Personal operations",
    summary: "An experiment in bringing job-search tracking and external sheet data into a clearer dashboard.",
    category: "Frontend", status: "Iterating", year: "2026", emoji: "📊", accent: "violet",
    stack: ["JavaScript", "Dashboard UI", "Google Sheets"],
    github: "https://github.com/Arpitruh/job-dashboard",
    challenge: "Job search data becomes hard to act on when it is scattered across spreadsheets.",
    approach: "Present the useful information in a compact dashboard, including sheet-sourced data.",
    highlights: ["Dashboard presentation", "External data exploration", "Iterative sync improvements"],
    next: "Improve robustness of data synchronization."
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
export const projectCategories = ["All", "Products", "Platform", "AI", "Frontend"] as const;
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
