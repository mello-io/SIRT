# S.I.R.T. Claude Skill Bundle
> Security Incident Response Transcript — v1.0
> *SOAR for humans. Comprehensive IR checklists, tailored to your exact security stack.*

---

## What Is This?

This is the **S.I.R.T. Claude Skill Bundle** — a set of files you upload to your
own Claude account (Pro, Team, or Enterprise) to turn Claude into a Level 1 SOC
analyst assistant.

No API key. No extra cost. No third-party access to your incident data.
Everything runs inside your existing Claude subscription.

---

## What You Get

Upload this skill and provide two lightweight input files, and Claude will generate
a comprehensive, procedural incident response checklist — tailored to your exact
security stack — in seconds.

The output checklist covers:
- ✅ 6 IR phases: Verification → Scope → Containment → Eradication → Recovery → Reporting
- ✅ MITRE ATT&CK tags and linked technique references
- ✅ Tool-specific investigation steps for every product in your stack
- ✅ Explicit decision points so you always know when a call needs to be made
- ✅ Escalation criteria for L2/L3 hand-off
- ✅ IOC summary for reporting

---

## Files in This Bundle

| File | Purpose |
|---|---|
| `SKILL.md` | The core skill — upload this to Claude Projects |
| `incident-library.md` | Reference context for all 22 incident types |
| `tool-library.md` | Investigation guidance for 60+ security tools |
| `output-format.md` | Exact checklist format specification |
| `README.md` | This file |

---

## How to Install

### Step 1 — Get your org-sec-stack.md
Go to **[sirt-five.vercel.app](https://sirt-five.vercel.app)** and run the Stack Setup Wizard.
Select the security tools your organisation uses. Download your `org-sec-stack.md`.
Store it somewhere accessible — you will upload it each time you use the skill.

### Step 2 — Upload the Skill to Claude
1. Open [claude.ai](https://claude.ai) and go to **Projects**
2. Create a new Project: name it `S.I.R.T.` or your preferred name
3. Upload all files from this bundle to the Project knowledge base:
   - `SKILL.md`
   - `incident-library.md`
   - `tool-library.md`
   - `output-format.md`
4. The skill is now installed. It persists in this Project across all conversations.

> 💡 **Claude Team / Enterprise users:** Your Project is shared with your workspace.
> Upload the bundle once — your entire team can use it.

---

## How to Use (Per Incident)

### Step 1 — Generate an incident-type.md
Go to **[sirt-five.vercel.app/incident](https://sirt-five.vercel.app/incident)** and fill in the incident form:
- Select incident category and sub-type
- Select the affected asset type
- Add severity tag (optional — for tagging only)
- Add detection time (optional — used for tool query time anchors)
- Add any analyst notes

Download your `incident-type.md`.

### Step 2 — Start a conversation in your S.I.R.T. Project
Open Claude, go to your S.I.R.T. Project, and start a new conversation.

Upload both files:
- `org-sec-stack.md`
- `incident-type.md`

Then send this message (or just upload the files — S.I.R.T. will activate automatically):

```
Generate my IR checklist.
```

### Step 3 — Download and use your checklist
Claude will generate a complete `SIRT-[incident-type]-[date].md` checklist.

Copy the output or ask Claude to provide it as a downloadable file.
Store it in your incident folder, paste it into your ITSM ticket, or share it
with your team.

---

## Supported Incident Types

| # | Category | Sub-types |
|---|---|---|
| 1 | 🖥️ Endpoint / Host | Malware Execution, Ransomware, Suspicious Process / Code Injection |
| 2 | 🌐 Network | DDoS, C2 / Beaconing, Recon / Scanning, Lateral Movement |
| 3 | 🔑 Identity & Access | Brute Force, Privileged Account Abuse, MFA Bypass, Account Takeover |
| 4 | 📦 Data | Exfiltration, Insider Threat, Unauthorized Access |
| 5 | 🌍 Application / Web | Phishing, Web App Attack, Supply Chain Compromise |
| 6 | ☁️ Cloud & Infrastructure | Cloud Account Compromise, Misconfiguration, Container / K8s Threat |
| 7 | 🎭 Social Engineering | Business Email Compromise, Vishing / Smishing |

---

## Supported Security Tools (60+)

**SIEM:** Splunk ES, Microsoft Sentinel, IBM QRadar, Elastic Security, LogRhythm,
Exabeam, Rapid7 InsightIDR, Google Chronicle, AlienVault USM, Securonix, and more.

**NGFW:** Palo Alto PAN-OS, Fortinet FortiGate, Check Point Quantum, Cisco Firepower,
Sophos XGS, WatchGuard, SonicWall, pfSense/OPNsense, and more.

**EDR/MDR:** CrowdStrike Falcon, Microsoft Defender for Endpoint, SentinelOne,
Carbon Black, Cortex XDR, Elastic Endpoint, ESET Inspect, Sophos Intercept X, and more.

**IAM/PAM:** Microsoft Entra ID / AD, Okta, CyberArk, BeyondTrust, SailPoint,
Ping Identity, JumpCloud, HashiCorp Vault, and more.

**And:** Vulnerability Management, NDR, Threat Intelligence, Email Security,
Cloud Security platforms.

---

## Trigger Phrases

Once installed, you can use these shorthand phrases in any conversation inside
your S.I.R.T. Claude Project:

| Phrase | What It Does |
|---|---|
| `Generate my IR checklist.` | Full checklist from your uploaded files |
| `Summarise my stack.` | Confirms what tools were detected in your org-sec-stack.md |
| `What decision points matter?` | Returns only the decision point blocks — quick brief or L2 handoff |
| `Give me the IOC summary.` | Extracts all IOCs referenced in the checklist |
| `Escalation brief.` | 5–10 line escalation summary — paste into a ticket or send to L2/L3 |
| `What tools apply to this incident?` | Lists relevant tools from your stack for the loaded incident type |
| `Show me the MITRE mapping.` | Returns only the MITRE ATT&CK reference table |
| `Phase [N] only.` | Returns a single IR phase (e.g. `Phase 3 only.` = containment steps) |
| `Regenerate checklist.` | Fresh checklist generation from the same uploaded files |
| `What's missing from my stack?` | Flags tool category gaps relevant to the loaded incident type |

> Upload both `org-sec-stack.md` and `incident-type.md` before using any phrase.
> Run `Generate my IR checklist.` first before using extract or summary phrases.

---

## What S.I.R.T. Does Not Do

- ❌ Does not access your live systems or ingest real incident data
- ❌ Does not make final decisions — all decision points are yours
- ❌ Does not replace L2/L3 judgment on escalation
- ❌ Does not store your incident information
- ❌ Does not provide legal or compliance advice

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1.0 | April 2026 | Initial release — 22 incident types, 60+ tools, 6 IR phases |

---

## Want the Full Platform?

The S.I.R.T. web platform at **[sirt-five.vercel.app](https://sirt-five.vercel.app)** offers:
- Interactive stack setup wizard
- Incident type generator (produces your `incident-type.md`)
- Direct API-powered checklist generation (no manual file upload needed)
- Multi-LLM support: Anthropic, OpenAI, Google Gemini, Mistral

The skill bundle and the platform produce identical output — choose the workflow
that fits your team.

---

## License

AGPL-3.0 License — free to use, modify, and distribute with source disclosure.
Attribution required.

---

*S.I.R.T. v1.0 | April 2026 | [github.com/mello-io/SIRT](https://github.com/mello-io/SIRT)*
