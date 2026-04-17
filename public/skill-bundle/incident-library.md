# incident-library.md
> S.I.R.T. Companion File — Incident Type Reference Library
> Version: v1.0 | April 2026

---

## How This File Is Used

This file provides S.I.R.T. with investigation context, phase-specific guidance,
and key indicator references for each of the 22 supported incident sub-types.
It is used during Step 2 and Step 4 of checklist generation.

---

## Category 1 — 🖥️ Endpoint / Host

### 1.1 Malware Execution
**MITRE Primary:** T1204 (User Execution), T1059 (Command and Scripting Interpreter)
**What it means:** A malicious file has been executed on an endpoint, either through
user interaction or automated delivery. May be a dropper, loader, or standalone payload.

**Key investigation indicators:**
- Unusual process spawning from browser, email client, or Office applications
- Execution of scripts (PowerShell, cmd, wscript, cscript, bash) by non-admin users
- New executable files in temp directories, AppData, Downloads
- Outbound connections from unexpected processes
- Process hollowing or unusual parent-child process relationships

**Phase-specific guidance:**
- *Initial Verification:* Confirm process execution in EDR telemetry. Hash the file if possible.
- *Scope Assessment:* Check for lateral movement from the affected host. Look for the same hash across other endpoints in SIEM.
- *Containment:* Isolate the endpoint via EDR. Block the file hash in EDR policy.
- *Eradication:* Remove malicious files. Check for persistence mechanisms (scheduled tasks, registry run keys, startup folders).
- *Recovery:* Restore from clean backup if system integrity is in question. Re-image if full compromise is suspected.

---

### 1.2 Ransomware
**MITRE Primary:** T1486 (Data Encrypted for Impact), T1490 (Inhibit System Recovery)
**What it means:** Ransomware has been deployed on one or more endpoints. Files are
being or have been encrypted. Shadow copies and backups may be targeted.

**Key investigation indicators:**
- Mass file rename activity (extensions changed to unusual suffixes)
- High volume of file write/modify operations in short time window
- Deletion of shadow copies (vssadmin, wmic, bcdedit commands)
- Ransom note files dropped across directories
- Rapid network share traversal from a single host

**Phase-specific guidance:**
- *Initial Verification:* Confirm encryption activity in EDR. Identify patient zero host.
- *Scope Assessment:* Determine blast radius — how many hosts, which shares, which backups affected. This is the most critical scoping step.
- *Containment:* Network isolation is the immediate priority. Isolate affected hosts and segments. Disable compromised accounts.
- *Eradication:* Do not attempt decryption before full eradication. Identify and remove ransomware binary and persistence.
- *Recovery:* Restore from last known clean backup. Verify backup integrity before restoration.

**⚠️ Critical decision point:** Before containment, confirm whether ransomware is still actively encrypting. If yes — network isolation takes absolute priority over investigation.

---

### 1.3 Suspicious Process / Code Injection
**MITRE Primary:** T1055 (Process Injection), T1036 (Masquerading)
**What it means:** A process is behaving abnormally — injecting code into another
process, masquerading as a legitimate process, or executing from an unexpected location.

**Key investigation indicators:**
- Legitimate process names running from non-standard paths (svchost.exe from Desktop)
- Unsigned or low-prevalence processes making network connections
- Process hollowing indicators in EDR (CreateRemoteThread, WriteProcessMemory events)
- DLL loading from unusual locations
- Processes with no command-line arguments that typically require them

**Phase-specific guidance:**
- *Initial Verification:* Confirm process anomaly in EDR. Check process tree for parent-child relationships.
- *Scope Assessment:* Determine if injection has achieved persistence or lateral movement.
- *Containment:* Isolate host. Kill suspicious processes.
- *Eradication:* Identify and remove injected DLLs or hollowed processes. Check for persistence.

---

## Category 2 — 🌐 Network

### 2.1 DDoS / Volumetric Attack
**MITRE Primary:** T1498 (Network Denial of Service), T1499 (Endpoint Denial of Service)
**What it means:** Inbound or outbound volumetric traffic is degrading or disrupting
service availability. May be amplification-based, protocol-based, or application-layer.

**Key investigation indicators:**
- Traffic volume spikes in NGFW or NDR far above baseline
- Single or distributed sources sending high packet/request rates
- Protocol anomalies: UDP floods, SYN floods, ICMP floods, HTTP floods
- Service degradation alerts from monitoring systems
- Asymmetric traffic patterns (high inbound, low response)

**Phase-specific guidance:**
- *Initial Verification:* Confirm attack type (volumetric vs application layer) and source IP distribution in NGFW.
- *Scope Assessment:* Identify affected services and downstream impact.
- *Containment:* Apply rate limiting or upstream null routing. Engage upstream ISP if needed.
- *Eradication:* DDoS does not leave persistent artefacts — focus on ensuring no secondary intrusion occurred under cover of the attack.

---

### 2.2 C2 / Beaconing Activity
**MITRE Primary:** T1071 (Application Layer Protocol), T1095 (Non-Application Layer Protocol)
**What it means:** An internal host is communicating with an external command and control
server on a regular, automated schedule — indicating a compromised host awaiting instructions.

**Key investigation indicators:**
- Regular outbound connections at consistent intervals (jitter-adjusted beaconing)
- Communication over unusual ports or protocols (DNS, HTTPS to non-CDN IPs)
- Low-and-slow data transfers to external IPs with low reputation scores
- Domain generation algorithm (DGA) traffic patterns
- Encoded payloads in DNS TXT records or HTTP headers

**Phase-specific guidance:**
- *Initial Verification:* Confirm beaconing pattern in NDR or NGFW. Calculate beacon interval and jitter.
- *Scope Assessment:* Identify all hosts communicating with the same external IP/domain. Check for lateral movement from beaconing host.
- *Containment:* Block C2 IP/domain at NGFW. Isolate beaconing host.
- *Eradication:* Identify and remove the implant. Check for persistence and secondary payloads.

---

### 2.3 Recon / Network Scanning
**MITRE Primary:** T1046 (Network Service Discovery), T1595 (Active Scanning)
**What it means:** Internal or external scanning activity is mapping the network —
identifying live hosts, open ports, services, or vulnerabilities.

**Key investigation indicators:**
- Sequential or distributed port scan patterns in NGFW or NDR
- ICMP sweep activity across subnets
- Unusually high failed connection attempts from a single source
- Service fingerprinting requests (banner grabbing)
- Scanning tools detected on an internal host (nmap, masscan, Nessus scans outside maintenance windows)

**Phase-specific guidance:**
- *Initial Verification:* Confirm source of scanning — internal host, external IP, or authorised scanner.
- *Scope Assessment:* If internal — determine if the scanning host is compromised. If external — assess what was exposed.
- *Containment:* If unauthorised internal scanner — isolate host. If external — ensure NGFW is blocking appropriately.

---

### 2.4 Lateral Movement
**MITRE Primary:** T1021 (Remote Services), T1570 (Lateral Tool Transfer)
**What it means:** An attacker is moving through the network from an initial foothold,
accessing additional systems using legitimate or stolen credentials and remote services.

**Key investigation indicators:**
- Unusual RDP, WinRM, or SMB connections between internal hosts
- Admin shares accessed from non-admin workstations
- Pass-the-hash or pass-the-ticket authentication anomalies in IAM/SIEM
- Tools transferred between internal hosts (PSExec, WMI, BITS)
- New service installations or scheduled tasks on remote hosts

**Phase-specific guidance:**
- *Initial Verification:* Establish the movement chain — which host to which host, using which credential.
- *Scope Assessment:* Map the full extent of lateral movement. This is the most critical scoping task for lateral movement incidents.
- *Containment:* Disable compromised accounts. Block lateral movement paths (disable SMB laterally where possible).
- *Eradication:* Remove tools and payloads left on each compromised host. Reset all affected credentials.

---

## Category 3 — 🔑 Identity & Access

### 3.1 Credential Brute Force
**MITRE Primary:** T1110 (Brute Force)
**What it means:** An attacker is attempting to authenticate to a service or account
using systematic password guessing — dictionary attacks, credential stuffing, or pure
brute force.

**Key investigation indicators:**
- High volume of failed authentication attempts against one or multiple accounts
- Attempts from a single IP or distributed across many IPs (credential stuffing)
- Attempts targeting VPN, OWA, O365, SSH, or RDP endpoints
- Successful authentication following a sequence of failures (account compromise)
- Attempts at unusual hours or from unusual geographies

**Phase-specific guidance:**
- *Initial Verification:* Confirm authentication failure volume and source in SIEM or IAM logs.
- *Scope Assessment:* Identify if any attempts succeeded. Check for subsequent activity on any successfully authenticated accounts.
- *Containment:* Lock targeted accounts if at risk. Block offending IPs at NGFW.
- *Eradication:* Reset passwords on any accounts with post-failure successful logins.

---

### 3.2 Privileged Account Abuse
**MITRE Primary:** T1078 (Valid Accounts)
**What it means:** A privileged account (admin, service account, domain admin) is being
used in ways inconsistent with its normal behaviour — either by a compromised insider
or an attacker who has obtained the credentials.

**Key investigation indicators:**
- Admin account used at unusual hours or from unusual hosts
- Service accounts performing interactive logins
- Bulk permission changes or group membership modifications
- Access to sensitive resources not normally accessed by that account
- New admin accounts created outside of change management process

**Phase-specific guidance:**
- *Initial Verification:* Confirm anomalous privileged account activity in IAM/SIEM.
- *Scope Assessment:* Map all actions taken by the account during the suspicious window.
- *Containment:* Disable the account. Do not delete — preserve evidence.
- *Eradication:* Remove any changes made (new accounts, group memberships, permissions).

---

### 3.3 MFA Bypass / Push Fatigue
**MITRE Primary:** T1621 (Multi-Factor Authentication Request Generation)
**What it means:** An attacker with a valid password is bombarding a user with MFA
push notifications in hopes the user approves out of fatigue or confusion. May also
cover SIM swapping or OTP phishing.

**Key investigation indicators:**
- Burst of MFA push requests to a single user in a short window
- MFA approval from a different device or location than the login attempt
- MFA approval immediately following the burst (fatigue acceptance)
- Subsequent account activity from an unusual location after MFA bypass
- User reports receiving unexpected MFA prompts

**Phase-specific guidance:**
- *Initial Verification:* Confirm MFA push storm in IAM logs. Verify if any approval was granted.
- *Scope Assessment:* If approved — treat as full account compromise. Trace all post-approval activity.
- *Containment:* Revoke active sessions. Reset MFA enrolment. Temporarily block external access for the account.
- *Eradication:* Investigate how the attacker obtained the valid password. Check for phishing or credential exposure.

---

### 3.4 Account Takeover / Impossible Travel
**MITRE Primary:** T1078.003 (Cloud Accounts)
**What it means:** A user account is showing signs of being controlled by an
unauthorized party — often surfaced by geographic impossibility (login from two
countries minutes apart) or behavioural anomaly.

**Key investigation indicators:**
- Login from two geographically impossible locations within a short time window
- New device or browser fingerprint on an established account
- Bulk email forwarding rules created shortly after login
- Sensitive data download spikes post-login
- Account settings changes (recovery email, phone number, MFA device)

**Phase-specific guidance:**
- *Initial Verification:* Confirm impossible travel or anomaly in IAM/SIEM. Contact the user directly to verify legitimacy.
- *Scope Assessment:* Map all actions taken during the suspicious session.
- *Containment:* Revoke active sessions. Force password reset. Disable suspicious forwarding rules.

---

## Category 4 — 📦 Data

### 4.1 Data Exfiltration
**MITRE Primary:** T1041 (Exfiltration Over C2 Channel), T1048 (Exfiltration Over Alternative Protocol)
**What it means:** Sensitive data is being transferred out of the organisation's
environment to an external destination — deliberately or via an automated exfil tool.

**Key investigation indicators:**
- Large outbound data transfers to external IPs or cloud storage services
- Compressed or encrypted archives staged before transfer
- Exfiltration over unusual protocols (DNS, ICMP, HTTPS to personal cloud)
- Bulk file access or download events in SIEM or DLP
- Exfiltration via email attachment to external address

**Phase-specific guidance:**
- *Initial Verification:* Confirm data transfer volume and destination in NGFW or NDR. Identify source host and user.
- *Scope Assessment:* Determine what data was accessed and transferred. Data classification is critical here.
- *Containment:* Block outbound destination. Isolate source host. Preserve transfer logs for evidence.
- *Eradication:* Remove exfil tools or scripts. Revoke credentials used in the exfil path.

---

### 4.2 Insider Threat / Data Misuse
**MITRE Primary:** T1052 (Exfiltration Over Physical Medium), T1078 (Valid Accounts)
**What it means:** A current or departing employee, contractor, or insider is
accessing, copying, or transferring data in ways that violate policy — whether
malicious or negligent.

**Key investigation indicators:**
- Bulk file access or download outside of normal working patterns
- USB or removable media activity on corporate endpoints
- Access to data outside the user's role or department
- Large email attachments sent to personal addresses
- Unusual activity in the period surrounding resignation or termination

**Phase-specific guidance:**
- *Initial Verification:* Confirm anomalous data access in SIEM or DLP. Note the user context.
- *Scope Assessment:* Determine the full extent of data touched, copied, or transferred.
- *Containment:* Requires HR and legal coordination — do not act unilaterally. Preserve evidence carefully.

⚠️ Note: Insider threat investigations have legal and HR dimensions. Escalate to appropriate stakeholders before taking containment action.

---

### 4.3 Unauthorized Data Access
**MITRE Primary:** T1530 (Data from Cloud Storage)
**What it means:** Data is being accessed by a user or system that should not have
access — whether through misconfigured permissions, privilege escalation, or stolen credentials.

**Key investigation indicators:**
- Access to data repositories outside a user's normal scope
- Service account accessing sensitive files interactively
- Cloud storage bucket access from unexpected principals
- Database queries from non-standard applications or users
- Access control audit log anomalies

**Phase-specific guidance:**
- *Initial Verification:* Confirm unauthorized access event in SIEM or cloud audit logs.
- *Scope Assessment:* Determine what was accessed and whether it was exfiltrated.
- *Containment:* Revoke the access path. Reset the credential if stolen credentials are suspected.
- *Eradication:* Correct the permission misconfiguration. Audit similar permissions across the environment.

---

## Category 5 — 🌍 Application / Web

### 5.1 Phishing / Spear Phishing
**MITRE Primary:** T1566 (Phishing)
**What it means:** A malicious email has been delivered to one or more users, designed
to steal credentials, deliver malware, or manipulate the recipient into taking a
harmful action.

**Key investigation indicators:**
- User reports a suspicious email
- Email gateway alert on a delivered message
- Malicious URL or attachment detected post-delivery
- Credential submission to a lookalike domain
- Email-delivered malware execution (see also 1.1)

**Phase-specific guidance:**
- *Initial Verification:* Obtain and analyse the original email headers and body. Confirm sender, URLs, and attachments.
- *Scope Assessment:* Determine delivery scope — how many users received the same or similar message. Check for URL clicks or attachment opens.
- *Containment:* Pull the email from all mailboxes. Block sender domain and malicious URLs at email gateway and NGFW.
- *Eradication:* Reset credentials for any users who submitted to a phishing page. Remediate any endpoints where attachments were opened.

---

### 5.2 Web Application Attack (SQLi, XSS, RCE)
**MITRE Primary:** T1190 (Exploit Public-Facing Application)
**What it means:** An attacker is exploiting a vulnerability in a web application —
injecting SQL, executing scripts in a user's browser, or achieving remote code execution
on the web server.

**Key investigation indicators:**
- WAF alerts on injection patterns (SQL, XSS, command injection)
- Unusual error patterns or 500-series responses in web logs
- Database queries originating from the web application tier
- New files written to web directories
- Web shell indicators in access logs (unusual URIs, base64 in parameters)

**Phase-specific guidance:**
- *Initial Verification:* Review WAF and web server logs for attack pattern. Identify target endpoint and payload.
- *Scope Assessment:* Determine if exploitation was successful. Check for post-exploitation activity on the web server host.
- *Containment:* Block attacker IP at NGFW/WAF. Temporarily take the affected endpoint offline if exploitation is confirmed.
- *Eradication:* Remove any web shells or dropped files. Patch the vulnerability.

---

### 5.3 Supply Chain Compromise
**MITRE Primary:** T1195 (Supply Chain Compromise)
**What it means:** A trusted third-party software, library, or service provider has been
compromised, and the malicious modification has been introduced into the organisation's
environment through a trusted update or dependency.

**Key investigation indicators:**
- Malicious behaviour originating from a legitimately installed and signed application
- Vendor or industry advisory about a compromised software component
- Unexpected network connections from trusted software
- Unusual behaviour pattern appearing across multiple hosts after a software update

**Phase-specific guidance:**
- *Initial Verification:* Confirm the compromised component version and scope of deployment in the environment.
- *Scope Assessment:* Identify all hosts running the affected version.
- *Containment:* Block network activity from the compromised component at NGFW. Isolate highest-risk hosts.
- *Eradication:* Remove or update the compromised component. This is typically vendor-driven — follow their guidance.

---

## Category 6 — ☁️ Cloud & Infrastructure

### 6.1 Cloud Account Compromise
**MITRE Primary:** T1078.004 (Cloud Accounts)
**What it means:** A cloud provider account (AWS IAM, Azure AD, GCP) has been
compromised — through stolen API keys, credential phishing, or misconfigured access.

**Key investigation indicators:**
- API calls from unusual geographies or IP addresses
- New IAM users, roles, or access keys created
- CloudTrail / Azure Activity Log anomalies
- Compute resource provisioning spikes (cryptomining)
- Bucket or blob storage permissions changed to public
- Console login from an unfamiliar device

**Phase-specific guidance:**
- *Initial Verification:* Confirm anomalous API activity in cloud audit logs (CloudTrail, Azure Monitor, GCP Audit Logs).
- *Scope Assessment:* Determine what the compromised principal has accessed or modified.
- *Containment:* Revoke the compromised credential immediately. Disable affected IAM users or roles.
- *Eradication:* Audit all changes made during the compromise window. Reverse unauthorized changes.

---

### 6.2 Misconfiguration / Public Exposure
**MITRE Primary:** T1580 (Cloud Infrastructure Discovery)
**What it means:** A cloud resource (S3 bucket, blob storage, security group, database)
has been misconfigured to allow unintended public or unauthorised access.

**Key investigation indicators:**
- Vulnerability scan or CSPM alert on public-facing resource
- External discovery via Shodan, GreyNoise, or similar
- Unexpected access logs on a storage resource
- Security group allowing 0.0.0.0/0 on sensitive ports
- Database or API endpoint reachable without authentication

**Phase-specific guidance:**
- *Initial Verification:* Confirm the exposed resource and assess what data or access it exposes.
- *Scope Assessment:* Determine if the exposure has been discovered and accessed externally. Review access logs.
- *Containment:* Immediately remediate the misconfiguration. This is the primary containment action.
- *Eradication:* Audit similar configurations across the cloud environment.

---

### 6.3 Container / Kubernetes Threat
**MITRE Primary:** T1610 (Deploy Container), T1609 (Container Administration Command)
**What it means:** A threat actor has compromised a container, escaped a container
boundary, or gained unauthorized access to Kubernetes cluster management.

**Key investigation indicators:**
- Privileged container creation outside of normal deployment pipelines
- kubectl commands executed from unexpected sources
- Container escape indicators (access to host filesystem from within container)
- Unusual network traffic from a pod
- New ClusterRoleBindings granting excessive permissions

**Phase-specific guidance:**
- *Initial Verification:* Confirm anomalous container or cluster activity in Kubernetes audit logs.
- *Scope Assessment:* Determine if container escape has been achieved. Assess access to the underlying node.
- *Containment:* Delete the compromised pod. Quarantine the node if escape is confirmed.
- *Eradication:* Identify the initial attack vector (vulnerable image, exposed API server, misconfigured RBAC).

---

## Category 7 — 🎭 Social Engineering

### 7.1 Business Email Compromise (BEC)
**MITRE Primary:** T1534 (Internal Spearphishing), T1566 (Phishing)
**What it means:** An attacker is impersonating a trusted internal or external party
via email to manipulate an employee into transferring funds, changing payment details,
or disclosing sensitive information.

**Key investigation indicators:**
- Email from a lookalike domain (micros0ft.com vs microsoft.com)
- Display name spoofing with mismatched reply-to address
- Request for urgent wire transfer or payment change
- Internal email forwarding rules created to monitor conversations
- Email account compromise used to send BEC from a legitimate account

**Phase-specific guidance:**
- *Initial Verification:* Analyse email headers. Confirm if the sending account is legitimate or compromised.
- *Scope Assessment:* Determine if any financial action was taken. Contact Finance/Accounts Payable immediately if a transfer is in progress.
- *Containment:* Block the sender. If account is compromised, treat as Account Takeover (3.4).
- *Eradication:* Remove malicious forwarding rules. Alert finance teams to verify any recent payment changes.

⚠️ If a wire transfer has been initiated, this is a time-critical financial incident. Escalate immediately and contact the sending bank.

---

### 7.2 Vishing / Smishing
**MITRE Primary:** T1598 (Phishing for Information)
**What it means:** An attacker is using phone calls (vishing) or SMS messages (smishing)
to social engineer employees into disclosing credentials, MFA codes, or sensitive information.

**Key investigation indicators:**
- Employee reports a suspicious phone call requesting credentials or access
- SMS messages with malicious links sent to corporate devices
- MFA codes requested over the phone by someone claiming to be IT/vendor
- Credential use from unusual location shortly after a vishing report

**Phase-specific guidance:**
- *Initial Verification:* Interview the affected employee. Determine what information was disclosed.
- *Scope Assessment:* If credentials were disclosed — treat as Account Takeover (3.4). If MFA codes were shared — treat as MFA Bypass (3.3).
- *Containment:* Reset disclosed credentials immediately. Alert the broader user population if a campaign is suspected.

---

*S.I.R.T. Companion File — incident-library.md v1.0 | April 2026*
