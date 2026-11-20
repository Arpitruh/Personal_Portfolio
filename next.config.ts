import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{
      // Uploaded PDFs are intentionally excluded: browser PDF viewers use
      // their own internal frame, which restrictive HTML framing/CSP headers
      // can block even when the PDF itself opens successfully in a new tab.
      source: "/:path((?!uploads/resumes/).*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        // Regular site pages remain protected against third-party framing.
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'self'",
          "form-action 'self' mailto:",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline'",
          "connect-src 'self'",
          "media-src 'none'",
          "upgrade-insecure-requests"
        ].join("; ") }
      ]
    }];
  }
};

export default nextConfig;
