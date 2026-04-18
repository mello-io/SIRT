# api-key-handling.md
> S.I.R.T. Audit — API Key Handling
> Version: v1.1 | April 2026

---

## Summary

S.I.R.T. uses a Bring Your Own Key (BYOK) model. Users provide their own LLM
provider API key. That key is used to authenticate a single LLM API call per
checklist generation. It is never stored by S.I.R.T. on any server or in any
database.

---

## Key Lifecycle

```
1. User enters API key in the Session screen (masked input field)
        ↓
2. Key is stored in browser sessionStorage only
        ↓
3. On "Generate Checklist" — key is sent to /api/generate via HTTPS POST body
        ↓
4. Vercel Function reads the key from the request body
        ↓
5. Key is added to the Authorization header of the outbound LLM API request
        ↓
6. LLM API responds — Vercel Function returns the response to the browser
        ↓
7. Key is discarded — not written to disk, not logged, not cached
        ↓
8. On tab close — sessionStorage is cleared, key is gone
```

---

## Storage Details

| Location | Stored? | Duration | Notes |
|---|---|---|---|
| Browser sessionStorage | ✅ Yes | Until tab is closed | Cleared automatically by browser on tab close |
| Browser localStorage | ❌ No | — | Key never written to localStorage |
| Vercel Function memory | ✅ Briefly | Duration of one request | Discarded when request completes |
| Vercel logs | ❌ No | — | Key is explicitly excluded from all log statements |
| Any database | ❌ No | — | No database in v1 |
| Any external service | ❌ No | — | Key is only sent to the user's chosen LLM provider |

---

## Transmission Security

- All communication between the browser and Vercel Functions is over HTTPS (TLS 1.2+)
- All communication between Vercel Functions and LLM provider APIs is over HTTPS
- The key is never transmitted in a URL query string or URL fragment — it is passed
  in a request header for all providers (see table below)
- Vercel enforces HTTPS on all deployments — HTTP requests are redirected automatically

| Provider | Header Used | Notes |
|---|---|---|
| Anthropic | `x-api-key` | Anthropic's required header |
| OpenAI | `Authorization: Bearer` | Standard OAuth bearer token |
| Google | `x-goog-api-key` | Header-based auth; URL query param not used |
| Mistral | `Authorization: Bearer` | Standard OAuth bearer token |

---

## What Is Logged

Vercel Functions produce runtime logs for error diagnosis. The logging policy for
API key handling is:

```ts
// CORRECT — logs provider and error type only
console.error('[SIRT] generate error', { provider, errorType: err.name })

// NEVER — key is never included in any log statement
console.error('[SIRT] generate error', { apiKey, prompt }) // this does not exist
```

All catch blocks in `/api/generate.ts`, `/api/fetch-docs.ts`, and `/api/provider.ts`
have been reviewed to confirm the key is excluded.

---

## Deploy Mode Comparison

| Mode | Key Location | Key Transit Path |
|---|---|---|
| Vercel (production) | sessionStorage → Vercel Function → LLM API | Key never exposed in browser network tab to external observers |
| Static (GitHub Pages) | sessionStorage → LLM API directly from browser | Key visible in browser DevTools network tab — only recommended for personal/dev use |

The static mode is explicitly labelled in the Settings page as a development/fallback
mode. Production use should always use Vercel mode.

---

## No Hosted Keys in v1

S.I.R.T. v1 does not provide or manage API keys on behalf of users. There are no
shared or pooled keys. Every call is made with the user's own key, billed to the
user's own LLM account. This will be revisited in v3.0 if a hosted key model is introduced.

---

*S.I.R.T. Audit — api-key-handling.md | v1.1 | April 2026*
