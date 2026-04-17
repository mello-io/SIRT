# client-side-processing.md
> S.I.R.T. Audit — Client-Side vs Server-Side Processing
> Version: v1.1 | April 2026

---

## Summary

This document maps every significant operation in S.I.R.T. to where it executes —
the user's browser (client-side) or Vercel serverless functions (server-side).
This distinction matters for security teams evaluating data exposure surface.

---

## Processing Map

| Operation | Where It Runs | Notes |
|---|---|---|
| Stack Setup Wizard UI | Browser | All selection state is local |
| Tool library rendering | Browser | Loaded from static constants file |
| org-sec-stack.md generation | Browser | Pure string construction, downloaded via browser API |
| org-sec-stack.md parsing | Browser | `parseOrgStack()` runs client-side |
| Incident Type Generator form | Browser | Entirely client-side — no server call |
| incident-type.md generation | Browser | Pure YAML string construction, downloaded via browser API |
| Prompt construction | Browser | `build-user-prompt.ts` runs client-side, assembles all context |
| LLM API call (Vercel mode) | Browser → Vercel Function → LLM API | Browser sends to `/api/generate`, Function calls LLM |
| LLM API call (Static mode) | Browser → LLM API | Direct from browser — no server intermediary |
| Public doc fetching | Browser → Vercel Function → Doc URL | Function fetches and returns doc text |
| Checklist rendering | Browser | Markdown rendered client-side |
| Checklist download | Browser | `downloadMarkdown()` uses browser download API |
| Checklist copy to clipboard | Browser | `navigator.clipboard` API |
| Vercel Analytics events | Browser → Vercel Analytics | Anonymous event data only |
| API key storage | Browser sessionStorage | Never leaves the browser except in the LLM request |
| LLM provider preference | Browser localStorage | String only — no sensitive data |

---

## What Never Touches the Server

The following never pass through S.I.R.T.'s server infrastructure:

- The full content of `org-sec-stack.md` as a file
- The full content of `incident-type.md` as a file
- The generated checklist content
- The analyst's API key (in static mode — goes direct to LLM)
- The analyst's notes or any free-text input (in static mode)

In Vercel mode, the prompt and API key pass through a Vercel Function as a
transport layer — they are not stored, logged, or processed beyond forwarding
to the LLM API.

---

## Static Mode: Full Client-Side Operation

When `DEPLOY_MODE=static`, S.I.R.T. operates entirely in the browser. Every
operation in the table above that shows "Browser → Vercel Function" instead
goes directly from browser to the external API.

This means:
- Zero server-side involvement from S.I.R.T.
- The API key is visible in browser DevTools network tab (the outbound request
  to the LLM API will include it in the Authorization header)
- Suitable for personal use, development, and air-gapped or restricted environments
  where outbound calls to Vercel are not permitted

**Static mode is not recommended for shared or team environments.**

---

## Vercel Function Surface Area

The three Vercel Functions act as a minimal proxy layer:

```
/api/generate     — 1 inbound request, 1 outbound request, 1 response returned
/api/fetch-docs   — 1 inbound request, 1 outbound fetch, 1 response returned
/api/provider     — pure transformation, no I/O
```

None of the functions:
- Write to disk
- Connect to a database
- Make more than one outbound call per request
- Cache responses
- Call any analytics or tracking service
- Communicate with each other outside of a single request chain

---

*S.I.R.T. Audit — client-side-processing.md | v1.1 | April 2026*
