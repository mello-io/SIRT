# Contributing to S.I.R.T.

Thanks for your interest in contributing. S.I.R.T. v1.0 is a focused tool — contributions that expand the incident type library, tool library, or improve prompt quality are most welcome.

---

## Adding Tools to the Library

Tools live in [lib/constants/tool-library.ts](./lib/constants/tool-library.ts).

Each tool requires:

```ts
{
  id: "unique-kebab-id",
  name: "Tool Display Name",
  publisher: "Publisher Name",
  category: "SIEM", // must match an existing ToolCategory
  publicDocsUrl: "https://docs.example.com/", // publicly accessible, returns text
}
```

**Before submitting:**
- The `publicDocsUrl` must be a real, publicly accessible documentation URL
- The tool must fit an existing category — do not add new categories without discussion
- One tool per PR unless tools are from the same publisher

---

## Adding Incident Sub-types

Incident types live in [lib/constants/incident-types.ts](./lib/constants/incident-types.ts) and MITRE context in [lib/prompts/mitre-context.ts](./lib/prompts/mitre-context.ts).

Each sub-type requires:
- A unique ID in the format `[category].[number]` (e.g. `1.4`)
- At least one MITRE ATT&CK technique tag
- A matching entry in `MITRE_LOOKUP` in `mitre-context.ts`
- Placement in the correct existing category — new categories require a discussion issue first

---

## Improving Prompt Quality

The system prompt is in [lib/prompts/system-prompt.ts](./lib/prompts/system-prompt.ts).

Prompt changes have a broad impact — every incident type and provider is affected. Please:
- Test with at least 3 different incident types and 2 providers before submitting
- Include before/after sample output in your PR description
- Increment the prompt version comment if the change affects output structure

---

## General Guidelines

- Match the existing code style — TypeScript strict, Tailwind tokens only (no hardcoded hex), `font-mono` on structural elements
- Do not add dependencies not already in the stack unless the use case is compelling
- Keep PRs focused — one concern per PR
- Open an issue before starting large changes

---

## Reporting Issues

Open an issue at [github.com/mello-io/SIRT/issues](https://github.com/mello-io/SIRT/issues).

For security issues, do not open a public issue — contact via the GitHub profile directly.
