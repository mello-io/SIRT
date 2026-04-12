// S.I.R.T. Session Types
// Shared between the session page (writer) and output page (reader).
// Stored in sessionStorage under the key "sirt_output".

export interface SessionMeta {
  orgName: string;
  incidentCategory: string;
  incidentSubType: string;
  incidentSubTypeId: string;
  assetType: string;
  severity: string;
  detectionTime: string;
  generatedAt: string; // ISO UTC
  provider: string;
}

export interface SirtOutput {
  content: string; // raw markdown checklist
  provider: string;
  tokensUsed: number;
  meta: SessionMeta;
}

export const SIRT_OUTPUT_KEY = "sirt_output";
export const SIRT_API_KEY = "sirt_api_key";
export const SIRT_PROVIDER_KEY = "sirt_provider";
