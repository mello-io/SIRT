/** @type {import('next').NextConfig} */

// Static export mode: used when NEXT_PUBLIC_DEPLOY_MODE=static (GitHub Pages fallback).
// In this mode, /api/* routes are excluded — LLM calls go directly from the browser.
// Vercel mode (default): full Next.js with serverless API routes.
const isStaticExport = process.env.NEXT_PUBLIC_DEPLOY_MODE === "static";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "connect-src 'self' api.anthropic.com api.openai.com generativelanguage.googleapis.com api.mistral.ai va.vercel-scripts.com vitals.vercel-insights.com",
      "img-src 'self' data: blob: api.producthunt.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
  }),
  ...(!isStaticExport && {
    async headers() {
      return [{ source: "/(.*)", headers: securityHeaders }];
    },
  }),
};

export default nextConfig;
