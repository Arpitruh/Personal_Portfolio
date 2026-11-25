import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/press-start-2p/400.css";
import "./globals.css";
import { profile } from "@/data/portfolio";
import {publicSeo,allowIndexing} from "@/lib/seo-content";
import {publicSocials} from "@/lib/personal-content";
import {AnalyticsTracker} from "@/components/analytics-tracker";
import { SiteShell } from "@/components/site-shell";

export async function generateMetadata():Promise<Metadata>{
 const seo=await publicSeo();
 const index=allowIndexing(seo);
 return {
  metadataBase: new URL(profile.siteUrl),
  title: { default: seo.title, template: "%s | "+seo.titleSuffix.replaceAll("%","") },
  description: seo.description,
  applicationName: seo.siteName,
  keywords: seo.keywords,
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_IN", title: seo.socialTitle,
    description: seo.socialDescription, siteName: seo.siteName,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", title: seo.socialTitle, description:seo.socialDescription, images: ["/opengraph-image"] },
  robots: { index, follow:index }
};
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#15152d" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const socialProfiles=await publicSocials();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteShell socialProfiles={socialProfiles}>{children}</SiteShell>
        <AnalyticsTracker/>
      </body>
    </html>
  );
}
