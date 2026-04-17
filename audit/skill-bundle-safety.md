# skill-bundle-safety.md
> S.I.R.T. Audit — Claude Skill Bundle Safety
> Version: v1.1 | April 2026

---

## Summary

The S.I.R.T. Claude Skill Bundle is a set of markdown files uploaded to a user's
Claude Project. This document explains what the skill bundle can and cannot do,
and what data it can and cannot access — for security teams evaluating whether
to approve its use within their organisation's Claude subscription.

---

## What the Skill Bundle Is

The skill bundle is a collection of plain markdown files:

| File | Contents |
|---|---|
| `SKILL.md` | Role definition, processing instructions, output format rules |
| `incident-library.md` | Static reference data — 22 incident types with investigation guidance |
| `tool-library.md` | Static reference data — security tool investigation steps |
| `output-format.md` | Output structure specification |

These files contain no executable code, no scripts, no API calls, and no external
links that are fetched automatically. They are plain text documents that instruct
Claude how to respond.

---

## What the Skill Bundle Can Access

When uploaded to a Claude Project, the skill files become part of the Project's
knowledge base. Claude reads them when generating responses.

**The skill can access:**
- The contents of the skill bundle files themselves
- Any files the user uploads in a conversation (org-sec-stack.md, incident-type.md)
- The conversation history within the current session

**The skill cannot access:**
- The internet or external URLs
- Other Claude Projects or their knowledge bases
- The user's device, file system, or local network
- Other conversations (Claude Projects have no cross-conversation memory by default)
- Any live system, SIEM, or security tool
- Any data not explicitly provided in the conversation

---

## What the Skill Does With Uploaded Files

When a user uploads `org-sec-stack.md` and `incident-type.md`, Claude:

1. Reads the file contents within the conversation context
2. Uses the contents to construct an IR checklist response
3. Returns the checklist as a text response in the conversation

Claude does not:
- Store the file contents outside the current conversation context
- Send the file contents to any external service
- Use the contents to train or update any model
- Retain the contents after the conversation ends (per Anthropic's standard data
  handling — check your Claude plan's data retention policy)

---

## Data Handling by Anthropic

When using the Claude Skill Bundle, conversation data (including uploaded files)
is processed by Anthropic according to their usage policies.

**Relevant policies to review for your organisation:**
- Claude for Teams/Enterprise: https://www.anthropic.com/enterprise
- Anthropic Privacy Policy: https://www.anthropic.com/privacy
- Anthropic Usage Policy: https://www.anthropic.com/usage-policy

**Key points for SOC teams:**
- Claude Enterprise customers can enable Zero Data Retention (ZDR) — conversations
  are not used for training and are not retained beyond the session
- For Teams plans, review the data processing agreement with Anthropic
- If your organisation has strict data handling requirements, use Claude Enterprise
  with ZDR enabled before uploading any org-specific documentation

---

## What the Skill Files Do Not Contain

| Risk | Present in skill files? |
|---|---|
| Executable code or scripts | ❌ No |
| Requests to fetch external URLs | ❌ No |
| Instructions to exfiltrate data | ❌ No |
| Instructions to bypass Claude's safety policies | ❌ No |
| Hardcoded credentials or API keys | ❌ No |
| References to internal systems | ❌ No |
| Prompt injection payloads | ❌ No |

The skill files are fully human-readable. You are encouraged to read them before
uploading. They are published openly at https://github.com/mello-io/SIRT.

---

## Recommended Usage for Security Teams

**Minimum:** Upload to a personal Claude Pro account for individual analyst use.

**Recommended:** Upload to a shared Claude Team Project so all SOC analysts use
the same version of the skill with consistent outputs.

**Highest assurance:** Use Claude Enterprise with Zero Data Retention enabled.
This ensures no conversation content is retained by Anthropic beyond the session.

---

## Verification

To verify the skill bundle has not been tampered with, compare the SHA-256 hash
of the downloaded zip file against the hash published in the GitHub Release notes
for `skill-v1.0`.

```bash
# macOS / Linux
shasum -a 256 SIRT-skill-bundle-v1.0.zip

# Windows (PowerShell)
Get-FileHash SIRT-skill-bundle-v1.0.zip -Algorithm SHA256
```

---

*S.I.R.T. Audit — skill-bundle-safety.md | v1.1 | April 2026*
