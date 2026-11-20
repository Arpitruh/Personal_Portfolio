import { projects, type PortfolioProject } from "./portfolio.ts";

export const SAVED_PROJECTS_KEY = "portfolio-saved-projects-v1";
export const MAX_COMPARE = 3;
export type SortOrder = "featured" | "newest" | "alphabetical";

export function safeSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const valid = new Set(projects.map(p => p.slug));
  return [...new Set(value.filter((slug): slug is string => typeof slug === "string" && valid.has(slug)))];
}

export function parseSharedComparison(search: string): string[] {
  const value = new URLSearchParams(search).get("compare");
  return safeSlugs(value?.split(",") ?? []).slice(0, MAX_COMPARE);
}

export function compareUrl(origin: string, slugs: string[]): string {
  const url = new URL("/projects", origin);
  const selected = safeSlugs(slugs).slice(0, MAX_COMPARE);
  if (selected.length) url.searchParams.set("compare", selected.join(","));
  return url.toString();
}

export function discoverProjects(
  catalog: PortfolioProject[],
  options: { search: string; category: string; savedOnly: boolean; saved: string[]; sort: SortOrder }
): PortfolioProject[] {
  const query = options.search.trim().toLocaleLowerCase();
  const saved = new Set(options.saved);
  const matches = catalog.filter(p =>
    (options.category === "All" || p.category === options.category) &&
    (!options.savedOnly || saved.has(p.slug)) &&
    [p.title, p.summary, p.category, p.kicker, ...p.stack].join(" ").toLocaleLowerCase().includes(query)
  );
  return matches.sort((a, b) => {
    if (options.sort === "alphabetical") return a.title.localeCompare(b.title);
    if (options.sort === "newest") return Number(b.year.slice(0,4)) - Number(a.year.slice(0,4)) || a.title.localeCompare(b.title);
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || catalog.indexOf(a) - catalog.indexOf(b);
  });
}
