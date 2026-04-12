// S.I.R.T. — /api/generate
// Receives a session payload, attaches the system prompt, dispatches to the
// active LLM provider via lib/api/provider.ts, and returns the markdown checklist.
//
// Request body:
//   provider        — 'anthropic' | 'openai' | 'google' | 'mistral'
//   apiKey          — user's BYOK key (proxied, never stored)
//   userPrompt      — built by lib/prompts/build-user-prompt.ts on the client
//   incidentTypeId  — e.g. "1.2" (for server-side validation)
//   assetTypeId     — e.g. "endpoint-workstation" (for server-side validation)
//   toolCount       — number of tools in the stack (for server-side validation)
//
// Security: API key is used in-flight only and never logged.

import { NextRequest, NextResponse } from "next/server";
import { callProvider } from "@/lib/api/provider";
import { SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import type { Provider } from "@/lib/types/llm";

// Vercel function timeout — LLM responses at 8000 max tokens can take 30–50s.
// Without this, Vercel free tier cuts the function at 10s.
export const maxDuration = 60;

const VALID_PROVIDERS: Provider[] = ["anthropic", "openai", "google", "mistral"];
const MAX_PAYLOAD_BYTES = 50_000;
const MAX_TOKENS = 8000;

export async function POST(request: NextRequest) {
  // Reject oversized payloads
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large (max 50KB)" },
      { status: 413 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Validate required fields ───────────────────────────────────────────────
  const { provider, apiKey, userPrompt, incidentTypeId, assetTypeId, toolCount } = body;

  if (!provider || !VALID_PROVIDERS.includes(provider as Provider)) {
    return NextResponse.json(
      { error: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(", ")}` },
      { status: 400 }
    );
  }

  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
    return NextResponse.json({ error: "Missing or empty apiKey" }, { status: 400 });
  }

  if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
    return NextResponse.json({ error: "Missing userPrompt" }, { status: 400 });
  }

  if (!incidentTypeId || typeof incidentTypeId !== "string") {
    return NextResponse.json({ error: "Missing incidentTypeId" }, { status: 400 });
  }

  if (!assetTypeId || typeof assetTypeId !== "string") {
    return NextResponse.json({ error: "Missing assetTypeId" }, { status: 400 });
  }

  if (!toolCount || typeof toolCount !== "number" || toolCount < 1) {
    return NextResponse.json(
      { error: "Stack must include at least one tool" },
      { status: 400 }
    );
  }

  // ── Dispatch to provider ───────────────────────────────────────────────────
  try {
    const result = await callProvider({
      provider: provider as Provider,
      apiKey: apiKey.trim(),
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: userPrompt.trim(),
      maxTokens: MAX_TOKENS,
    });

    // ── Sanitise response ────────────────────────────────────────────────────
    const sanitised = result.content.trim();
    if (!sanitised || sanitised.length < 100) {
      return NextResponse.json(
        { error: "LLM returned an empty or incomplete response. Please retry." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      content: sanitised,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "LLM request failed";

    // Surface rate limit errors distinctly
    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit reached. Wait a moment and try again.", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    // Surface auth errors distinctly
    if (
      message.includes("401") ||
      message.includes("403") ||
      message.toLowerCase().includes("invalid api key") ||
      message.toLowerCase().includes("authentication")
    ) {
      return NextResponse.json(
        { error: "Invalid API key. Check your key and try again.", code: "AUTH_ERROR" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
