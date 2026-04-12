// S.I.R.T. LLM type layer — shared across frontend, middleware, and prompt engine.
// These interfaces define the unified request/response contract for all LLM providers.

export type Provider = "anthropic" | "openai" | "google" | "mistral";

export interface LLMRequest {
  provider: Provider;
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
}

export interface LLMResponse {
  content: string;
  provider: Provider;
  tokensUsed: number;
}
