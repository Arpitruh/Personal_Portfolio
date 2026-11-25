import type { MetadataRoute } from "next";
import {publicProjects} from "@/lib/project-content";
import { profile } from "@/data/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects=await publicProjects();
  const pages = ["", "/about", "/life", "/projects", "/world", "/play", "/now", "/contact", "/room", "/recruiter", "/skills", "/achievements", "/assistant"];
  return [...pages, ...projects.map((project) => "/projects/" + project.slug)]
    .map((path) => ({ url: profile.siteUrl + path, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 }));
}
