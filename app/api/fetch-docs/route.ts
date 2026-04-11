// S.I.R.T. — /api/fetch-docs
// Accepts a tool name and public docs URL, fetches and returns cleaned text content.
// Phase 0: stub — returns a placeholder response.

import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  return NextResponse.json({
    content: "Placeholder documentation content.",
    source: "stub",
  });
}
