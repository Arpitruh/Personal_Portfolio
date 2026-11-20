import type { MetadataRoute } from "next";
import { profile, projects } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/world", "/play", "/now", "/contact"];
  return [...pages, ...projects.map((project) => "/projects/" + project.slug)]
    .map((path) => ({ url: profile.siteUrl + path, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 }));
}
