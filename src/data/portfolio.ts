import site from "../../content/site.json" with { type: "json" };
import career from "../../content/experience.json" with { type: "json" };
import tools from "../../content/skills.json" with { type: "json" };
import timeline from "../../content/milestones.json" with { type: "json" };
import projectCatalog from "../content/generated/projects.json" with { type: "json" };

export type ProjectCategory = "Products" | "Platform" | "AI" | "Frontend";
export type ProjectStatus = "Building" | "Shipped" | "Iterating";
export interface PortfolioProject {
  slug: string; title: string; kicker: string; summary: string; category: ProjectCategory;
  status: ProjectStatus; year: string; emoji: string; accent: string; stack: string[];
  github: string; live?: string; image?: { src: string; alt: string; caption: string };
  featured?: boolean; challenge: string; approach: string; highlights: string[]; next: string;
}

// These records are edited in Pages CMS on the development branch. Runtime
// environment details stay in code, and content stays statically bundled.
export const profile = {
  ...site,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000")
};
export const skills = tools.groups;
export const experience = career.roles;
export const milestones = timeline.items;
export const projects = projectCatalog as PortfolioProject[];
export const featuredProjects = projects.filter(project => project.featured);
export const projectCategories = ["All","Products","Platform","AI","Frontend"] as const;
export const getProject = (slug:string) => projects.find(project=>project.slug===slug);
