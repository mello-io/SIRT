// S.I.R.T. MITRE ATT&CK Context
// Lookup table: incident sub-type ID → relevant MITRE techniques with descriptions and ATT&CK URLs.
// Used by build-user-prompt.ts to enrich the LLM context.

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  url: string;
  description: string;
}

export interface MitreContext {
  techniques: MitreTechnique[];
}

const MITRE_LOOKUP: Record<string, MitreContext> = {
  // 1.1 — Malware Execution
  "1.1": {
    techniques: [
      {
        id: "T1204",
        name: "User Execution",
        tactic: "Execution",
        url: "https://attack.mitre.org/techniques/T1204/",
        description:
          "Adversary relies on specific user actions (opening a file, clicking a link) to execute malicious code.",
      },
      {
        id: "T1059",
        name: "Command and Scripting Interpreter",
        tactic: "Execution",
        url: "https://attack.mitre.org/techniques/T1059/",
        description:
          "Adversary abuses command interpreters (PowerShell, cmd, bash, WMI) to execute commands or scripts.",
      },
    ],
  },

  // 1.2 — Ransomware
  "1.2": {
    techniques: [
      {
        id: "T1486",
        name: "Data Encrypted for Impact",
        tactic: "Impact",
        url: "https://attack.mitre.org/techniques/T1486/",
        description:
          "Adversary encrypts data on target systems to interrupt availability and extort payment.",
      },
      {
        id: "T1490",
        name: "Inhibit System Recovery",
        tactic: "Impact",
        url: "https://attack.mitre.org/techniques/T1490/",
        description:
          "Adversary deletes shadow copies, disables recovery services, or modifies boot configuration to prevent restoration.",
      },
    ],
  },

  // 1.3 — Suspicious Process / Code Injection
  "1.3": {
    techniques: [
      {
        id: "T1055",
        name: "Process Injection",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1055/",
        description:
          "Adversary injects malicious code into legitimate processes to evade detection and escalate privileges.",
      },
      {
        id: "T1036",
        name: "Masquerading",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1036/",
        description:
          "Adversary renames or disguises malicious binaries to appear as legitimate system processes.",
      },
    ],
  },

  // 2.1 — DDoS / Volumetric Attack
  "2.1": {
    techniques: [
      {
        id: "T1498",
        name: "Network Denial of Service",
        tactic: "Impact",
        url: "https://attack.mitre.org/techniques/T1498/",
        description:
          "Adversary sends high-volume traffic to degrade or deny network availability.",
      },
      {
        id: "T1499",
        name: "Endpoint Denial of Service",
        tactic: "Impact",
        url: "https://attack.mitre.org/techniques/T1499/",
        description:
          "Adversary exhausts system resources to degrade application or service availability.",
      },
    ],
  },

  // 2.2 — C2 / Beaconing Activity
  "2.2": {
    techniques: [
      {
        id: "T1071",
        name: "Application Layer Protocol",
        tactic: "Command and Control",
        url: "https://attack.mitre.org/techniques/T1071/",
        description:
          "Adversary communicates with compromised hosts over standard application protocols (HTTP/S, DNS, SMTP) to blend in.",
      },
      {
        id: "T1095",
        name: "Non-Application Layer Protocol",
        tactic: "Command and Control",
        url: "https://attack.mitre.org/techniques/T1095/",
        description:
          "Adversary uses non-standard or raw network protocols (ICMP, raw TCP/UDP) for C2 communications.",
      },
    ],
  },

  // 2.3 — Recon / Network Scanning
  "2.3": {
    techniques: [
      {
        id: "T1046",
        name: "Network Service Discovery",
        tactic: "Discovery",
        url: "https://attack.mitre.org/techniques/T1046/",
        description:
          "Adversary enumerates open ports and services on internal or external hosts.",
      },
      {
        id: "T1595",
        name: "Active Scanning",
        tactic: "Reconnaissance",
        url: "https://attack.mitre.org/techniques/T1595/",
        description:
          "Adversary actively probes infrastructure to gather information about hosts, services, and vulnerabilities.",
      },
    ],
  },

  // 2.4 — Lateral Movement
  "2.4": {
    techniques: [
      {
        id: "T1021",
        name: "Remote Services",
        tactic: "Lateral Movement",
        url: "https://attack.mitre.org/techniques/T1021/",
        description:
          "Adversary uses legitimate remote services (RDP, SSH, SMB, WinRM) to move between systems.",
      },
      {
        id: "T1570",
        name: "Lateral Tool Transfer",
        tactic: "Lateral Movement",
        url: "https://attack.mitre.org/techniques/T1570/",
        description:
          "Adversary transfers tools or malware between systems to facilitate further intrusion.",
      },
    ],
  },

  // 3.1 — Credential Brute Force
  "3.1": {
    techniques: [
      {
        id: "T1110",
        name: "Brute Force",
        tactic: "Credential Access",
        url: "https://attack.mitre.org/techniques/T1110/",
        description:
          "Adversary attempts to gain access by systematically trying passwords, including spraying, stuffing, and dictionary attacks.",
      },
    ],
  },

  // 3.2 — Privileged Account Abuse
  "3.2": {
    techniques: [
      {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1078/",
        description:
          "Adversary uses compromised legitimate credentials to access systems and bypass controls.",
      },
    ],
  },

  // 3.3 — MFA Bypass / Push Fatigue
  "3.3": {
    techniques: [
      {
        id: "T1621",
        name: "Multi-Factor Authentication Request Generation",
        tactic: "Credential Access",
        url: "https://attack.mitre.org/techniques/T1621/",
        description:
          "Adversary bombards a user with MFA push requests, hoping the user approves one out of frustration or confusion.",
      },
    ],
  },

  // 3.4 — Account Takeover / Impossible Travel
  "3.4": {
    techniques: [
      {
        id: "T1078.003",
        name: "Valid Accounts: Local Accounts",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1078/003/",
        description:
          "Adversary uses stolen session tokens or credentials to authenticate from geographically anomalous locations.",
      },
    ],
  },

  // 4.1 — Data Exfiltration
  "4.1": {
    techniques: [
      {
        id: "T1041",
        name: "Exfiltration Over C2 Channel",
        tactic: "Exfiltration",
        url: "https://attack.mitre.org/techniques/T1041/",
        description:
          "Adversary exfiltrates data over the existing C2 channel rather than a separate channel.",
      },
      {
        id: "T1048",
        name: "Exfiltration Over Alternative Protocol",
        tactic: "Exfiltration",
        url: "https://attack.mitre.org/techniques/T1048/",
        description:
          "Adversary exfiltrates data over a protocol different from the C2 channel (DNS tunnelling, FTP, cloud storage).",
      },
    ],
  },

  // 4.2 — Insider Threat / Data Misuse
  "4.2": {
    techniques: [
      {
        id: "T1052",
        name: "Exfiltration Over Physical Medium",
        tactic: "Exfiltration",
        url: "https://attack.mitre.org/techniques/T1052/",
        description:
          "Adversary (insider) exfiltrates data via physical media such as USB drives or external storage.",
      },
      {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1078/",
        description:
          "Insider uses their own legitimate credentials to access and misuse data beyond authorised scope.",
      },
    ],
  },

  // 4.3 — Unauthorized Data Access
  "4.3": {
    techniques: [
      {
        id: "T1530",
        name: "Data from Cloud Storage",
        tactic: "Collection",
        url: "https://attack.mitre.org/techniques/T1530/",
        description:
          "Adversary accesses data stored in cloud storage services (S3, Azure Blob, GCS) due to misconfiguration or compromised credentials.",
      },
    ],
  },

  // 5.1 — Phishing / Spear Phishing
  "5.1": {
    techniques: [
      {
        id: "T1566",
        name: "Phishing",
        tactic: "Initial Access",
        url: "https://attack.mitre.org/techniques/T1566/",
        description:
          "Adversary sends deceptive emails to harvest credentials, deliver malware, or redirect targets to malicious infrastructure.",
      },
    ],
  },

  // 5.2 — Web Application Attack
  "5.2": {
    techniques: [
      {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        tactic: "Initial Access",
        url: "https://attack.mitre.org/techniques/T1190/",
        description:
          "Adversary exploits vulnerabilities in internet-facing applications (SQLi, XSS, RCE, SSRF) to gain initial access.",
      },
    ],
  },

  // 5.3 — Supply Chain Compromise
  "5.3": {
    techniques: [
      {
        id: "T1195",
        name: "Supply Chain Compromise",
        tactic: "Initial Access",
        url: "https://attack.mitre.org/techniques/T1195/",
        description:
          "Adversary manipulates software, hardware, or service supply chain to compromise targets before delivery.",
      },
    ],
  },

  // 6.1 — Cloud Account Compromise
  "6.1": {
    techniques: [
      {
        id: "T1078.004",
        name: "Valid Accounts: Cloud Accounts",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1078/004/",
        description:
          "Adversary uses compromised cloud account credentials to access cloud management planes and services.",
      },
    ],
  },

  // 6.2 — Misconfiguration / Public Exposure
  "6.2": {
    techniques: [
      {
        id: "T1580",
        name: "Cloud Infrastructure Discovery",
        tactic: "Discovery",
        url: "https://attack.mitre.org/techniques/T1580/",
        description:
          "Adversary discovers cloud infrastructure (buckets, databases, APIs) exposed due to misconfigured access controls.",
      },
    ],
  },

  // 6.3 — Container / Kubernetes Threat
  "6.3": {
    techniques: [
      {
        id: "T1610",
        name: "Deploy Container",
        tactic: "Defense Evasion",
        url: "https://attack.mitre.org/techniques/T1610/",
        description:
          "Adversary deploys a malicious container to execute code or facilitate further access.",
      },
      {
        id: "T1609",
        name: "Container Administration Command",
        tactic: "Execution",
        url: "https://attack.mitre.org/techniques/T1609/",
        description:
          "Adversary abuses container administration interfaces (kubectl exec, Docker exec) to execute commands.",
      },
    ],
  },

  // 7.1 — Business Email Compromise (BEC)
  "7.1": {
    techniques: [
      {
        id: "T1534",
        name: "Internal Spearphishing",
        tactic: "Lateral Movement",
        url: "https://attack.mitre.org/techniques/T1534/",
        description:
          "Adversary uses a compromised internal email account to conduct phishing attacks against other employees.",
      },
      {
        id: "T1566",
        name: "Phishing",
        tactic: "Initial Access",
        url: "https://attack.mitre.org/techniques/T1566/",
        description:
          "Adversary impersonates an executive or supplier to redirect payments or extract sensitive information.",
      },
    ],
  },

  // 7.2 — Vishing / Smishing
  "7.2": {
    techniques: [
      {
        id: "T1598",
        name: "Phishing for Information",
        tactic: "Reconnaissance",
        url: "https://attack.mitre.org/techniques/T1598/",
        description:
          "Adversary uses voice calls or SMS messages to extract credentials, authorise actions, or install malware.",
      },
    ],
  },
};

export function getMitreContext(subTypeId: string): MitreContext {
  return MITRE_LOOKUP[subTypeId] ?? { techniques: [] };
}
