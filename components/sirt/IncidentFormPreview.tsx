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

  const lines: string[] = [
    `# incident-type.md`,
    `> Generated: [on download]`,
    `> S.I.R.T. Version: v1.1`,
    ``,
    `## Incident`,
    ``,
    `- **Category:** ${category ? `${category.icon} ${category.name}` : "—"}`,
    `- **Sub-type:** ${subType ? `${subType.id} — ${subType.name}` : "—"}`,
    `- **Asset Type:** ${assetType ? `${assetType.name} — ${assetType.description}` : "—"}`,
    `- **Severity:** ${state.severity ?? "—"}`,
    `- **Detection Time:** ${state.detectionTime ? state.detectionTime.replace("T", " ") : "—"}`,
    ``,
    `## MITRE ATT&CK`,
    ``,
    ...(state.mitreTags.length
      ? state.mitreTags.map((t) => `- ${t}`)
      : [`— (auto-populated on sub-type select)`]),
    ``,
  ];

  if (state.analystNotes.trim()) {
    lines.push(`## Analyst Notes`, ``, state.analystNotes.trim(), ``);
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
