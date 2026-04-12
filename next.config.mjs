/** @type {import('next').NextConfig} */

// Static export mode: used when NEXT_PUBLIC_DEPLOY_MODE=static (GitHub Pages fallback).
// In this mode, /api/* routes are excluded — LLM calls go directly from the browser.
// Vercel mode (default): full Next.js with serverless API routes.
const isStaticExport = process.env.NEXT_PUBLIC_DEPLOY_MODE === "static";

const nextConfig = {
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
  }),
};

export default nextConfig;
