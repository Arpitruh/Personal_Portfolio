import type { MetadataRoute } from "next";
import { profile, projects } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/life", "/projects", "/world", "/play", "/now", "/contact", "/room", "/recruiter", "/skills", "/achievements", "/assistant"];
  return [...pages, ...projects.map((project) => "/projects/" + project.slug)]
    .map((path) => ({ url: profile.siteUrl + path, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 }));
}
