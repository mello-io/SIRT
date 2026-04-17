"use client";

import type { IncidentFormState } from "@/components/sirt/IncidentForm";
import { getIncidentSubType, getIncidentCategory } from "@/lib/constants/incident-types";
import { ASSET_TYPES } from "@/lib/constants/asset-types";

interface IncidentFormPreviewProps {
  state: IncidentFormState;
}

export function IncidentFormPreview({ state }: IncidentFormPreviewProps) {
  const subType = state.subTypeId ? getIncidentSubType(state.subTypeId) : null;
  const category = state.categoryId ? getIncidentCategory(state.categoryId) : null;
  const assetType = ASSET_TYPES.find((a) => a.id === state.assetTypeId);

  const mitreList = state.mitreTags.length
    ? state.mitreTags.map((t) => `  - ${t}`).join("\n")
    : `  - (auto-populated on sub-type select)`;

  const lines: string[] = [
    `# incident-type.md`,
    `# Generated: [on download] | S.I.R.T. v1.1`,
    ``,
    `incident_type: "${category?.name ?? "—"}"`,
    `sub_type: "${subType?.name ?? "—"}"`,
    `sub_type_id: "${subType?.id ?? "—"}"`,
    `asset_type: "${assetType ? `${assetType.name} — ${assetType.description}` : "—"}"`,
    `severity_tag: "${state.severity ?? ""}"`,
    `detection_time: "${state.detectionTime ? state.detectionTime.replace("T", " ") : ""}"`,
    `mitre_primary:`,
    mitreList,
  ];

  if (state.analystNotes.trim()) {
    lines.push(`analyst_notes: >`, `  ${state.analystNotes.trim()}`);
  }

  return (
    <div className="bg-deep-slate border border-grid-line rounded overflow-hidden">
      <div className="px-4 py-2.5 border-b border-grid-line flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-ash uppercase tracking-widest">
          Live Preview
        </span>
        <span className="text-[10px] font-mono text-muted-ash/50">
          incident-type.md
        </span>
      </div>
      <pre className="px-4 py-4 text-[11px] font-mono text-off-white/80 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
