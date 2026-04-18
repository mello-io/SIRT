"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_RELEASE_URL = "https://github.com/mello-io/SIRT/releases/tag/skill-v1.0";

const STEPS = [
  {
    n: "01",
    title: "Download the skill bundle",
    body: "Download SIRT-skill-bundle-v1.0.zip from GitHub Releases and unzip it. You will find 4 skill files and a README.",
  },
  {
    n: "02",
    title: "Create a Claude Project",
    body: 'In Claude.ai, create a new Project. Under "Project knowledge", upload all 4 skill files: SKILL.md, incident-library.md, tool-library.md, and output-format.md.',
  },
  {
    n: "03",
    title: "Generate your config files",
    body: null,
  },
  {
    n: "04",
    title: "Run it in Claude",
    body: 'Upload your org-sec-stack.md and incident-type.md to the Project conversation, then type one of the trigger phrases below.',
  },
];

const TRIGGER_PHRASES = [
  { phrase: "Generate my IR checklist.", description: "Full checklist from your uploaded org-sec-stack.md + incident-type.md" },
  { phrase: "Summarise my stack.", description: "Confirms your org stack was parsed correctly before generating" },
  { phrase: "What decision points matter?", description: "Returns only the decision point blocks — useful for a quick brief or L2 handoff" },
  { phrase: "Give me the IOC summary.", description: "Extracts and lists all IOCs referenced in the checklist" },
  { phrase: "Escalation brief.", description: "5–10 line escalation summary suitable for a ticket or L2/L3 message" },
  { phrase: "What tools apply to this incident?", description: "Lists which org stack tools are relevant and explains why" },
  { phrase: "Show me the MITRE mapping.", description: "Returns only the MITRE ATT&CK reference table for the loaded incident" },
  { phrase: "Phase [N] only.", description: "Returns a single IR phase — e.g. Phase 3 only. returns containment steps" },
  { phrase: "Regenerate checklist.", description: "Re-runs generation on the same files — useful if the first output was incomplete" },
  { phrase: "What's missing from my stack?", description: "Flags tool category gaps relevant to the loaded incident type" },
];

interface SkillInstallModalProps {
  open: boolean;
  onClose: () => void;
}

export function SkillInstallModal({ open, onClose }: SkillInstallModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="S.I.R.T. Skill Bundle — Setup Guide"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-deep-slate border border-grid-line rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-deep-slate border-b border-grid-line px-5 py-4 flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-[10px] font-mono text-muted-ash uppercase tracking-widest">
              S.I.R.T. Claude Skill
            </p>
            <h2 className="font-mono font-bold text-sm text-off-white text-left mt-2">
              Setup Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-ash hover:text-off-white transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green ml-4 shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-4">
                <span className="font-mono text-[11px] text-signal-green w-6 shrink-0 pt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="font-mono text-sm text-off-white font-semibold mb-1">
                    {step.title}
                  </p>
                  {step.n === "03" ? (
                    <p className="text-xs text-muted-ash leading-relaxed">
                      Come back here to generate your{" "}
                      <code className="text-[#6B7A8D]">org-sec-stack.md</code> at{" "}
                      <Link href="/setup" className="text-[#00FF88] hover:underline">
                        /setup
                      </Link>{" "}
                      and your{" "}
                      <code className="text-[#6B7A8D]">incident-type.md</code> at{" "}
                      <Link href="/incident" className="text-[#00FF88] hover:underline">
                        /incident
                      </Link>
                      . These are your session inputs.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-ash leading-relaxed">
                      {step.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trigger phrases */}
          <div className="bg-iron border border-grid-line rounded p-4">
            <p className="text-[10px] font-mono text-muted-ash uppercase tracking-widest mb-3">
              Trigger Phrases
            </p>
            <div className="space-y-2">
              {TRIGGER_PHRASES.map(({ phrase, description }) => (
                <div key={phrase} className="flex gap-3 items-start">
                  <code className="text-[11px] font-mono text-signal-green bg-void/60 border border-grid-line rounded px-1.5 py-0.5 shrink-0 whitespace-nowrap">
                    {phrase}
                  </code>
                  <span className="text-[11px] text-muted-ash leading-relaxed pt-0.5">
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill files list */}
          <div>
            <p className="text-[10px] font-mono text-muted-ash uppercase tracking-widest mb-2">
              Files in the Bundle
            </p>
            <ul className="space-y-1">
              {[
                { file: "SKILL.md", desc: "Core skill instructions and trigger phrases" },
                { file: "incident-library.md", desc: "22 incident types with MITRE tags" },
                { file: "tool-library.md", desc: "60+ tools across 9 categories" },
                { file: "output-format.md", desc: "Checklist structure and formatting rules" },
              ].map(({ file, desc }) => (
                <li key={file} className="flex gap-3 text-xs font-mono">
                  <span className="text-off-white w-40 shrink-0">{file}</span>
                  <span className="text-muted-ash">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download CTA */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-grid-line">
            <a
              href={GITHUB_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-signal-green text-void hover:bg-signal-green/90 font-mono text-xs h-8 gap-1.5"
              >
                <Download size={12} />
                Download Skill Bundle
              </Button>
            </a>
            <a
              href="https://github.com/mello-io/SIRT"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-grid-line text-muted-ash hover:text-off-white font-mono text-xs h-8 gap-1.5"
              >
                <ExternalLink size={12} />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
