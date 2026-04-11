// S.I.R.T. Security Tool Library — 60+ tools across 9 categories
// Source of truth: PRD.md Section 5

export type ToolCategory =
  | "SIEM"
  | "NGFW"
  | "EDR/MDR"
  | "IAM/PAM"
  | "Vulnerability Management"
  | "NDR"
  | "Threat Intelligence"
  | "Email Security"
  | "Cloud Security";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "SIEM",
  "NGFW",
  "EDR/MDR",
  "IAM/PAM",
  "Vulnerability Management",
  "NDR",
  "Threat Intelligence",
  "Email Security",
  "Cloud Security",
];

export interface Tool {
  id: string;
  name: string;
  publisher: string;
  category: ToolCategory;
  publicDocsUrl: string;
}

export const TOOL_LIBRARY: Tool[] = [
  // ── SIEM ────────────────────────────────────────────────────────────────────
  {
    id: "splunk-es",
    name: "Splunk Enterprise Security",
    publisher: "Splunk",
    category: "SIEM",
    publicDocsUrl: "https://docs.splunk.com/Documentation/ES",
  },
  {
    id: "microsoft-sentinel",
    name: "Microsoft Sentinel",
    publisher: "Microsoft",
    category: "SIEM",
    publicDocsUrl: "https://learn.microsoft.com/en-us/azure/sentinel/",
  },
  {
    id: "ibm-qradar",
    name: "IBM QRadar",
    publisher: "IBM",
    category: "SIEM",
    publicDocsUrl: "https://www.ibm.com/docs/en/qsip/7.5",
  },
  {
    id: "elastic-siem",
    name: "Elastic Security (SIEM)",
    publisher: "Elastic",
    category: "SIEM",
    publicDocsUrl: "https://www.elastic.co/guide/en/security/current/",
  },
  {
    id: "logrhythm-siem",
    name: "LogRhythm SIEM",
    publisher: "LogRhythm",
    category: "SIEM",
    publicDocsUrl: "https://docs.logrhythm.com/",
  },
  {
    id: "exabeam-fusion",
    name: "Exabeam Fusion SIEM",
    publisher: "Exabeam",
    category: "SIEM",
    publicDocsUrl: "https://docs.exabeam.com/",
  },
  {
    id: "arcsight-esm",
    name: "ArcSight ESM",
    publisher: "OpenText",
    category: "SIEM",
    publicDocsUrl:
      "https://www.microfocus.com/documentation/arcsight/arcsight-esm/",
  },
  {
    id: "securonix-snypr",
    name: "Securonix SNYPR",
    publisher: "Securonix",
    category: "SIEM",
    publicDocsUrl: "https://documentation.securonix.com/",
  },
  {
    id: "devo-platform",
    name: "Devo Platform",
    publisher: "Devo",
    category: "SIEM",
    publicDocsUrl: "https://docs.devo.com/",
  },
  {
    id: "rapid7-insightidr",
    name: "Rapid7 InsightIDR",
    publisher: "Rapid7",
    category: "SIEM",
    publicDocsUrl: "https://docs.rapid7.com/insightidr/",
  },
  {
    id: "google-chronicle",
    name: "Google Chronicle",
    publisher: "Google",
    category: "SIEM",
    publicDocsUrl: "https://cloud.google.com/chronicle/docs",
  },
  {
    id: "fortisiem",
    name: "FortiSIEM",
    publisher: "Fortinet",
    category: "SIEM",
    publicDocsUrl: "https://docs.fortinet.com/product/fortisiem/",
  },
  {
    id: "alienvault-usm",
    name: "AlienVault USM Anywhere",
    publisher: "AT&T Cybersecurity",
    category: "SIEM",
    publicDocsUrl: "https://cybersecurity.att.com/documentation/usm-anywhere/",
  },
  {
    id: "manageengine-log360",
    name: "ManageEngine Log360",
    publisher: "ManageEngine",
    category: "SIEM",
    publicDocsUrl:
      "https://www.manageengine.com/log-management/help/log360-user-guide.html",
  },

  // ── NGFW ────────────────────────────────────────────────────────────────────
  {
    id: "paloalto-panos",
    name: "Palo Alto Networks PAN-OS",
    publisher: "Palo Alto Networks",
    category: "NGFW",
    publicDocsUrl: "https://docs.paloaltonetworks.com/pan-os",
  },
  {
    id: "fortinet-fortigate",
    name: "Fortinet FortiGate",
    publisher: "Fortinet",
    category: "NGFW",
    publicDocsUrl: "https://docs.fortinet.com/product/fortigate/",
  },
  {
    id: "checkpoint-quantum",
    name: "Check Point Quantum",
    publisher: "Check Point",
    category: "NGFW",
    publicDocsUrl: "https://sc1.checkpoint.com/documents/latest/",
  },
  {
    id: "cisco-firepower",
    name: "Cisco Firepower / FTD",
    publisher: "Cisco",
    category: "NGFW",
    publicDocsUrl:
      "https://www.cisco.com/c/en/us/support/security/firepower-ngfw/",
  },
  {
    id: "juniper-srx",
    name: "Juniper SRX Series",
    publisher: "Juniper Networks",
    category: "NGFW",
    publicDocsUrl:
      "https://www.juniper.net/documentation/us/en/software/junos/",
  },
  {
    id: "sophos-xgs",
    name: "Sophos XGS Firewall",
    publisher: "Sophos",
    category: "NGFW",
    publicDocsUrl: "https://docs.sophos.com/nsg/sophos-firewall/",
  },
  {
    id: "watchguard-firebox",
    name: "WatchGuard Firebox",
    publisher: "WatchGuard",
    category: "NGFW",
    publicDocsUrl: "https://www.watchguard.com/help/docs/help-center/",
  },
  {
    id: "sonicwall-nssp",
    name: "SonicWall NSsp",
    publisher: "SonicWall",
    category: "NGFW",
    publicDocsUrl:
      "https://www.sonicwall.com/support/technical-documentation/",
  },
  {
    id: "barracuda-cloudgen",
    name: "Barracuda CloudGen Firewall",
    publisher: "Barracuda Networks",
    category: "NGFW",
    publicDocsUrl:
      "https://campus.barracuda.com/product/cloudgenfirewall/",
  },
  {
    id: "pfsense-opnsense",
    name: "pfSense / OPNsense",
    publisher: "Netgate / Deciso",
    category: "NGFW",
    publicDocsUrl: "https://docs.netgate.com/pfsense/en/latest/",
  },

  // ── EDR/MDR ──────────────────────────────────────────────────────────────────
  {
    id: "crowdstrike-falcon",
    name: "CrowdStrike Falcon",
    publisher: "CrowdStrike",
    category: "EDR/MDR",
    publicDocsUrl: "https://falcon.crowdstrike.com/documentation/",
  },
  {
    id: "ms-defender-endpoint",
    name: "Microsoft Defender for Endpoint",
    publisher: "Microsoft",
    category: "EDR/MDR",
    publicDocsUrl:
      "https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/",
  },
  {
    id: "sentinelone-singularity",
    name: "SentinelOne Singularity",
    publisher: "SentinelOne",
    category: "EDR/MDR",
    publicDocsUrl: "https://docs.sentinelone.com/",
  },
  {
    id: "vmware-carbon-black",
    name: "VMware Carbon Black EDR",
    publisher: "VMware / Broadcom",
    category: "EDR/MDR",
    publicDocsUrl: "https://techdocs.broadcom.com/us/en/carbon-black/",
  },
  {
    id: "cybereason",
    name: "Cybereason Defense Platform",
    publisher: "Cybereason",
    category: "EDR/MDR",
    publicDocsUrl: "https://nest.cybereason.com/documentation/",
  },
  {
    id: "trendmicro-vision-one",
    name: "Trend Micro Vision One",
    publisher: "Trend Micro",
    category: "EDR/MDR",
    publicDocsUrl:
      "https://docs.trendmicro.com/en-us/enterprise/trend-vision-one/",
  },
  {
    id: "eset-inspect",
    name: "ESET Inspect",
    publisher: "ESET",
    category: "EDR/MDR",
    publicDocsUrl: "https://help.eset.com/inspect/",
  },
  {
    id: "malwarebytes-edr",
    name: "Malwarebytes EDR",
    publisher: "Malwarebytes",
    category: "EDR/MDR",
    publicDocsUrl: "https://support.malwarebytes.com/hc/en-us",
  },
  {
    id: "sophos-intercept-x",
    name: "Sophos Intercept X",
    publisher: "Sophos",
    category: "EDR/MDR",
    publicDocsUrl: "https://docs.sophos.com/nsg/sophos-central/",
  },
  {
    id: "elastic-endpoint",
    name: "Elastic Endpoint Security",
    publisher: "Elastic",
    category: "EDR/MDR",
    publicDocsUrl: "https://www.elastic.co/guide/en/security/current/",
  },
  {
    id: "harfanglab-edr",
    name: "HarfangLab EDR",
    publisher: "HarfangLab",
    category: "EDR/MDR",
    publicDocsUrl: "https://docs.harfanglab.io/",
  },
  {
    id: "blackberry-cylance",
    name: "BlackBerry Cylance",
    publisher: "BlackBerry",
    category: "EDR/MDR",
    publicDocsUrl:
      "https://docs.blackberry.com/en/unified-endpoint-security/",
  },
  {
    id: "cortex-xdr",
    name: "Cortex XDR",
    publisher: "Palo Alto Networks",
    category: "EDR/MDR",
    publicDocsUrl:
      "https://docs.paloaltonetworks.com/cortex/cortex-xdr",
  },
  {
    id: "bitdefender-gravityzone",
    name: "Bitdefender GravityZone",
    publisher: "Bitdefender",
    category: "EDR/MDR",
    publicDocsUrl: "https://www.bitdefender.com/business/support/en/",
  },

  // ── IAM/PAM ──────────────────────────────────────────────────────────────────
  {
    id: "ms-ad-entra",
    name: "Microsoft Active Directory / Entra ID",
    publisher: "Microsoft",
    category: "IAM/PAM",
    publicDocsUrl: "https://learn.microsoft.com/en-us/entra/identity/",
  },
  {
    id: "okta",
    name: "Okta Workforce Identity",
    publisher: "Okta",
    category: "IAM/PAM",
    publicDocsUrl: "https://help.okta.com/en-us/content/index.htm",
  },
  {
    id: "cyberark-pam",
    name: "CyberArk Privileged Access Manager",
    publisher: "CyberArk",
    category: "IAM/PAM",
    publicDocsUrl: "https://docs.cyberark.com/pam-self-hosted/",
  },
  {
    id: "beyondtrust-pra",
    name: "BeyondTrust Privileged Remote Access",
    publisher: "BeyondTrust",
    category: "IAM/PAM",
    publicDocsUrl:
      "https://www.beyondtrust.com/docs/privileged-remote-access/",
  },
  {
    id: "sailpoint-identitynow",
    name: "SailPoint IdentityNow",
    publisher: "SailPoint",
    category: "IAM/PAM",
    publicDocsUrl: "https://documentation.sailpoint.com/saas/",
  },
  {
    id: "ping-identity",
    name: "Ping Identity PingOne",
    publisher: "Ping Identity",
    category: "IAM/PAM",
    publicDocsUrl: "https://docs.pingidentity.com/",
  },
  {
    id: "onelogin",
    name: "OneLogin (Unified Access Management)",
    publisher: "OneLogin",
    category: "IAM/PAM",
    publicDocsUrl: "https://developers.onelogin.com/",
  },
  {
    id: "jumpcloud",
    name: "JumpCloud Directory Platform",
    publisher: "JumpCloud",
    category: "IAM/PAM",
    publicDocsUrl: "https://jumpcloud.com/support",
  },
  {
    id: "forgerock",
    name: "ForgeRock Identity Platform",
    publisher: "ForgeRock",
    category: "IAM/PAM",
    publicDocsUrl: "https://backstage.forgerock.com/docs/",
  },
  {
    id: "hashicorp-vault",
    name: "HashiCorp Vault",
    publisher: "HashiCorp",
    category: "IAM/PAM",
    publicDocsUrl: "https://developer.hashicorp.com/vault/docs",
  },
  {
    id: "saviynt",
    name: "Saviynt Security Manager",
    publisher: "Saviynt",
    category: "IAM/PAM",
    publicDocsUrl: "https://docs.saviyntcloud.com/",
  },

  // ── Vulnerability Management ─────────────────────────────────────────────────
  {
    id: "tenable",
    name: "Tenable Nessus / Tenable.io",
    publisher: "Tenable",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.tenable.com/",
  },
  {
    id: "qualys-vmdr",
    name: "Qualys VMDR",
    publisher: "Qualys",
    category: "Vulnerability Management",
    publicDocsUrl: "https://qualysguard.qualys.com/qwebhelp/fo_portal/",
  },
  {
    id: "rapid7-insightvm",
    name: "Rapid7 InsightVM",
    publisher: "Rapid7",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.rapid7.com/insightvm/",
  },
  {
    id: "openvas-greenbone",
    name: "OpenVAS / Greenbone",
    publisher: "Greenbone Networks",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.greenbone.net/",
  },
  {
    id: "wiz",
    name: "Wiz Cloud Security",
    publisher: "Wiz",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.wiz.io/",
  },
  {
    id: "orca-security",
    name: "Orca Security",
    publisher: "Orca Security",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.orcasecurity.io/",
  },
  {
    id: "lacework-vuln",
    name: "Lacework",
    publisher: "Lacework",
    category: "Vulnerability Management",
    publicDocsUrl: "https://docs.lacework.net/",
  },

  // ── NDR ──────────────────────────────────────────────────────────────────────
  {
    id: "darktrace",
    name: "Darktrace Enterprise",
    publisher: "Darktrace",
    category: "NDR",
    publicDocsUrl: "https://customerportal.darktrace.com/",
  },
  {
    id: "vectra-ai",
    name: "Vectra AI",
    publisher: "Vectra",
    category: "NDR",
    publicDocsUrl: "https://support.vectra.ai/",
  },
  {
    id: "corelight",
    name: "Corelight Network Sensor",
    publisher: "Corelight",
    category: "NDR",
    publicDocsUrl: "https://docs.corelight.com/",
  },
  {
    id: "zeek",
    name: "Zeek (Bro)",
    publisher: "Zeek Project (OSS)",
    category: "NDR",
    publicDocsUrl: "https://docs.zeek.org/",
  },
  {
    id: "suricata",
    name: "Suricata IDS/IPS",
    publisher: "OISF (OSS)",
    category: "NDR",
    publicDocsUrl: "https://suricata.readthedocs.io/",
  },
  {
    id: "snort",
    name: "Snort",
    publisher: "Cisco / OSS",
    category: "NDR",
    publicDocsUrl: "https://www.snort.org/documents",
  },
  {
    id: "arkime",
    name: "Arkime (Moloch)",
    publisher: "OSS",
    category: "NDR",
    publicDocsUrl: "https://arkime.com/learn",
  },
  {
    id: "netwitness",
    name: "NetWitness Platform",
    publisher: "RSA / NetWitness",
    category: "NDR",
    publicDocsUrl: "https://community.netwitness.com/",
  },
  {
    id: "extrahop-revealx",
    name: "ExtraHop Reveal(x)",
    publisher: "ExtraHop",
    category: "NDR",
    publicDocsUrl: "https://docs.extrahop.com/",
  },
  {
    id: "gigamon-threatinsight",
    name: "Gigamon ThreatINSIGHT",
    publisher: "Gigamon",
    category: "NDR",
    publicDocsUrl: "https://docs.gigamon.com/",
  },

  // ── Threat Intelligence ───────────────────────────────────────────────────────
  {
    id: "misp",
    name: "MISP",
    publisher: "CIRCL / OSS",
    category: "Threat Intelligence",
    publicDocsUrl: "https://www.misp-project.org/documentation/",
  },
  {
    id: "anomali-threatstream",
    name: "Anomali ThreatStream",
    publisher: "Anomali",
    category: "Threat Intelligence",
    publicDocsUrl: "https://www.anomali.com/resources/datasheets",
  },
  {
    id: "recorded-future",
    name: "Recorded Future",
    publisher: "Recorded Future",
    category: "Threat Intelligence",
    publicDocsUrl: "https://support.recordedfuture.com/",
  },
  {
    id: "threatconnect",
    name: "ThreatConnect Platform",
    publisher: "ThreatConnect",
    category: "Threat Intelligence",
    publicDocsUrl: "https://docs.threatconnect.com/",
  },
  {
    id: "opencti",
    name: "OpenCTI",
    publisher: "Filigran (OSS)",
    category: "Threat Intelligence",
    publicDocsUrl: "https://docs.opencti.io/",
  },
  {
    id: "virustotal",
    name: "VirusTotal Enterprise",
    publisher: "Google",
    category: "Threat Intelligence",
    publicDocsUrl: "https://docs.virustotal.com/",
  },
  {
    id: "alienvault-otx",
    name: "AlienVault OTX",
    publisher: "AT&T Cybersecurity",
    category: "Threat Intelligence",
    publicDocsUrl: "https://otx.alienvault.com/",
  },
  {
    id: "mandiant-advantage",
    name: "Mandiant Advantage",
    publisher: "Google / Mandiant",
    category: "Threat Intelligence",
    publicDocsUrl: "https://www.mandiant.com/advantage",
  },

  // ── Email Security ────────────────────────────────────────────────────────────
  {
    id: "proofpoint-email",
    name: "Proofpoint Email Protection",
    publisher: "Proofpoint",
    category: "Email Security",
    publicDocsUrl: "https://help.proofpoint.com/",
  },
  {
    id: "mimecast",
    name: "Mimecast Email Security",
    publisher: "Mimecast",
    category: "Email Security",
    publicDocsUrl: "https://community.mimecast.com/s/article/",
  },
  {
    id: "ms-defender-office365",
    name: "Microsoft Defender for Office 365",
    publisher: "Microsoft",
    category: "Email Security",
    publicDocsUrl:
      "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/",
  },
  {
    id: "abnormal-security",
    name: "Abnormal Security",
    publisher: "Abnormal Security",
    category: "Email Security",
    publicDocsUrl: "https://abnormal.ai/resources/",
  },
  {
    id: "barracuda-email",
    name: "Barracuda Email Security Gateway",
    publisher: "Barracuda Networks",
    category: "Email Security",
    publicDocsUrl:
      "https://campus.barracuda.com/product/emailsecuritygateway/",
  },
  {
    id: "cofense-phishme",
    name: "Cofense PhishMe",
    publisher: "Cofense",
    category: "Email Security",
    publicDocsUrl: "https://cofense.com/resources/",
  },

  // ── Cloud Security ────────────────────────────────────────────────────────────
  {
    id: "aws-securityhub-guardduty",
    name: "AWS Security Hub + GuardDuty",
    publisher: "Amazon",
    category: "Cloud Security",
    publicDocsUrl: "https://docs.aws.amazon.com/guardduty/",
  },
  {
    id: "ms-defender-cloud",
    name: "Microsoft Defender for Cloud",
    publisher: "Microsoft",
    category: "Cloud Security",
    publicDocsUrl:
      "https://learn.microsoft.com/en-us/azure/defender-for-cloud/",
  },
  {
    id: "google-scc",
    name: "Google Security Command Center",
    publisher: "Google",
    category: "Cloud Security",
    publicDocsUrl:
      "https://cloud.google.com/security-command-center/docs",
  },
  {
    id: "prisma-cloud",
    name: "Prisma Cloud",
    publisher: "Palo Alto Networks",
    category: "Cloud Security",
    publicDocsUrl: "https://docs.prismacloud.io/",
  },
  {
    id: "lacework-polygraph",
    name: "Lacework Polygraph",
    publisher: "Lacework",
    category: "Cloud Security",
    publicDocsUrl: "https://docs.lacework.net/",
  },
];

// Lookup helpers
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOL_LIBRARY.filter((t) => t.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return TOOL_LIBRARY.find((t) => t.id === id);
}
