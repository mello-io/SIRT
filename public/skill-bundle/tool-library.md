# tool-library.md
> S.I.R.T. Companion File — Security Tool Reference Library
> Version: v1.0 | April 2026

---

## How This File Is Used

This file provides S.I.R.T. with tool-specific investigation guidance for each
supported security product. When a tool appears in an analyst's org-sec-stack.md,
the relevant section here informs the specific steps, navigation paths, query
patterns, and fields to reference in the generated checklist.

---

## SIEM

### Splunk Enterprise Security
**Investigation approach:** Search via SPL (Splunk Processing Language) in Search & Reporting.
Use the Security Posture dashboard for initial orientation. Use Notable Events for triaged alerts.

**Key investigation areas:**
- `index=*` searches scoped by sourcetype and time window
- Correlation searches for automated alert review
- Risk-Based Alerting (RBA) risk score analysis
- Threat Intelligence framework for IOC lookup
- Asset and Identity framework for context enrichment

**Useful SPL patterns:**
```splunk
# Authentication failures for a specific user
index=main sourcetype=WinEventLog EventCode=4625 user="[username]" earliest=-2h

# Outbound connections from a host
index=network sourcetype=firewall src_ip="[host_ip]" dest_port!=80 dest_port!=443 earliest=-1h

# Process execution on endpoint
index=endpoint sourcetype=sysmon EventCode=1 host="[hostname]" earliest=-2h
```

---

### Microsoft Sentinel
**Investigation approach:** Use the Incidents blade as the starting point. Pivot to
Logs (KQL) for deep investigation. Use Investigation Graph for relationship mapping.

**Key investigation areas:**
- Incidents blade → incident timeline and entity mapping
- Logs blade → KQL queries against Log Analytics workspace
- Hunting → pre-built and custom hunting queries
- Workbooks → pre-built investigation workbooks
- UEBA → User and Entity Behaviour Analytics for anomaly context

**Useful KQL patterns:**
```kql
// Failed sign-ins for a specific user
SigninLogs
| where TimeGenerated > ago(2h)
| where UserPrincipalName == "[user@domain.com]"
| where ResultType != 0
| project TimeGenerated, UserPrincipalName, IPAddress, Location, ResultDescription

// Network connections from a host
CommonSecurityLog
| where TimeGenerated > ago(1h)
| where SourceIP == "[host_ip]"
| where DestinationPort !in (80, 443)
| summarize count() by DestinationIP, DestinationPort
```

---

### IBM QRadar
**Investigation approach:** Use the Offenses tab for alert-driven investigation.
Use Log Activity and Network Activity for raw event review. Use Asset Profiler
for context on involved IPs and hosts.

**Key investigation areas:**
- Offenses tab → rule-triggered offense review and timeline
- Log Activity → filtered event search by source, event category, time
- Network Activity → flow data filtered by source/destination
- Asset Profiler → asset context and vulnerability exposure
- Reference Sets → IOC management and cross-offense correlation

---

### Elastic Security (SIEM)
**Investigation approach:** Use the Security → Alerts view as the entry point.
Pivot to Discover for raw log search using KQL/Lucene. Use Timeline for
investigation case building.

**Key investigation areas:**
- Alerts view → triaged detection alerts with rule context
- Timeline → build investigation chains, pin events
- Discover → raw log search across indices
- Hosts, Network, Users overview pages for entity context
- Cases → formal case management and notes

**Useful query patterns:**
```kql
# Elastic KQL — failed logins
event.category: "authentication" and event.outcome: "failure" and user.name: "[username]"

# Process events on a host
event.category: "process" and host.name: "[hostname]" and event.type: "start"
```

---

### Exabeam Fusion SIEM
**Investigation approach:** Use the Threat Hunter for timeline-based investigation.
Use Smart Timelines for user/entity behaviour analysis. Use Cases for incident tracking.

**Key investigation areas:**
- Threat Hunter → entity-centric timeline of events
- Smart Timelines → automated behavioural anomaly sequencing
- Data Lake → raw event search
- User/Entity 360 profiles → baseline vs anomaly comparison

---

### Rapid7 InsightIDR
**Investigation approach:** Use the Investigations view as the alert entry point.
Use Log Search for raw log queries. Use Attacker Behaviour Analytics (ABA) for
pre-built detections. Use Visual Investigator for relationship mapping.

**Key investigation areas:**
- Investigations → triaged alerts with recommended actions
- Log Search → LEQL queries across ingested log sources
- ABA → pre-mapped MITRE ATT&CK detections
- Visual Investigator → entity relationship graph
- User Authentication logs → user activity pivot

---

### Google Chronicle
**Investigation approach:** Use the Alert view for detection-driven entry.
Use UDM Search for raw event investigation. Use Enterprise Insights for
pre-built threat detections.

**Key investigation areas:**
- UDM Search → Unified Data Model event search
- Alert view → curated detection alerts
- Asset view → host-centric event timeline
- IOC Matches → threat intelligence hit review
- Investigation pivot: IP → domain → asset → user chain

---

### AlienVault USM Anywhere
**Investigation approach:** Use Alarms as the primary investigation entry point.
Use Events for raw log review. Use the built-in threat intelligence feed for IOC context.

**Key investigation areas:**
- Alarms → correlated event alarms with severity context
- Events → raw event search by source, category, time
- Vulnerabilities → vulnerability context for affected assets
- OTX integration → threat intelligence enrichment

---

### LogRhythm SIEM
**Investigation approach:** Use Cases as the investigation container. Use the
Alarm view for alert-driven entry. Use Web Console log search for event pivoting.

**Key investigation areas:**
- Alarm view → rule-triggered alarms
- Cases → investigation container with evidence and timeline
- Log Search → filtered event queries
- AI Engine → correlation rule review
- Network Monitor → traffic context

---

### Securonix SNYPR
**Investigation approach:** Use Spotter for NLP-powered log search. Use
Threats view for ML-detected behavioural anomalies. Use Cases for investigation tracking.

**Key investigation areas:**
- Threats view → behavioural anomaly detections
- Spotter → natural language and structured log search
- Cases → formal investigation management
- Watchlist → tracking of high-risk entities
- Risk scoring → entity risk trend analysis

---

## Next-Generation Firewall (NGFW)

### Palo Alto Networks PAN-OS
**Investigation approach:** Use Monitor → Traffic and Threat logs as the primary
investigation surface. Use the ACC (Application Command Center) for traffic trend context.

**Key investigation areas:**
- Monitor → Traffic logs → filter by source IP, destination IP, application, action
- Monitor → Threat logs → IPS/IDS alerts, URL filtering hits, WildFire verdicts
- Monitor → URL Filtering → web access history by user/IP
- ACC → top applications, top sources, top destinations
- WildFire → file verdict lookups and sandbox reports

**Investigation filters to apply:**
```
Traffic log: src.ip eq [host_ip] and action eq allow and time-range [detection window]
Threat log: src.ip eq [host_ip] and severity geq high
```

---

### Fortinet FortiGate
**Investigation approach:** Use Log & Report → Traffic and Security event logs.
Use the FortiView dashboard for visual traffic analysis. Use FortiAnalyzer if integrated.

**Key investigation areas:**
- Log & Report → Forward Traffic → filter by source/destination/policy
- Log & Report → Security Events → IPS, Application Control, Web Filter hits
- FortiView → Source, Destination, Application, Threat views
- Policy review for allowed/denied traffic context
- VPN logs for remote access investigation

---

### Check Point Quantum
**Investigation approach:** Use SmartLog for log analysis. Use SmartEvent for
correlation and incident management. Use Threat Prevention logs for IPS/AV/URL events.

**Key investigation areas:**
- SmartLog → real-time and historical log search
- SmartEvent → correlated security events and incidents
- Threat Prevention → IPS, Anti-Bot, Threat Emulation logs
- SmartView → traffic and security dashboards
- Forensics reports for deep file and connection analysis

---

### Cisco Firepower / FTD
**Investigation approach:** Use Firepower Management Center (FMC) Analysis tab.
Use Connection Events for traffic analysis and Intrusion Events for threat detections.

**Key investigation areas:**
- Analysis → Connection Events → filter by initiator/responder IP, application, action
- Analysis → Intrusion Events → IDS/IPS hit review
- Analysis → File Events → file transfer detection
- Analysis → Malware Events → AMP detection events
- Dashboard → overview and custom dashboards

---

### Sophos XGS Firewall
**Investigation approach:** Use the Log Viewer in the admin console. Use Sophos Central
if cloud-managed for centralised log access.

**Key investigation areas:**
- Log Viewer → Firewall, IPS, Web Filter, Application Control logs
- Reports → traffic reports by source/destination
- Synchronized Security → endpoint health context via Sophos Central

---

## EDR / MDR

### CrowdStrike Falcon
**Investigation approach:** Use the Falcon console Investigate → Process Timeline
and Event Search. Use Detections for alert-driven entry. Use Threat Graph for
relationship pivoting.

**Key investigation areas:**
- Detections → alert queue with severity, tactic, technique tagging
- Investigate → Event Search → filter by host, process, network, user events
- Investigate → Process Timeline → full process tree for a host
- Threat Graph → visual relationship mapping across entities
- Host management → containment (network isolation) from console
- Intelligence → IOC management and threat intel enrichment

**Useful Event Search queries:**
```
# Processes executed on a host
event_simpleName=ProcessRollup2 ComputerName="[hostname]" | earliest=-2h

# Network connections from a host
event_simpleName=NetworkConnectIP4 LocalAddressIP4="[host_ip]" | earliest=-1h

# File writes in temp directory
event_simpleName=PeFileWritten TargetDirectoryName="*\\Temp\\*" ComputerName="[hostname]"
```

---

### Microsoft Defender for Endpoint
**Investigation approach:** Use the Microsoft 365 Defender portal → Incidents & Alerts.
Use Advanced Hunting (KQL) for deep investigation. Use Device Timeline for host-centric view.

**Key investigation areas:**
- Incidents & Alerts → correlated incident view
- Device page → Device Timeline → full event sequence for a host
- Advanced Hunting → KQL queries across DeviceEvents, DeviceNetworkEvents, DeviceFileEvents tables
- Threat & Vulnerability Management → asset exposure context
- Live Response → remote investigation shell (when authorised)

**Useful Advanced Hunting queries:**
```kql
// Process events on a device
DeviceProcessEvents
| where Timestamp > ago(2h)
| where DeviceName == "[hostname]"
| project Timestamp, FileName, ProcessCommandLine, InitiatingProcessFileName

// Network events from a device
DeviceNetworkEvents
| where Timestamp > ago(1h)
| where DeviceName == "[hostname]"
| where RemotePort !in (80, 443)
| project Timestamp, RemoteIP, RemotePort, InitiatingProcessFileName
```

---

### SentinelOne Singularity
**Investigation approach:** Use the Singularity console Threats view for alert entry.
Use Deep Visibility for raw event hunting. Use the Storyline feature for automated
attack chain reconstruction.

**Key investigation areas:**
- Threats → alert queue with Storyline ID and kill chain context
- Deep Visibility → real-time and historical event query (EQL-based)
- Storyline → automated attack chain reconstruction per incident
- Network Isolation → one-click host containment from console
- Ranger → network discovery context for affected segments

---

### VMware Carbon Black EDR
**Investigation approach:** Use the Investigate page for process search. Use the
Binary Search for file/hash investigation. Use the Feed hits for threat intel matches.

**Key investigation areas:**
- Investigate → Process Search → filter by hostname, username, path, hash
- Investigate → Binary Search → file prevalence and reputation
- Watchlist → pre-configured detection triggers
- Process tree analysis for parent-child relationships
- Network connections tab per process

---

### Cortex XDR (Palo Alto Networks)
**Investigation approach:** Use the Incidents view as the primary investigation entry.
Use Causality Analysis for attack chain reconstruction. Use Query Builder for event hunting.

**Key investigation areas:**
- Incidents → correlated cross-source incidents
- Causality Analysis → root cause and attack chain view (Causality Chain)
- Query Builder → structured event hunting across endpoint, network, cloud
- Host isolation → one-click containment
- IOC management → block list and allow list management

---

### Elastic Endpoint Security
**Investigation approach:** Integrated with Elastic Security SIEM — use the same
Discover and Timeline workflow with endpoint-specific index patterns.

**Key investigation areas:**
- `logs-endpoint.events.*` index for endpoint telemetry
- Endpoint Alerts view for detection events
- Process, Network, File event types per host
- Elastic Agent status for health context

---

## Identity & Access Management (IAM) / PAM

### Microsoft Active Directory / Entra ID
**Investigation approach:** Use Azure AD Sign-in Logs and Audit Logs in the Azure portal.
Use AD Event Logs on domain controllers for on-prem investigation (forwarded to SIEM).

**Key investigation areas:**
- Azure AD Sign-in Logs → authentication events, location, device, MFA status
- Azure AD Audit Logs → directory changes, group membership, role assignments
- Conditional Access → policy hit/miss analysis for sign-in context
- Identity Protection → risk detections (leaked credentials, impossible travel, etc.)
- On-prem: Security Event Log → Event IDs 4624, 4625, 4648, 4768, 4769, 4776

**Key Windows Event IDs for investigation:**
```
4624 — Successful logon
4625 — Failed logon
4648 — Logon using explicit credentials
4720 — User account created
4728/4732 — Member added to privileged group
4768/4769 — Kerberos ticket request
4776 — NTLM authentication
4624 Logon Type 10 — Remote Interactive (RDP)
```

---

### Okta Workforce Identity
**Investigation approach:** Use the Okta Admin Console → System Log as the primary
investigation surface. Use the Reports section for pre-built security views.

**Key investigation areas:**
- System Log → event stream filterable by actor, target, event type, outcome
- Reports → Suspicious Activity, MFA enrollment status
- Security → ThreatInsight for anomaly flagging
- User profile → session history and device context
- Group membership and application assignment review

**System Log filter patterns:**
```
Filter: eventType eq "user.authentication.auth_via_mfa" AND outcome.result eq "FAILURE"
Filter: eventType eq "user.session.start" AND client.geographicalContext.country eq "[country]"
Filter: eventType eq "user.account.update_password"
```

---

### CyberArk Privileged Access Manager
**Investigation approach:** Use the CyberArk Vault Audit logs. Review session
recordings for privileged account activity. Use the Privileged Threat Analytics
(PTA) alerts if licensed.

**Key investigation areas:**
- Audit trail → privileged account access events by user and target system
- Session recordings → review recorded privileged sessions for the investigation window
- Safe access → who accessed which safe and when
- PTA → anomalous privileged behaviour alerts
- Just-in-time access → review temporary access grants

---

### BeyondTrust Privileged Remote Access
**Investigation approach:** Use the BeyondTrust Reporting interface for session
and access logs. Use the Audit and Session Logs for investigation.

**Key investigation areas:**
- Session Logs → privileged remote sessions with full recording access
- Audit Log → access request and approval history
- Jump Client inventory → remote endpoint context
- Credential checkout logs → which credentials were accessed and when

---

## Vulnerability Management

### Tenable Nessus / Tenable.io
**Investigation approach:** Use Tenable.io → Vulnerabilities view. Filter by
asset to understand exposure context of a compromised host.

**Key investigation areas:**
- Asset view → all vulnerabilities on a specific host
- Vulnerability details → CVE context, CVSS score, remediation guidance
- Scan history → when was the asset last scanned and what was the result
- Plugin ID search → look up specific CVEs affecting the environment
- Exposure score → asset risk context for scoping

---

### Qualys VMDR
**Investigation approach:** Use the Vulnerability Management module →
AssetView for asset-centric investigation.

**Key investigation areas:**
- AssetView → filter assets by IP, hostname, OS, tag
- Vulnerability posture per asset with CVE context
- Threat Intelligence → vulnerability exploit context
- Patch Management → remediation status per vulnerability

---

## Network Detection & Response (NDR)

### Darktrace Enterprise
**Investigation approach:** Use the Threat Visualiser as the primary investigation
surface. Use Event Log for detailed event timeline. Use AI Analyst summaries for
rapid orientation.

**Key investigation areas:**
- Threat Visualiser → entity-centric event graph
- AI Analyst → automated investigation summary and narrative
- Model Breach log → detection alerts with Darktrace model context
- Device/User summary pages → baseline vs. anomaly comparison
- Network traffic analysis → unusual connections, rare external destinations

---

### Vectra AI
**Investigation approach:** Use the Detections view for alert-driven entry.
Use the Hosts and Accounts views for entity-centric investigation.

**Key investigation areas:**
- Detections → AI-scored detections with attack phase tagging
- Hosts → host-centric detection and behaviour timeline
- Campaigns → correlated attack campaign view
- Recall → PCAP and metadata query for network forensics
- Privileged Access Analytics → lateral movement and credential abuse detections

---

### Zeek (Bro)
**Investigation approach:** Query Zeek log files directly or via SIEM integration.
Core logs for investigation: conn.log, dns.log, http.log, ssl.log, files.log, x509.log.

**Useful Zeek log queries (via SIEM or zeek-cut):**
```bash
# All connections from a host in a time window
cat conn.log | zeek-cut ts id.orig_h id.resp_h id.resp_p proto bytes | grep "[host_ip]"

# DNS queries from a host
cat dns.log | zeek-cut ts id.orig_h query answers | grep "[host_ip]"

# HTTP requests with unusual user agents
cat http.log | zeek-cut ts id.orig_h uri user_agent | grep -v "Mozilla"
```

---

### Suricata IDS/IPS
**Investigation approach:** Review Suricata alert logs (eve.json) via SIEM integration
or directly. Focus on signature category, severity, and source/destination context.

**Key investigation areas:**
- eve.json alert events → signature name, category, severity, source, destination
- Rule SID lookup → cross-reference with Emerging Threats or custom ruleset
- Flow context per alert → full connection metadata
- File extraction logs → files captured during inspection

---

## Threat Intelligence

### MISP
**Investigation approach:** Search MISP for IOC matches. Submit new IOCs discovered
during investigation for community sharing.

**Key investigation areas:**
- Event search → search for matching IPs, domains, hashes, email addresses
- Galaxy tags → threat actor and malware family context
- Correlation graph → related IOC relationships
- API → programmatic IOC lookup from SIEM or scripts

---

### Recorded Future
**Investigation approach:** Use the Intelligence Card for rapid IOC context.
Use Playbook Alerts for proactive threat monitoring.

**Key investigation areas:**
- Intelligence Card → risk score, related threat actors, observed malware families
- Malware analysis → known malware using this IOC
- Threat actor profile → TTPs, targets, historical activity
- Vulnerability intelligence → CVE context and exploit availability

---

### VirusTotal Enterprise
**Investigation approach:** Use for file hash, URL, IP, and domain reputation lookups.

**Key investigation areas:**
- File hash → detection ratio, sandbox behaviour report, MITRE technique tags
- IP/Domain → passive DNS, associated files, community comments
- Relationship graph → related IOC chain
- Retrohunt → search historical telemetry for an IOC

---

### OpenCTI
**Investigation approach:** Use the Knowledge Graph for threat intelligence relationship
mapping. Use the Investigation board for case-linked intelligence.

**Key investigation areas:**
- Indicators search → IOC lookup and relationship context
- Reports → threat intelligence reports relevant to the incident type
- Threat actors → TTP profiling for attribution context
- Investigation board → link intelligence to the active incident case

---

## Email Security

### Proofpoint Email Protection
**Investigation approach:** Use the Email & Data Loss Prevention portal → Message
Trace for email investigation. Use Targeted Attack Protection (TAP) for advanced threat context.

**Key investigation areas:**
- Message Trace → search by sender, recipient, subject, time, disposition
- TAP Dashboard → URL and attachment threat detections with click data
- Quarantine → review and release/delete quarantined messages
- Smart Search → advanced message attribute search
- DMARC/SPF/DKIM results → sender authentication context

---

### Microsoft Defender for Office 365
**Investigation approach:** Use the Microsoft 365 Defender portal → Email & Collaboration.
Use Threat Explorer for investigation. Use the Email Entity page for per-message analysis.

**Key investigation areas:**
- Threat Explorer → search delivered, blocked, and quarantined mail
- Email Entity page → full headers, delivery actions, URL detonation results
- Message Trace → delivery path and recipient action
- Attack Simulation Training → phishing susceptibility context
- Submissions → analyst-submitted IOCs for analysis

**Useful Threat Explorer filters:**
```
Filter: Delivery Action = Delivered | Recipient = [user] | Time = [detection window]
Filter: URL Click = Yes | Recipient = [user]
Filter: Sender = [domain] | Subject contains [keyword]
```

---

### Abnormal Security
**Investigation approach:** Use the Abnormal portal → Cases as the investigation
entry point. Abnormal provides pre-analysed case context with attack type classification.

**Key investigation areas:**
- Cases → attack type, attack vector, targeted users, remediation status
- Message details → full email analysis with attack reasoning
- Threat log → full ingested email event history
- Account takeover detections → anomalous mailbox behaviour

---

## Cloud Security

### AWS Security Hub + GuardDuty
**Investigation approach:** Use Security Hub as the aggregation point. Use GuardDuty
findings as the primary detection source. Pivot to CloudTrail for API-level investigation.

**Key investigation areas:**
- Security Hub → aggregated findings across GuardDuty, Inspector, Macie, Config
- GuardDuty → findings with threat intelligence context (IAM anomalies, crypto mining, recon)
- CloudTrail → API call history filterable by principal, event name, source IP, time
- S3 Server Access Logs → object-level access for data access investigation
- VPC Flow Logs → network traffic context (via CloudWatch Logs or S3)

**Useful CloudTrail query patterns (via Athena or CloudWatch Insights):**
```sql
-- All API calls from a specific IP
SELECT eventTime, userAgent, eventName, sourceIPAddress, requestParameters
FROM cloudtrail_logs
WHERE sourceIPAddress = '[attacker_ip]'
AND eventTime BETWEEN '[start]' AND '[end]'

-- IAM changes by a principal
SELECT eventTime, eventName, requestParameters
FROM cloudtrail_logs
WHERE userIdentity.arn LIKE '%[username]%'
AND eventName IN ('CreateUser','AttachUserPolicy','CreateAccessKey','PutUserPolicy')
```

---

### Microsoft Defender for Cloud
**Investigation approach:** Use the Defender for Cloud portal → Security Alerts
as the primary investigation entry. Pivot to Azure Monitor and Azure Activity Log
for deeper context.

**Key investigation areas:**
- Security Alerts → Defender for Cloud detection alerts with recommended actions
- Secure Score → environment hardening context
- Azure Activity Log → control plane API operations (resource creation, deletion, IAM changes)
- Azure Monitor → metrics and diagnostic logs for specific resources
- Defender for Cloud Apps (MCAS) → SaaS application anomaly detection

---

### Prisma Cloud (Palo Alto Networks)
**Investigation approach:** Use the Investigate console for cloud resource query.
Use Alerts for CSPM and runtime detections.

**Key investigation areas:**
- Investigate → RQL (Resource Query Language) for cloud asset and event investigation
- Alerts → CSPM policy violations and CWPP runtime detections
- Asset inventory → full cloud resource inventory with configuration context
- Audit logs → user and API activity within Prisma Cloud

---

*S.I.R.T. Companion File — tool-library.md v1.0 | April 2026*
