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
| `next` | 14.x | App framework | Vercel | Industry standard, actively maintained |
| `react` | 18.x | UI library | Meta | Industry standard |
| `react-dom` | 18.x | DOM rendering | Meta | Industry standard |
| `typescript` | 5.x | Type safety | Microsoft | Industry standard |
| `tailwindcss` | 3.x | Styling | Tailwind Labs | Widely used, minimal attack surface |
| `react-markdown` | 9.x | Markdown rendering in Output view | Unified collective | Well-audited, large ecosystem |
| `gray-matter` | 4.x | YAML/frontmatter parsing (org-sec-stack.md) | Jon Schlinkert | Stable, widely used |
| `date-fns` | 3.x | Date formatting for output file names | date-fns team | No network calls, pure functions |
| `lucide-react` | 0.x | Icon library | Lucide | SVG icons only, no network calls |
| `clsx` | 2.x | Conditional class names | Luke Edwards | 100-line utility, auditable |
| `@vercel/analytics` | latest | Anonymous usage analytics | Vercel | First-party Vercel package |
| `@vercel/speed-insights` | latest | Web vitals tracking | Vercel | First-party Vercel package |

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
