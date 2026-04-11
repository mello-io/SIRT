// S.I.R.T. Asset Type Options — 11 types
// Source of truth: PRD.md Section 6

export interface AssetType {
  id: string;
  name: string;
  description: string;
}

export const ASSET_TYPES: AssetType[] = [
  {
    id: "endpoint-workstation",
    name: "Endpoint / Workstation",
    description: "User laptop, desktop, on-prem workstation",
  },
  {
    id: "server-on-prem",
    name: "Server (On-Prem)",
    description: "Physical or virtual internal server",
  },
  {
    id: "server-cloud",
    name: "Server (Cloud)",
    description: "EC2, Azure VM, GCP Compute",
  },
  {
    id: "domain-controller",
    name: "Domain Controller / AD",
    description: "Identity infrastructure",
  },
  {
    id: "network-device",
    name: "Network Device",
    description: "Firewall, switch, router, AP",
  },
  {
    id: "cloud-saas",
    name: "Cloud Service / SaaS App",
    description: "AWS, Azure, GCP service or third-party SaaS",
  },
  {
    id: "email-mailbox",
    name: "Email / Mailbox",
    description: "User or shared mailbox",
  },
  {
    id: "container-kubernetes",
    name: "Container / Kubernetes",
    description: "Pod, node, cluster",
  },
  {
    id: "ot-ics",
    name: "OT / ICS Device",
    description: "Industrial control system",
  },
  {
    id: "mobile-device",
    name: "Mobile Device",
    description: "iOS, Android",
  },
  {
    id: "unknown-multiple",
    name: "Unknown / Multiple",
    description: "Analyst is unsure or incident spans multiple assets",
  },
];
