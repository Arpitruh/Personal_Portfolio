import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolio";

// Preview and staging builds should never compete with the canonical production URL.
export default function robots(): MetadataRoute.Robots {
  const isPreview = Boolean(process.env.VERCEL) && process.env.VERCEL_ENV !== "production";
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: profile.siteUrl + "/sitemap.xml" };
}
