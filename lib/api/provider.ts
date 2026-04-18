// S.I.R.T. Provider Normaliser
// Maps a unified LLMRequest to each provider's API schema and returns a normalised LLMResponse.
// In Vercel mode: called server-side by /api/generate (API key stays server-side).
// In static mode: called directly from the browser (BYOK key is transmitted in the request header).
//
// Provider map (TECH_STACK.md Section 4):
//   anthropic → claude-sonnet-4-6    → api.anthropic.com/v1/messages
//   openai    → gpt-4o               → api.openai.com/v1/chat/completions
//   google    → gemini-1.5-pro       → generativelanguage.googleapis.com
//   mistral   → mistral-large-latest → api.mistral.ai/v1/chat/completions

import type { LLMRequest, LLMResponse } from "@/lib/types/llm";

// ── Anthropic ─────────────────────────────────────────────────────────────────

async function callAnthropic(req: LLMRequest): Promise<LLMResponse> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": req.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: req.maxTokens,
      system: req.systemPrompt,
      messages: [{ role: "user", content: req.userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ??
        `Anthropic API error: ${response.status}`
    );
  }

  const data = await response.json();
  return {
    content: data.content[0].text as string,
    provider: "anthropic",
    tokensUsed:
      (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
  };
}

// ── OpenAI ────────────────────────────────────────────────────────────────────

async function callOpenAI(req: LLMRequest): Promise<LLMResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: req.maxTokens,
      messages: [
        { role: "system", content: req.systemPrompt },
        { role: "user", content: req.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ??
        `OpenAI API error: ${response.status}`
    );
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content as string,
    provider: "openai",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

// ── Google Gemini ─────────────────────────────────────────────────────────────

async function callGoogle(req: LLMRequest): Promise<LLMResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": req.apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: req.userPrompt }] }],
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      generationConfig: { maxOutputTokens: req.maxTokens },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ??
        `Google API error: ${response.status}`
    );
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text as string,
    provider: "google",
    tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
  };
}

// ── Mistral ───────────────────────────────────────────────────────────────────

async function callMistral(req: LLMRequest): Promise<LLMResponse> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      max_tokens: req.maxTokens,
      messages: [
        { role: "system", content: req.systemPrompt },
        { role: "user", content: req.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ??
        `Mistral API error: ${response.status}`
    );
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content as string,
    provider: "mistral",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

export async function callProvider(req: LLMRequest): Promise<LLMResponse> {
  switch (req.provider) {
    case "anthropic":
      return callAnthropic(req);
    case "openai":
      return callOpenAI(req);
    case "google":
      return callGoogle(req);
    case "mistral":
      return callMistral(req);
    default:
      throw new Error(`Unknown provider: ${req.provider}`);
  }
}

// ── Manual ping test (Phase 1 verification) ──────────────────────────────────
// To verify provider normalisation, run the following in a Next.js API route or Node script:
//
//   import { callProvider } from '@/lib/api/provider';
//   const result = await callProvider({
//     provider: 'anthropic',   // swap to 'openai' | 'google' | 'mistral' to test each
//     apiKey: 'YOUR_KEY',
//     systemPrompt: 'You are a helpful assistant.',
//     userPrompt: 'Reply with the single word: PONG',
//     maxTokens: 16,
//   });
//   console.log('[provider ping]', result);
//
// Expected: { content: 'PONG', provider: 'anthropic', tokensUsed: N }
