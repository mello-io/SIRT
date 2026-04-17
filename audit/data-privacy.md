# data-privacy.md
> S.I.R.T. Audit — Data Privacy
> Version: v1.1 | April 2026

---

## Summary

S.I.R.T. is designed to be privacy-preserving by architecture. The product does not
require user accounts, does not store incident data, and does not retain any
organisation-specific information on its servers.

**The short version:** your incident data never leaves a session. Your org stack
file lives on your machine. The only outbound call is to your chosen LLM provider,
using your own API key.

---

## What S.I.R.T. Collects

### Vercel Analytics (anonymous)
S.I.R.T. uses Vercel Analytics for basic usage statistics. Vercel Analytics is
cookie-free and does not collect personally identifiable information.

What is collected:
- Page views and navigation paths
- Web vitals (load time, interaction speed)
- Custom events: checklist generated, checklist downloaded, incident file generated,
  skill bundle downloaded, stack setup completed, generation error type

What is **never** included in analytics events:
- API keys or tokens
- Incident type details beyond an anonymised sub-type ID
- Org stack tool names or configurations
- Analyst notes or free-text input
- IP addresses (Vercel Analytics does not expose these to the application)

### Vercel Runtime Logs
Vercel captures serverless function logs for error diagnosis. These logs contain:
- Error type and HTTP status codes
- LLM provider name (e.g. "anthropic", "openai") — never the key itself
- Timestamps

These logs are retained by Vercel per their standard log retention policy and are
only accessible to the repository owner via the Vercel dashboard.

---

## What S.I.R.T. Does Not Collect

| Data Type | Collected? | Notes |
|---|---|---|
| User identity / accounts | ❌ No | No auth, no accounts in v1 |
| API keys | ❌ No | Proxied in transit, never logged |
| Incident type selections | ❌ No | Not stored anywhere |
| Org stack configuration | ❌ No | Lives in user's local file only |
| Analyst notes | ❌ No | Passed to LLM in transit, not stored |
| Generated checklist content | ❌ No | Returned to browser, not stored |
| LLM prompt content | ❌ No | Never logged |
| IP addresses | ❌ No | Not exposed to application layer |
| Device fingerprints | ❌ No | Vercel Analytics does not fingerprint |

---

## Data Flow Summary

```
Browser → Vercel Function → LLM Provider API → Vercel Function → Browser
                ↑
         (key in header,
          prompt in body,
          response returned,
          nothing stored)
```

Nothing written to disk. Nothing stored in a database. Nothing retained beyond
the lifecycle of the HTTP request.

---

## Third-Party Data Processors

| Processor | Purpose | Privacy Policy |
|---|---|---|
| Vercel | Hosting, serverless functions, analytics | https://vercel.com/legal/privacy-policy |
| Anthropic (optional) | LLM API — if user selects Anthropic | https://www.anthropic.com/privacy |
| OpenAI (optional) | LLM API — if user selects OpenAI | https://openai.com/policies/privacy-policy |
| Google (optional) | LLM API — if user selects Gemini | https://policies.google.com/privacy |
| Mistral (optional) | LLM API — if user selects Mistral | https://mistral.ai/privacy/ |

S.I.R.T. only calls the LLM provider the user selects. If the user does not use
the web platform (i.e. uses the Claude skill bundle only), no LLM API call is made
by S.I.R.T. at all — the call is made directly by the user's Claude subscription.

---

*S.I.R.T. Audit — data-privacy.md | v1.1 | April 2026*
