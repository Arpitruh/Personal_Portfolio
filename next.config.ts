import type { NextConfig } from "next";

// Browser PDF plugins use an embedded object. Allow it only on the
// recruiter page while retaining object-src 'none' everywhere else.
function securityHeaders(allowResumePreview: boolean) {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Content-Security-Policy", value: [
      "default-src 'self'",
      "base-uri 'self'",
      allowResumePreview ? "object-src 'self'" : "object-src 'none'",
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
  ];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      // Don't apply HTML-specific frame/object restrictions to PDF files.
      { source: "/:path((?!uploads/resumes/|recruiter(?:/|$)).*)", headers: securityHeaders(false) },
      { source: "/recruiter", headers: securityHeaders(true) }
    ];
  }
};

export default nextConfig;
