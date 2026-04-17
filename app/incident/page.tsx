"use client";

// S.I.R.T. — Screen: /incident — Incident Type Generator

import { useState } from "react";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/sirt/AppShell";
import { IncidentForm, type IncidentFormState } from "@/components/sirt/IncidentForm";
import { IncidentFormPreview } from "@/components/sirt/IncidentFormPreview";

const INITIAL_STATE: IncidentFormState = {
  categoryId: null,
  subTypeId: null,
  assetTypeId: "",
  severity: null,
  detectionTime: "",
  mitreTags: [],
  analystNotes: "",
};

export default function IncidentPage() {
  const [formState, setFormState] = useState<IncidentFormState>(INITIAL_STATE);

  return (
    <AppShell>
      <div className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={18} className="text-signal-green" aria-hidden="true" />
            <h1 className="font-mono font-bold text-xl text-off-white">
              Incident Type Generator
            </h1>
          </div>
          <p className="text-sm text-muted-ash leading-relaxed max-w-xl">
            Generate an{" "}
            <code className="text-off-white bg-iron px-1 py-0.5 rounded text-[11px]">
              incident-type.md
            </code>{" "}
            file for your S.I.R.T. Claude Project. Upload it alongside your{" "}
            <code className="text-off-white bg-iron px-1 py-0.5 rounded text-[11px]">
              org-sec-stack.md
            </code>{" "}
            to generate IR checklists without an API key.
          </p>
        </div>

        {/* Two-column layout: form + sticky preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <IncidentForm onFormChange={setFormState} />

          <div className="lg:sticky lg:top-8 space-y-4">
            <IncidentFormPreview state={formState} />

            <div className="bg-deep-slate border border-grid-line rounded p-4">
              <p className="text-[11px] font-mono text-muted-ash uppercase tracking-widest mb-2">
                Using the Skill Bundle?
              </p>
              <p className="text-xs text-muted-ash leading-relaxed">
                Upload your{" "}
                <span className="text-off-white font-mono">org-sec-stack.md</span> and{" "}
                <span className="text-off-white font-mono">incident-type.md</span> to
                your Claude Project, then type{" "}
                <span className="text-signal-green font-mono">
                  Generate my IR checklist.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
