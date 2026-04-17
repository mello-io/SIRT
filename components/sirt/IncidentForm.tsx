"use client";

import { useState } from "react";
import { Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentTypeCard } from "@/components/sirt/IncidentTypeCard";
import { SubTypeSelector } from "@/components/sirt/SubTypeSelector";
import { AssetTypeDropdown } from "@/components/sirt/AssetTypeDropdown";
import {
  INCIDENT_CATEGORIES,
  getIncidentSubType,
  getIncidentCategory,
} from "@/lib/constants/incident-types";
import { ASSET_TYPES } from "@/lib/constants/asset-types";
import { downloadMarkdown } from "@/lib/utils/file-download";
import { track } from "@/lib/analytics/vercel";

const SEVERITIES = ["P1", "P2", "P3", "P4"] as const;
type Severity = (typeof SEVERITIES)[number];

export interface IncidentFormState {
  categoryId: number | null;
  subTypeId: string | null;
  assetTypeId: string;
  severity: Severity | null;
  detectionTime: string;
  mitreTags: string[];
  analystNotes: string;
}

interface IncidentFormProps {
  onFormChange: (state: IncidentFormState) => void;
}

const INITIAL_STATE: IncidentFormState = {
  categoryId: null,
  subTypeId: null,
  assetTypeId: "",
  severity: null,
  detectionTime: "",
  mitreTags: [],
  analystNotes: "",
};

export function IncidentForm({ onFormChange }: IncidentFormProps) {
  const [state, setState] = useState<IncidentFormState>(INITIAL_STATE);
  const [tagInput, setTagInput] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  function update(patch: Partial<IncidentFormState>) {
    const next = { ...state, ...patch };
    setState(next);
    onFormChange(next);
  }

  function selectCategory(id: number) {
    update({ categoryId: id, subTypeId: null, mitreTags: [] });
  }

  function selectSubType(subTypeId: string) {
    const subType = getIncidentSubType(subTypeId);
    update({ subTypeId, mitreTags: subType?.mitreTags ?? [] });
  }

  function removeTag(tag: string) {
    update({ mitreTags: state.mitreTags.filter((t) => t !== tag) });
  }

  function addTag() {
    const tag = tagInput.trim().toUpperCase();
    if (tag && !state.mitreTags.includes(tag)) {
      update({ mitreTags: [...state.mitreTags, tag] });
    }
    setTagInput("");
  }

  function handleDownload() {
    const subType = state.subTypeId ? getIncidentSubType(state.subTypeId) : null;
    const category = state.categoryId ? getIncidentCategory(state.categoryId) : null;
    const assetType = ASSET_TYPES.find((a) => a.id === state.assetTypeId);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    const mitreList = state.mitreTags.map((t) => `  - ${t}`).join("\n");
    const lines: string[] = [
      `# incident-type.md`,
      `# Generated: ${now.toISOString().slice(0, 16).replace("T", " ")} | S.I.R.T. v1.1`,
      ``,
      `incident_type: "${category?.name}"`,
      `sub_type: "${subType?.name}"`,
      `sub_type_id: "${subType?.id}"`,
      `asset_type: "${assetType?.name}${assetType?.description ? ` — ${assetType.description}` : ""}"`,
      `severity_tag: "${state.severity ?? ""}"`,
      `detection_time: "${state.detectionTime ? state.detectionTime.replace("T", " ") : ""}"`,
      `mitre_primary:`,
      mitreList,
    ];

    if (state.analystNotes.trim()) {
      lines.push(`analyst_notes: >`, `  ${state.analystNotes.trim().replace(/\n/g, "\n  ")}`);
    }

    const slug =
      subType?.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") ?? "incident";
    downloadMarkdown(lines.join("\n"), `incident-type-${slug}-${dateStr}.md`);
    track("incident_file_generated", {
      incident_subtype_id: subType?.id ?? "",
      asset_type: state.assetTypeId,
    });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  const isValid = !!state.categoryId && !!state.subTypeId && !!state.assetTypeId;
  const selectedCategory = state.categoryId
    ? getIncidentCategory(state.categoryId)
    : null;

  return (
    <div className="space-y-8">
      {/* Field 1 — Category */}
      <section>
        <p className="text-xs font-mono text-muted-ash uppercase tracking-widest mb-3">
          01 — Incident Category <span className="text-threat-amber">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {INCIDENT_CATEGORIES.map((cat) => (
            <IncidentTypeCard
              key={cat.id}
              category={cat}
              isSelected={state.categoryId === cat.id}
              onSelect={() => selectCategory(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* Field 2 — Sub-type (revealed on category select) */}
      {selectedCategory && (
        <section>
          <p className="text-xs font-mono text-muted-ash uppercase tracking-widest mb-3">
            02 — Incident Sub-type <span className="text-threat-amber">*</span>
          </p>
          <SubTypeSelector
            category={selectedCategory}
            selectedSubTypeId={state.subTypeId}
            onSelect={selectSubType}
          />
        </section>
      )}

      {/* Field 3 — Asset Type */}
      <section>
        <label
          htmlFor="asset-type-incident"
          className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-3"
        >
          03 — Asset Type <span className="text-threat-amber">*</span>
        </label>
        <AssetTypeDropdown
          id="asset-type-incident"
          value={state.assetTypeId}
          onChange={(id) => update({ assetTypeId: id })}
        />
      </section>

      {/* Field 4 — Severity */}
      <section>
        <p className="text-xs font-mono text-muted-ash uppercase tracking-widest mb-3">
          04 — Severity Tag{" "}
          <span className="text-muted-ash/60 normal-case tracking-normal">
            (optional)
          </span>
        </p>
        <div className="flex gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ severity: state.severity === s ? null : s })}
              className={`h-9 px-4 rounded border font-mono text-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green ${
                state.severity === s
                  ? "border-threat-amber bg-threat-amber text-void font-semibold"
                  : "border-grid-line bg-deep-slate text-off-white hover:border-muted-ash/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-ash font-mono mt-2">
          For output tagging only — all incidents are treated as active priority.
        </p>
      </section>

      {/* Field 5 — Detection Time */}
      <section>
        <label
          htmlFor="detection-time-incident"
          className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-3"
        >
          05 — Detection Time{" "}
          <span className="text-muted-ash/60 normal-case tracking-normal">
            (optional)
          </span>
        </label>
        <input
          id="detection-time-incident"
          type="datetime-local"
          value={state.detectionTime}
          onChange={(e) => update({ detectionTime: e.target.value })}
          className="bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green w-full sm:w-auto [color-scheme:dark]"
        />
        <p className="text-[11px] text-muted-ash font-mono mt-2">
          Used as time-filter anchor in tool query steps.
        </p>
      </section>

      {/* Field 6 — MITRE Tags */}
      <section>
        <p className="text-xs font-mono text-muted-ash uppercase tracking-widest mb-3">
          06 — MITRE ATT&amp;CK Tags{" "}
          <span className="text-muted-ash/60 normal-case tracking-normal">
            (auto-populated — edit if needed)
          </span>
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
          {state.mitreTags.length > 0 ? (
            state.mitreTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs font-mono text-mitre-purple border border-mitre-purple/30 bg-mitre-purple/10 rounded px-2 py-1 leading-none"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 hover:text-off-white transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs font-mono text-muted-ash/50">
              Select a sub-type to auto-populate tags
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="e.g. T1078"
            className="bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green w-36 placeholder:text-muted-ash/40"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="h-9 px-3 rounded border border-grid-line bg-deep-slate text-off-white font-mono text-sm hover:border-muted-ash/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green"
          >
            <Plus size={13} />
            Add
          </button>
        </div>
      </section>

      {/* Field 7 — Analyst Notes */}
      <section>
        <label
          htmlFor="analyst-notes-incident"
          className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-3"
        >
          07 — Analyst Notes{" "}
          <span className="text-muted-ash/60 normal-case tracking-normal">
            (optional)
          </span>
        </label>
        <textarea
          id="analyst-notes-incident"
          value={state.analystNotes}
          onChange={(e) =>
            update({ analystNotes: e.target.value.slice(0, 500) })
          }
          placeholder="e.g. CrowdStrike alert on outbound beacon from WKSTN-042. User not active at time of detection."
          rows={4}
          className="w-full bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-signal-green resize-none placeholder:text-muted-ash/40"
        />
        <p className="text-[11px] text-muted-ash font-mono mt-1 text-right">
          {state.analystNotes.length}/500
        </p>
      </section>

      {/* Generate */}
      <div className="pt-2 border-t border-grid-line">
        <Button
          onClick={handleDownload}
          disabled={!isValid}
          className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-6 h-11 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <Download size={15} className="mr-2" />
          {downloaded ? "Downloaded!" : "Generate incident-type.md"}
        </Button>
        {!isValid && (
          <p className="text-[11px] font-mono text-muted-ash mt-2">
            Category, sub-type, and asset type are required.
          </p>
        )}
        {downloaded && (
          <p className="text-[11px] font-mono text-signal-green mt-2">
            Your incident-type.md is ready. Upload it to your S.I.R.T. Claude
            Project alongside your org-sec-stack.md.
          </p>
        )}
      </div>
    </div>
  );
}
