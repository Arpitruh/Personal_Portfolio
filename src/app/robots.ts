import type { MetadataRoute } from "next";
import {publicSeo,allowIndexing} from "@/lib/seo-content";
import { profile } from "@/data/portfolio";

// Preview and staging builds should never compete with the canonical production URL.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const isPreview = !allowIndexing(await publicSeo());
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: profile.siteUrl + "/sitemap.xml" };
}
