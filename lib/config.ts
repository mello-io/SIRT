// S.I.R.T. deploy mode configuration
// Controls whether API calls are proxied through Vercel Functions or made directly from the browser.
//
// NEXT_PUBLIC_DEPLOY_MODE=vercel  → API calls go to /api/* (Vercel Functions — keys stay server-side)
// NEXT_PUBLIC_DEPLOY_MODE=static  → API calls go directly to LLM provider from the browser

export const DEPLOY_MODE = process.env.NEXT_PUBLIC_DEPLOY_MODE ?? "vercel";

export function isVercelMode(): boolean {
  return DEPLOY_MODE === "vercel";
}

export function isStaticMode(): boolean {
  return DEPLOY_MODE === "static";
}
