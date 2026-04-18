# deployment-security.md
> S.I.R.T. Audit — Deployment Security
> Version: v1.1 | April 2026

---

## Summary

S.I.R.T. is deployed on Vercel, connected to a GitHub repository. This document
covers the deployment configuration, security controls, and posture of the
production environment.

**Production URL:** https://sirt-five.vercel.app
**Repository:** https://github.com/mello-io/SIRT

---

## Hosting: Vercel

### HTTPS
All traffic to `sirt-five.vercel.app` is served over HTTPS. Vercel automatically
provisions and renews TLS certificates. HTTP requests are automatically redirected
to HTTPS. TLS version minimum is TLS 1.2.

### Headers
S.I.R.T. sets the following security headers via `next.config.mjs` on all routes:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | See below | Restricts resource loading to known-safe origins |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data to same-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |

Custom API response header added by S.I.R.T.:

| Header | Value | Purpose |
|---|---|---|
| `X-SIRT-Version` | `1.1` | Version identification for debugging |

**Content-Security-Policy** (applied via `next.config.mjs`):
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' va.vercel-scripts.com;
style-src 'self' 'unsafe-inline' fonts.googleapis.com;
font-src 'self' fonts.gstatic.com;
connect-src 'self' api.anthropic.com api.openai.com generativelanguage.googleapis.com api.mistral.ai va.vercel-scripts.com vitals.vercel-insights.com;
img-src 'self' data: blob:;
frame-ancestors 'none'
```
`'unsafe-inline'` and `'unsafe-eval'` are required by Next.js App Router. These are standard for Next.js deployments without a nonce-based CSP.

### Serverless Function Isolation
Each Vercel Function (`/api/generate`, `/api/fetch-docs`, `/api/provider`) runs
in an isolated execution environment. Functions do not share memory or state
between invocations or between functions.

### Environment Variables
Sensitive configuration is stored in Vercel project environment variables:
- Variables are encrypted at rest by Vercel
- Variables are injected into the serverless function runtime only
- Variables are never exposed in the built static assets
- `NEXT_PUBLIC_*` variables are intentionally public — they contain no secrets
  (deploy mode flag only)

---

## Source Control: GitHub

### Repository Visibility
The repository is public. This is intentional — the codebase contains no secrets,
and public visibility supports the security community's ability to audit the code.

### Branch Protection
- `main` branch is the production branch — all deployments come from `main`
- Version branches (`v1.1`, `v1.2`) are used for active development
- PRs are used for merging version branches to `main`

### Secret Management
- No secrets are committed to the repository
- `.env.local` is listed in `.gitignore`
- `.env.example` contains variable names with empty values — safe to commit
- GitHub secret scanning is enabled — alerts if a credential pattern is detected in a commit

---

## Attack Surface Assessment

| Surface | Present? | Notes |
|---|---|---|
| Authentication endpoints | ❌ No | No auth in v1 |
| Database connections | ❌ No | No database in v1 |
| File upload processing | ✅ Yes | org-sec-stack.md and incident-type.md parsed client-side |
| External URL fetching | ✅ Yes | `/api/fetch-docs` — fetches public documentation URLs |
| LLM API calls | ✅ Yes | Proxied through `/api/generate` |
| User-generated content rendering | ✅ Yes | LLM output rendered as markdown |
| Third-party scripts | ✅ Minimal | Vercel Analytics only |

### File Upload Notes
Files uploaded by the user (`org-sec-stack.md`, `incident-type.md`) are parsed
entirely in the browser using the File API. They are not sent to S.I.R.T.'s servers.
The parser (`parseOrgStack()`) is a text parser — it does not execute file content.

### External URL Fetching Notes
`/api/fetch-docs` fetches URLs provided by the user (public documentation URLs).
Controls applied:
- Timeout: 10 seconds maximum
- Response size limit: content over a reasonable threshold is truncated
- Only text/html content types are processed — binary content is rejected
- The fetched content is passed to the LLM as context — it is not executed

### LLM Output Rendering Notes
The generated checklist is rendered as markdown using `react-markdown`. By default,
`react-markdown` does not render raw HTML — this prevents XSS via LLM output.
Custom renderers (MitreTag, DecisionPoint, ToolQueryBlock) process only expected
markdown constructs.

---

## Incident Response for Security Issues

If a security vulnerability is discovered in S.I.R.T.:

1. Open a GitHub issue tagged `security` — or contact the maintainer directly
2. Do not publish details publicly before the issue is acknowledged
3. A fix will be prioritised and released as a patch version
4. The audit folder will be updated to reflect any changes to the security posture

---

*S.I.R.T. Audit — deployment-security.md | v1.1 | April 2026*
