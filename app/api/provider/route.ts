// S.I.R.T. — /api/provider
// Exposes the provider normaliser status. The actual callProvider() function
// lives in lib/api/provider.ts and is imported directly by /api/generate.
// This route exists for health-check and discoverability purposes.

import { NextResponse } from "next/server";
import { TOOL_LIBRARY } from "@/lib/constants/tool-library";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      providers: ["anthropic", "openai", "google", "mistral"],
      models: {
        anthropic: "claude-sonnet-4-6",
        openai: "gpt-4o",
        google: "gemini-2.5-pro",
        mistral: "mistral-large-latest",
      },
      toolLibraryCount: TOOL_LIBRARY.length,
    },
    { headers: { "X-SIRT-Version": "1.1" } }
  );
}
