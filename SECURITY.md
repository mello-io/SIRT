# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| v1.1 (latest) | ✅ |
| < v1.1 | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in S.I.R.T., please **do not open a public GitHub issue**.

Report it privately by emailing: **derick.cybops@gmail.com**

Include:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected version(s)

## What to Expect

- Acknowledgement within **48 hours**
- A status update within **7 days**
- A fix or mitigation plan communicated before any public disclosure

We follow responsible disclosure — we ask that you give us reasonable time to address the issue before publishing details publicly.

## Scope

The following are in scope:

- API key handling and transmission (`lib/api/provider.ts`)
- Server-side fetch proxy and SSRF protection (`app/api/fetch-docs/route.ts`)
- Content Security Policy and HTTP security headers
- Authentication or session handling issues

The following are **out of scope**:

- Vulnerabilities in third-party LLM provider APIs (Anthropic, OpenAI, Google, Mistral)
- Issues requiring physical access to the user's machine
- Social engineering attacks
- Self-XSS

## Security Design Notes

S.I.R.T. is a BYOK (Bring Your Own Key) application. API keys are:

- Stored in `sessionStorage` only — cleared on tab close, never persisted server-side
- Transmitted over HTTPS only
- Never logged, stored, or forwarded beyond the LLM provider request

See the [`/audit`](./audit/) directory for security hardening documentation.
