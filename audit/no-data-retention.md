# no-data-retention.md
> S.I.R.T. Audit — No Data Retention Verification
> Version: v1.1 | April 2026

---

## Summary

S.I.R.T. retains no incident data, no org stack data, no generated checklists,
and no analyst session data on any server. This is not a policy statement — it is
an architectural fact. There is no database. There is no write path for incident
data. There is nowhere for the data to go.

---

## Architecture Verification

### Server-side (Vercel Functions)

The three serverless functions in S.I.R.T. are:

**`/api/generate`**
- Receives: incident context, org stack object, LLM provider, API key
- Does: constructs a prompt, calls the LLM API, returns the response
- Writes to disk: nothing
- Writes to a database: nothing
- Logs: error type and provider name only (see api-key-handling.md)

**`/api/fetch-docs`**
- Receives: a tool name and a public documentation URL
- Does: fetches the URL, extracts text content, returns it
- Writes to disk: nothing
- Caches: nothing (no Redis, no Upstash in v1)
- Logs: fetch errors only

**`/api/provider`**
- Receives: a unified LLM request object
- Does: normalises the request to the target provider's schema
- Writes to disk: nothing
- Is a pure transformation function — no I/O beyond receiving and returning

### Client-side (Browser)

| Data | Storage Location | Persistence |
|---|---|---|
| API key | `sessionStorage` | Cleared on tab close |
| Org stack object (parsed) | React state (`useState`) | Cleared on page refresh |
| Incident session inputs | React state (`useState`) | Cleared on page refresh |
| Generated checklist | React state (`useState`) | Cleared on page refresh |
| LLM provider preference | `localStorage` (optional) | Persists across sessions — contains provider name only, no key |
| Deploy mode preference | `localStorage` | Persists — contains mode string only |

No incident data, org stack content, or checklist content is ever written to
`localStorage`. Only non-sensitive UI preferences are persisted locally.

---

## What "No Retention" Means in Practice

When a user closes their browser tab after a session:
- The API key is gone
- The org stack loaded in memory is gone
- The incident configuration is gone
- The generated checklist is gone from S.I.R.T.'s context

The only copy of any of this data is what the user chose to download to their
own machine. S.I.R.T. has no copy.

---

## Verification Checklist for Independent Review

If you are auditing S.I.R.T. independently, the following checks will confirm
no data retention:

- [ ] Inspect `/api/generate.ts` — confirm no `fs.write`, no database client,
      no cache write, no external HTTP call other than the LLM provider API
- [ ] Inspect `/api/fetch-docs.ts` — confirm no write path, no cache
- [ ] Inspect `/api/provider.ts` — confirm it is a pure transformation function
- [ ] Search the codebase for any initialisation of Supabase, Prisma, Mongoose,
      Redis, or any other database/cache client — none should exist in v1
- [ ] Inspect `lib/utils/` — confirm no write utilities beyond `downloadMarkdown()`
      which writes only to the user's local machine via browser download API
- [ ] Inspect all `localStorage` write calls — confirm they contain only
      non-sensitive preferences (provider name, deploy mode)
- [ ] Confirm no `sessionStorage` write after the session ends

---

## Future Versions

Supabase is listed as a planned tool in `TECH_STACK.md` for v2.0. When persistence
is introduced, this document will be updated to reflect:
- What is stored
- For how long
- Who has access
- How it can be deleted

No data will be persisted without this document being updated first.

---

*S.I.R.T. Audit — no-data-retention.md | v1.1 | April 2026*
