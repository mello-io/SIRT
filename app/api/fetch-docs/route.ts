// S.I.R.T. — /api/fetch-docs
// Accepts a POST with { docsUrl: string }, fetches the URL server-side,
// strips HTML, and returns cleaned text content for use in the prompt engine.
//
// Error handling:
//   400 — invalid or missing URL
//   422 — non-text content type
//   502 — fetch failed or upstream error
//   504 — timeout (10s)
//
// Static mode note:
//   When DEPLOY_MODE=static this route is not available. The frontend falls back
//   to a graceful degradation message — public doc context is skipped at generation.

import { NextRequest, NextResponse } from "next/server";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_CONTENT_LENGTH = 50_000; // chars

export async function POST(request: NextRequest) {
  let docsUrl: string;

  try {
    const body = await request.json();
    docsUrl = body?.docsUrl;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!docsUrl || typeof docsUrl !== "string") {
    return NextResponse.json({ error: "Missing docsUrl" }, { status: 400 });
  }

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(docsUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only http/https URLs are supported" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Fetch with timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "SIRT-DocFetcher/1.0",
        Accept: "text/html,text/plain,application/xhtml+xml",
      },
    });

    clearTimeout(timer);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    const isText =
      contentType.includes("text/") ||
      contentType.includes("application/xhtml") ||
      contentType.includes("application/json");

    if (!isText) {
      return NextResponse.json(
        { error: `Non-text content type: ${contentType}` },
        { status: 422 }
      );
    }

    const raw = await response.text();

    // Basic HTML stripping — remove scripts, styles, then all tags
    const cleaned = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_CONTENT_LENGTH);

    return NextResponse.json({
      content: cleaned,
      source: parsedUrl.hostname,
      charCount: cleaned.length,
    });
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out after 10s" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch documentation" },
      { status: 502 }
    );
  }
}
