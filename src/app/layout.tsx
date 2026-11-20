import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/data/portfolio";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: "Arpit Yadav | Portfolio World", template: "%s | Arpit Yadav" },
  description: profile.summary,
  applicationName: "Arpit's Portfolio World",
  keywords: ["Arpit Yadav", "Software Engineer", "Frontend Developer", "Next.js", "React", "TypeScript", "Portfolio"],
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_IN", title: "Arpit Yadav | Portfolio World",
    description: profile.summary, siteName: "Portfolio World",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }]
  },
  twitter: { card: "summary_large_image", title: "Arpit Yadav | Portfolio World", images: ["/opengraph-image"] },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#15152d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
