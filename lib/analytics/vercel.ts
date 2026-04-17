import { track as vercelTrack } from "@vercel/analytics";

export function track(
  event: string,
  properties?: Record<string, string | number>
) {
  if (process.env.NEXT_PUBLIC_DEPLOY_MODE === "static") return;
  vercelTrack(event, properties);
}
