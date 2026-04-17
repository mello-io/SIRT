# Changelog

## v1.1 — April 2026

- Added: `/incident` page — Incident Type Generator (produces `incident-type.md`)
- Added: S.I.R.T. Claude Skill Bundle — downloadable from GitHub Releases (`skill-v1.0`)
- Added: Dual path landing page — API key path + Claude Skill path (no API key required)
- Added: `SkillBundleCTA` and `SkillInstallModal` components on Landing, Session, and Settings
- Added: Vercel Analytics and Speed Insights — privacy-friendly, cookie-free
- Added: Custom analytics events — `stack_setup_completed`, `checklist_generated`, `checklist_downloaded`, `incident_file_generated`, `skill_bundle_downloaded`, `generation_error`
- Added: `/audit` directory — security hardening documentation for analysts and security leads
- Added: Global error boundary (`error.tsx`) and custom 404 page (`not-found.tsx`)
- Added: `X-SIRT-Version: 1.1` response header on all `/api/*` routes
- Added: Structured `console.error` logging on all API catch blocks
- Added: Analytics privacy notice on Settings page
- Improved: `incident-type.md` output format aligned to SKILL.md YAML schema
- Improved: System prompt bumped to v1.1
- Improved: Settings page uses typed session storage constants
- Improved: AppShell nav includes Generate File link to `/incident`

## v1.0 — April 2026

- Initial release
- 22 incident types across 7 categories
- 60+ security tools across 9 stack categories
- Multi-LLM support: Anthropic, OpenAI, Google, Gemini, Mistral
- BYOK model — API key proxied through Vercel Functions, never stored
- Phase-structured IR checklists with MITRE ATT&CK tags and decision points
- Dual deploy mode: Vercel (primary), static export (GitHub Pages fallback)
- Stack setup wizard with public doc mapping and custom doc upload
- Portable `org-sec-stack.md` org profile export
- Portable `SIRT-[incident]-[date].md` checklist download
