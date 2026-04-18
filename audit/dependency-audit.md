# dependency-audit.md
> S.I.R.T. Audit — Dependency Inventory
> Version: v1.1 | April 2026

---

## Summary

This document lists all npm dependencies used in S.I.R.T., their purpose, and
their trust posture. S.I.R.T. follows a minimal dependency philosophy — every
package must justify its presence. Dependencies are reviewed at each version release.

---

## Production Dependencies

| Package | Version | Purpose | Publisher | Trust Notes |
|---|---|---|---|---|
| `next` | 14.2.35 | App framework | Vercel | Industry standard — see vulnerability note below |
| `react` | 18.3.1 | UI library | Meta | Industry standard |
| `react-dom` | 18.3.1 | DOM rendering | Meta | Industry standard |
| `typescript` | 5.9.3 | Type safety | Microsoft | Industry standard |
| `tailwindcss` | 3.4.19 | Styling | Tailwind Labs | Widely used, minimal attack surface |
| `react-markdown` | 10.1.0 | Markdown rendering in Output view | Unified collective | Well-audited, large ecosystem |
| `gray-matter` | 4.0.3 | YAML/frontmatter parsing (org-sec-stack.md) | Jon Schlinkert | Stable, widely used |
| `date-fns` | 4.1.0 | Date formatting for output file names | date-fns team | No network calls, pure functions |
| `lucide-react` | 1.8.0 | Icon library | Lucide | SVG icons only, no network calls |
| `clsx` | 2.1.1 | Conditional class names | Luke Edwards | 100-line utility, auditable |
| `@vercel/analytics` | 2.0.1 | Anonymous usage analytics | Vercel | First-party Vercel package |
| `@vercel/speed-insights` | 2.0.0 | Web vitals tracking | Vercel | First-party Vercel package |
| `remark-gfm` | 4.0.1 | GitHub-flavoured Markdown in checklist output | Unified collective | Pure text transformation |

### shadcn/ui components
shadcn/ui is not a traditional npm package — it copies component source code
directly into `/components/ui/`. The components are local code, not a runtime
dependency. They are based on Radix UI primitives.

| Underlying Package | Purpose |
|---|---|
| `@radix-ui/react-*` | Accessible headless UI primitives (dialogs, dropdowns, etc.) |
| `class-variance-authority` | Component variant styling |
| `tailwind-merge` | Tailwind class merging utility |

---

## Development Dependencies

| Package | Purpose |
|---|---|
| `eslint` | Code linting |
| `eslint-config-next` | Next.js ESLint rules |
| `@types/react` | TypeScript types for React |
| `@types/node` | TypeScript types for Node.js |
| `postcss` | CSS processing (required by Tailwind) |
| `autoprefixer` | CSS vendor prefixes (required by Tailwind) |

---

## Packages Intentionally Not Used

| Package | Reason Not Used |
|---|---|
| `axios` | Native `fetch` is sufficient for all HTTP calls |
| `lodash` | No utility library needed — TypeScript handles everything required |
| `moment` | `date-fns` is lighter and tree-shakeable |
| Any database client | No database in v1 |
| Any auth library | No auth in v1 |
| Any file upload library | Browser File API is sufficient |
| `dotenv` | Next.js handles env vars natively |

---

## Known Vulnerability Status — April 2026

`npm audit` reports 5 findings against `next@14.2.35`. Context:

| CVE | Severity | Applies to SIRT? |
|---|---|---|
| GHSA-9g9p-9gw9-jx7f | High | No — self-hosted Image Optimizer only; SIRT uses Vercel |
| GHSA-3x4c-7xq6-9pq8 | High | No — self-hosted disk cache only; SIRT uses Vercel |
| GHSA-ggv3-7p47-pfv8 | High | No — requires `rewrites` config; SIRT has none |
| GHSA-h25m-26qc-wcjf | High | Low risk — requires insecure RSC patterns not present in SIRT |
| GHSA-q4gf-8mx6-v5v3 | High | Low risk — DoS via Server Components; mitigated by Vercel infra |

All fixes require upgrading to `next@16` (breaking change from 14.x). A Next.js
major version upgrade is tracked as a separate post-launch task and will be tested
in isolation before merging to main.

The `glob` CLI injection (transitive via `eslint-config-next`) is dev-only and
has no runtime impact.

---

## Vulnerability Monitoring

Dependencies are checked for known vulnerabilities using:
- `npm audit` — run before each version release
- GitHub Dependabot alerts — enabled on the repository

**Current audit status:** Run `npm audit` from the repo root to see the current
vulnerability report. Any high or critical severity findings are resolved before
a version is released.

---

## Supply Chain Notes

- All packages are installed from the official npm registry
- Package lock file (`package-lock.json` or `pnpm-lock.yaml`) is committed to the
  repo — dependency versions are pinned
- No packages are installed from GitHub directly or from private registries
- shadcn/ui components are copied source code — not a runtime registry dependency

---

*This document is updated at each version release.*
*Run `npm list --depth=0` to see currently installed versions.*

*S.I.R.T. Audit — dependency-audit.md | v1.1 | April 2026*
