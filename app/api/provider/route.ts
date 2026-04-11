// S.I.R.T. — /api/provider
// Provider normaliser: maps a unified LLMRequest to each provider's API schema.
// Called internally by /api/generate — not invoked directly by the frontend.
// Phase 0: stub — interface defined in lib/types/llm.ts, implementation deferred to Phase 1.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "stub",
    message:
      "Provider normaliser not yet implemented. Interface defined in lib/types/llm.ts.",
  });
}
