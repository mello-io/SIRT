// S.I.R.T. — /api/generate
// Receives a session payload, constructs an LLMRequest, dispatches through the provider
// normaliser, and returns a markdown checklist string.
// Phase 0: stub — returns a placeholder response.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    content:
      "# Placeholder\n\n`/api/generate` is not yet implemented. This stub confirms the route is active.",
    provider: "stub",
    tokensUsed: 0,
  });
}
