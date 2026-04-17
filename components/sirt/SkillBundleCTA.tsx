"use client";

import { useState } from "react";
import { Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillInstallModal } from "@/components/sirt/SkillInstallModal";
import { track } from "@/lib/analytics/vercel";

const GITHUB_RELEASE_URL = "https://github.com/mello-io/SIRT/releases/tag/skill-v1.0";

interface SkillBundleCTAProps {
  // "card" — standalone card for Landing page
  // "inline" — compact strip for Session and Settings
  variant?: "card" | "inline";
}

export function SkillBundleCTA({ variant = "inline" }: SkillBundleCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const buttons = (
    <div className="flex flex-wrap gap-2">
      <a
        href={GITHUB_RELEASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("skill_bundle_downloaded")}
      >
        <Button
          size="sm"
          variant="outline"
          className="border-signal-green/40 text-signal-green hover:bg-signal-green/10 font-mono text-xs h-8 gap-1.5"
        >
          <Download size={12} />
          Download Skill Bundle
        </Button>
      </a>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setModalOpen(true)}
        className="text-muted-ash hover:text-off-white font-mono text-xs h-8 gap-1.5"
      >
        <BookOpen size={12} />
        Learn How
      </Button>
    </div>
  );

  return (
    <>
      {variant === "card" ? (
        <div className="border border-grid-line rounded p-5 bg-deep-slate text-left w-full">
          <p className="text-[10px] font-mono text-muted-ash uppercase tracking-widest mb-1">
            No API key?
          </p>
          <p className="font-mono font-semibold text-sm text-off-white mb-1">
            Use the S.I.R.T. Claude Skill
          </p>
          <p className="text-xs text-muted-ash leading-relaxed mb-4">
            Upload S.I.R.T. to your Claude Pro, Team, or Enterprise project. No
            API cost. No setup.
          </p>
          {buttons}
        </div>
      ) : (
        <div className="pt-4 border-t border-grid-line">
          <p className="text-xs font-mono text-muted-ash mb-3">
            No API key? Use the Claude Skill instead.
          </p>
          {buttons}
        </div>
      )}

      <SkillInstallModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
