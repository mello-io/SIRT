# output-format.md
> S.I.R.T. Companion File — Checklist Output Format Specification
> Version: v1.0 | April 2026

---

## How This File Is Used

This file defines the exact structure, formatting rules, and content requirements
for every checklist S.I.R.T. generates. All output must conform to this spec
without exception. This file governs Step 4 and Step 5 of the generation process.

---

## Output File Naming Convention

```
SIRT-[incident-sub-type-slug]-[YYYY-MM-DD].md

Examples:
SIRT-ransomware-2026-04-17.md
SIRT-credential-brute-force-2026-04-17.md
SIRT-c2-beaconing-2026-04-17.md
SIRT-cloud-account-compromise-2026-04-17.md
```

---

## Full Output Structure

Every generated checklist must follow this exact structure in this exact order:

---

### Section 1 — Header Block

```markdown
# SIRT: [Incident Sub-type Name] — [Organisation Name]

> **Organisation:** [org name from org-sec-stack.md]
> **Incident Type:** [category name] → [sub-type name]
> **Asset Type:** [asset type from incident-type.md]
> **Severity Tag:** [P1–P4] *(for tagging only — all incidents are treated as active priority)*
> **Detection Time:** [datetime from incident-type.md] *(use as time-filter anchor in tool queries)*
> **Generated:** [generation datetime]
> **S.I.R.T. Version:** v1.0
> **Prompt Version:** v1.0
>
> ---
> *This checklist is a procedural guide. All decision points are the analyst's
> determination. S.I.R.T. increases the speed of investigation — it does not
> replace analyst judgment.*
```

---

### Section 2 — Incident Overview

```markdown
## Incident Overview

[2–4 sentence description of the incident type in the context of this specific
asset type and org stack. Written to orient the analyst — what is this, why it
matters, what the likely attack chain looks like.]

**Analyst notes:** [analyst_notes from incident-type.md — or "None provided" if empty]
```

---

### Section 3 — MITRE ATT&CK Reference

```markdown
## MITRE ATT&CK Reference

| Technique ID | Technique Name | Tactic | Relevance |
|---|---|---|---|
| [T1xxx](https://attack.mitre.org/techniques/T1xxx/) | [Name] | [Tactic] | [1-sentence relevance to this incident] |
| [T1xxx](https://attack.mitre.org/techniques/T1xxx/) | [Name] | [Tactic] | [1-sentence relevance to this incident] |

*Reference: [MITRE ATT&CK®](https://attack.mitre.org) — MITRE ATT&CK is a registered
trademark of The MITRE Corporation.*
```

Rules:
- Include all MITRE technique IDs from incident-type.md
- Add any additional directly relevant techniques identified from incident-library.md
- Maximum 8 techniques in the table — prioritise most relevant
- Every technique ID must be a working hyperlink
- Tactic column uses official MITRE tactic names (Initial Access, Execution, Persistence, etc.)

---

### Section 4 — Procedural Checklist

The checklist is divided into 6 sequential phases. Each phase must be completed
before moving to the next. Every actionable step uses `- [ ]` checkbox format.

---

#### Phase 1 — Initial Verification

```markdown
## Phase 1 — Initial Verification

*Goal: Confirm the incident is real, not a false positive, and establish the
minimum viable picture needed to make the first decision.*

### [Tool Name 1] — Verify Alert
- [ ] [Specific navigation step in Tool Name 1]
- [ ] [Specific query or filter to apply — use detection time as time anchor]
- [ ] [Specific field or value to confirm]
- [ ] [Specific field or value to confirm]

### [Tool Name 2] — Corroborate
- [ ] [Specific step in Tool Name 2 to corroborate the alert from a second source]
- [ ] [What to look for and what it means if found]

### Initial Verification Notes
- [ ] Document: confirmed affected host/user/resource identity
- [ ] Document: first seen timestamp and last seen timestamp
- [ ] Document: confirming data sources reviewed

---
⚠️ DECISION POINT 1 — Initial Verification
> **Question:** Based on the evidence reviewed, is this a confirmed incident or a
> likely false positive?
>
> - If **false positive** → document reasoning and close the investigation.
>   Record why it was determined to be a false positive for future tuning.
> - If **confirmed incident** → proceed to Phase 2.
> - If **uncertain** → escalate to L2 for second opinion before proceeding.
```

---

#### Phase 2 — Scope Assessment

```markdown
## Phase 2 — Scope Assessment

*Goal: Determine the full extent of the incident — how far it has spread, what
assets and data are affected, and what the attack chain looks like so far.*

### [Tool Name] — Determine Blast Radius
- [ ] [Step to identify additional affected hosts/users/resources]
- [ ] [Step to check for lateral movement or spread]
- [ ] [Step to identify timeline of activity — earliest to latest event]

### [Tool Name] — Asset Context
- [ ] [Step to understand the affected asset's role and sensitivity]
- [ ] [Step to identify data or systems the asset has access to]

### [Tool Name] — Attack Chain Reconstruction
- [ ] [Step to trace the sequence of events from initial vector to current state]
- [ ] [What artefacts to collect and preserve at this stage]

### Scope Assessment Notes
- [ ] Document: list of all confirmed affected assets
- [ ] Document: estimated earliest indicator of compromise (IOC) timestamp
- [ ] Document: data or systems potentially exposed
- [ ] Document: current attack chain reconstruction (even if incomplete)

---
⚠️ DECISION POINT 2 — Scope Assessment
> **Question:** What is the current blast radius, and does it exceed L1 response capacity?
>
> - If **contained to a single asset** and no lateral movement detected → proceed to Phase 3.
> - If **multiple assets affected** or sensitive data potentially exposed → escalate to L2/L3
>   before proceeding. Do not attempt solo containment of a multi-asset incident.
> - If **scope is unclear** → complete Phase 3 containment on confirmed assets while
>   escalating for scope assistance.
```

---

#### Phase 3 — Containment

```markdown
## Phase 3 — Containment

*Goal: Stop the incident from spreading or causing further damage. Containment
preserves evidence and limits impact — it does not yet remove the threat.*

### [EDR Tool] — Host Isolation
- [ ] [Specific steps to isolate the affected host via EDR console]
- [ ] [Confirm isolation is active — what to verify in the console]
- [ ] [Note: isolated host can still communicate with EDR console for continued investigation]

### [NGFW Tool] — Network Block
- [ ] [Specific steps to block malicious IP/domain/traffic at the firewall]
- [ ] [Specific rule or policy to create/modify]
- [ ] [Confirm block is active and logging]

### [IAM Tool] — Account Action
- [ ] [Specific steps to disable, lock, or revoke the affected account/credential]
- [ ] [Specific steps to revoke active sessions]
- [ ] [Confirm account action is applied and logged]

### [Email Tool] — Message Containment (if applicable)
- [ ] [Steps to purge or quarantine malicious messages from all mailboxes]
- [ ] [Confirm purge completion and recipient count]

### Containment Evidence Preservation
- [ ] Export and save relevant logs from [Tool 1] before any changes
- [ ] Export and save relevant logs from [Tool 2] before any changes
- [ ] Document: all containment actions taken, by whom, and at what time

---
⚠️ DECISION POINT 3 — Containment Verification
> **Question:** Is the threat successfully contained — no active spread, no active
> exfiltration, no ongoing encryption or destruction?
>
> - If **yes, contained** → proceed to Phase 4.
> - If **containment is incomplete** → identify the remaining active component and
>   apply additional containment before proceeding.
> - If **containment cannot be achieved at L1** → escalate immediately.
```

---

#### Phase 4 — Eradication

```markdown
## Phase 4 — Eradication

*Goal: Remove the threat from the environment completely. Do not proceed to
recovery until eradication is confirmed.*

### [EDR Tool] — Threat Removal
- [ ] [Specific steps to identify and remove malicious files, processes, or artefacts]
- [ ] [Specific steps to check for and remove persistence mechanisms]
  - Scheduled tasks
  - Registry run keys
  - Startup folder entries
  - WMI subscriptions
  - Services

### [IAM Tool] — Credential Reset
- [ ] [Steps to reset passwords for all affected accounts]
- [ ] [Steps to re-enrol MFA for affected accounts]
- [ ] [Steps to audit and remove any unauthorized accounts, groups, or permissions created]

### [NGFW / NDR Tool] — IOC Blocking
- [ ] [Steps to add all identified malicious IPs, domains, and file hashes to block lists]
- [ ] [Confirm all IOCs from the investigation are blocked at the network and endpoint layer]

### Eradication Verification
- [ ] Re-scan affected hosts with [EDR/AV Tool] and confirm clean result
- [ ] Confirm no further malicious activity detected in [SIEM Tool] for [time window]
- [ ] Document: all artefacts removed and from which systems
```

---

#### Phase 5 — Recovery

```markdown
## Phase 5 — Recovery

*Goal: Restore affected systems to normal, verified operation. Do not rush
recovery — a premature return to service is a common cause of re-infection.*

### System Restoration
- [ ] [Steps to restore from backup OR re-image, depending on severity]
- [ ] [Steps to verify backup integrity before restoration]
- [ ] [Steps to confirm restored system is fully patched and hardened]

### [EDR Tool] — Re-enable and Monitor
- [ ] Remove host isolation in [EDR Tool]
- [ ] Confirm EDR agent is active and reporting on restored host
- [ ] Set host to enhanced monitoring for [recommended time window: 48–72 hours]

### Service Verification
- [ ] Confirm all affected services are operational
- [ ] Confirm no residual IOC activity in [SIEM Tool] post-recovery
- [ ] User or service owner signs off on return to normal operation

### Recovery Notes
- [ ] Document: recovery method used (restore vs. re-image)
- [ ] Document: recovery completion timestamp
- [ ] Document: any service impact during the recovery window
```

---

#### Phase 6 — Reporting & Escalation Decision

```markdown
## Phase 6 — Reporting & Escalation Decision

*Goal: Document the investigation, support escalation if required, and capture
learnings for future tuning.*

### Incident Summary (for report)
- [ ] Confirm: incident type and sub-type
- [ ] Confirm: affected assets (hostnames, IPs, user accounts)
- [ ] Confirm: estimated timeline (first indicator → detection → containment → eradication → recovery)
- [ ] Confirm: attack vector (how the incident started, if known)
- [ ] Confirm: data or systems exposed (if any)
- [ ] Confirm: all containment and eradication actions taken
- [ ] Confirm: current status (resolved / monitoring / escalated)

### MITRE ATT&CK Mapping (for report)
- [ ] Confirm all relevant MITRE techniques observed during investigation (from Section 3)
- [ ] Add any additional techniques observed that were not in the initial mapping

### IOC Summary (for report)
- [ ] List all confirmed IOCs: IPs, domains, file hashes, email addresses, URLs
- [ ] Confirm IOCs are submitted to [Threat Intelligence tool] if applicable

---
⚠️ DECISION POINT 4 — Escalation Decision
> **Question:** Does this incident require escalation to L2/L3 or management notification?
>
> Escalate if ANY of the following apply:
> - Confirmed data exfiltration or exposure of sensitive/regulated data
> - Attack affected more than 3 assets or a critical infrastructure system
> - Domain controller, cloud management plane, or PAM system was involved
> - Attack vector is unconfirmed and re-infection risk remains
> - Regulatory notification may be required (GDPR, HIPAA, PCI-DSS, etc.)
> - Full eradication could not be confirmed
> - Incident involves an insider threat or requires HR/legal involvement
>
> - If **escalating** → complete this checklist and attach it to the escalation ticket.
> - If **resolving at L1** → complete the incident report and close the case.

### Post-Incident Actions
- [ ] Submit IOCs to threat intelligence platform
- [ ] Document: recommended SIEM tuning or new detection rule for this incident pattern
- [ ] Document: any gaps in tooling or visibility identified during investigation
- [ ] Document: recommended policy or configuration change to prevent recurrence
```

---

## Formatting Rules

### Checkboxes
- Every actionable step uses `- [ ]` format
- No steps are written as prose — all steps are checkboxable
- Steps are specific and named — no generic steps

### Decision Points
- Always prefixed with `⚠️ DECISION POINT [N] —`
- Always phrased as a question followed by branching options
- Always formatted as a blockquote (`>`) for visual distinction
- Minimum 4 decision points per checklist (one per phase at: Phase 1, Phase 2, Phase 3, Phase 6)

### Tool Sections
- Each tool section is an H3 (`###`) with the format: `### [Exact Tool Name] — [Purpose]`
- Tool names must match exactly how they appear in the org-sec-stack.md
- Tool sections only appear if the tool is relevant to this incident type and asset type
- If a required tool category is not in the org stack, add a gap note:
  ```
  > ⚠️ No [category] tool detected in org stack. Perform this step manually
  > or consult your [category] vendor documentation.
  ```

### Tool Query Blocks
- Use fenced code blocks with the tool name as the language label
- Example:
  ````
  ```splunk
  index=main sourcetype=WinEventLog EventCode=4625 user="jsmith" earliest=-2h
  ```
  ````
- Detection time from incident-type.md must be used as a time anchor in at least one query per tool

### MITRE Tags
- Always rendered as hyperlinks: `[T1566](https://attack.mitre.org/techniques/T1566/)`
- Never appear as plain text IDs in the body of the checklist
- Sub-techniques use the full path: `[T1078.003](https://attack.mitre.org/techniques/T1078/003/)`

### Phase Headers
- Always H2 (`##`) with the exact phase name and number as defined in this spec
- Never skip or rename phases
- If a phase has no relevant steps for this specific incident + asset combination,
  include the phase header with a note: `> No specific steps for this incident
  type and asset type combination. Review standard procedure.`

---

## Quality Checklist (S.I.R.T. internal — verify before output)

- [ ] All 6 phases are present
- [ ] Minimum 4 decision points present (Phases 1, 2, 3, 6)
- [ ] Every tool in the org stack relevant to this incident has at least one named step
- [ ] Every MITRE technique ID is a working hyperlink
- [ ] Detection time from incident-type.md is used in at least one tool query
- [ ] Severity tag appears in the header only — not referenced in the body
- [ ] Gap notes are present for any missing tool categories
- [ ] IOC summary section is present in Phase 6
- [ ] Escalation criteria in Phase 6 are specific — not generic
- [ ] Output is valid markdown — all tables, code blocks, and headers are correctly formatted
- [ ] MITRE ATT&CK attribution note is present in Section 3

---

*S.I.R.T. Companion File — output-format.md v1.0 | April 2026*
