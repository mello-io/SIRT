// S.I.R.T. Incident Type Library — 7 categories / 22 sub-types
// Source of truth: PRD.md Section 4

export interface IncidentSubType {
  id: string;
  name: string;
  mitreTags: string[];
  description: string;
}

export interface IncidentCategory {
  id: number;
  name: string;
  icon: string;
  slug: string;
  subTypes: IncidentSubType[];
}

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  {
    id: 1,
    name: "Endpoint / Host",
    icon: "🖥️",
    slug: "endpoint-host",
    subTypes: [
      {
        id: "1.1",
        name: "Malware Execution",
        mitreTags: ["T1204", "T1059"],
        description:
          "Malicious code executed on an endpoint via user action or automated delivery. Covers trojans, RATs, droppers, and script-based payloads.",
      },
      {
        id: "1.2",
        name: "Ransomware",
        mitreTags: ["T1486", "T1490"],
        description:
          "File-encrypting malware deployed to extort the organisation. Often follows lateral movement. Requires immediate isolation and backup assessment.",
      },
      {
        id: "1.3",
        name: "Suspicious Process / Code Injection",
        mitreTags: ["T1055", "T1036"],
        description:
          "Anomalous process behaviour including hollowing, injection into legitimate processes, or masquerading as system binaries.",
      },
    ],
  },
  {
    id: 2,
    name: "Network",
    icon: "🌐",
    slug: "network",
    subTypes: [
      {
        id: "2.1",
        name: "DDoS / Volumetric Attack",
        mitreTags: ["T1498", "T1499"],
        description:
          "High-volume traffic flooding network or application layer resources. May target firewall, load balancer, or application endpoints.",
      },
      {
        id: "2.2",
        name: "C2 / Beaconing Activity",
        mitreTags: ["T1071", "T1095"],
        description:
          "Compromised host communicating with attacker-controlled infrastructure. Periodic outbound connections over HTTP/S, DNS, or custom protocol.",
      },
      {
        id: "2.3",
        name: "Recon / Network Scanning",
        mitreTags: ["T1046", "T1595"],
        description:
          "Internal or external scanning of network topology, open ports, or service versions. May be pre-cursor to lateral movement or exploitation.",
      },
      {
        id: "2.4",
        name: "Lateral Movement",
        mitreTags: ["T1021", "T1570"],
        description:
          "Attacker moving between internal systems using legitimate credentials or remote services. Commonly follows initial compromise.",
      },
    ],
  },
  {
    id: 3,
    name: "Identity & Access",
    icon: "🔑",
    slug: "identity-access",
    subTypes: [
      {
        id: "3.1",
        name: "Credential Brute Force",
        mitreTags: ["T1110"],
        description:
          "Automated attempts to gain access using password spraying, stuffing, or dictionary attacks against identity systems or exposed services.",
      },
      {
        id: "3.2",
        name: "Privileged Account Abuse",
        mitreTags: ["T1078"],
        description:
          "Misuse of accounts with elevated permissions (admin, service accounts, PAM vaults) either by insider or through compromised credentials.",
      },
      {
        id: "3.3",
        name: "MFA Bypass / Push Fatigue",
        mitreTags: ["T1621"],
        description:
          "Attacker exploiting MFA weaknesses through push notification fatigue, SIM swapping, or OTP interception to bypass second factor.",
      },
      {
        id: "3.4",
        name: "Account Takeover / Impossible Travel",
        mitreTags: ["T1078.003"],
        description:
          "Authenticated session from geographically impossible or anomalous location. Often indicates stolen session token or credential compromise.",
      },
    ],
  },
  {
    id: 4,
    name: "Data",
    icon: "📦",
    slug: "data",
    subTypes: [
      {
        id: "4.1",
        name: "Data Exfiltration",
        mitreTags: ["T1041", "T1048"],
        description:
          "Unauthorised transfer of sensitive data outside the organisation. May use C2 channel, cloud storage, email, or DNS tunnelling.",
      },
      {
        id: "4.2",
        name: "Insider Threat / Data Misuse",
        mitreTags: ["T1052", "T1078"],
        description:
          "Malicious or negligent internal actor accessing, copying, or removing data beyond their authorised scope.",
      },
      {
        id: "4.3",
        name: "Unauthorized Data Access",
        mitreTags: ["T1530"],
        description:
          "Access to data stores, cloud buckets, or file shares without authorisation. May be misconfiguration-driven or credential-based.",
      },
    ],
  },
  {
    id: 5,
    name: "Application / Web",
    icon: "🌍",
    slug: "application-web",
    subTypes: [
      {
        id: "5.1",
        name: "Phishing / Spear Phishing",
        mitreTags: ["T1566"],
        description:
          "Deceptive email or message crafted to harvest credentials, deliver malware, or redirect to attacker-controlled infrastructure.",
      },
      {
        id: "5.2",
        name: "Web Application Attack (SQLi, XSS, RCE)",
        mitreTags: ["T1190"],
        description:
          "Exploitation of public-facing web application vulnerabilities. Covers injection attacks, cross-site scripting, and remote code execution.",
      },
      {
        id: "5.3",
        name: "Supply Chain Compromise",
        mitreTags: ["T1195"],
        description:
          "Attack via trusted third-party software, dependency, or managed service provider. High blast radius — may affect multiple organisations.",
      },
    ],
  },
  {
    id: 6,
    name: "Cloud & Infrastructure",
    icon: "☁️",
    slug: "cloud-infrastructure",
    subTypes: [
      {
        id: "6.1",
        name: "Cloud Account Compromise",
        mitreTags: ["T1078.004"],
        description:
          "Unauthorised access to cloud management plane (AWS, Azure, GCP) via stolen keys, SSRF, or misconfigured IAM roles.",
      },
      {
        id: "6.2",
        name: "Misconfiguration / Public Exposure",
        mitreTags: ["T1580"],
        description:
          "Sensitive cloud resource (bucket, database, API endpoint) exposed to the internet due to incorrect access controls.",
      },
      {
        id: "6.3",
        name: "Container / Kubernetes Threat",
        mitreTags: ["T1610", "T1609"],
        description:
          "Attack targeting container runtime, Kubernetes API server, or workload pods. May involve escape, privilege escalation, or cryptomining.",
      },
    ],
  },
  {
    id: 7,
    name: "Social Engineering",
    icon: "🎭",
    slug: "social-engineering",
    subTypes: [
      {
        id: "7.1",
        name: "Business Email Compromise (BEC)",
        mitreTags: ["T1534", "T1566"],
        description:
          "Impersonation of executive or supplier via email to redirect payments, harvest credentials, or execute fraud. High financial impact.",
      },
      {
        id: "7.2",
        name: "Vishing / Smishing",
        mitreTags: ["T1598"],
        description:
          "Voice or SMS-based social engineering to extract credentials, authorise fraudulent actions, or install malware.",
      },
    ],
  },
];

// Flat list for lookup by sub-type id
export const ALL_INCIDENT_SUBTYPES: IncidentSubType[] = INCIDENT_CATEGORIES.flatMap(
  (c) => c.subTypes
);

export function getIncidentSubType(id: string): IncidentSubType | undefined {
  return ALL_INCIDENT_SUBTYPES.find((s) => s.id === id);
}

export function getIncidentCategory(id: number): IncidentCategory | undefined {
  return INCIDENT_CATEGORIES.find((c) => c.id === id);
}
