"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/sirt/AppShell";

type Tab = "api" | "skill";

const STEPS_API = [
  { text: <><strong className="text-off-white font-medium">Open sirt-five.vercel.app</strong> and click Generate Checklist.</> },
  { text: <><strong className="text-off-white font-medium">Select your LLM provider</strong> — Anthropic, OpenAI, Gemini, or Mistral.</> },
  { text: <><strong className="text-off-white font-medium">Paste your API key.</strong> Stays in your browser. Never stored.</> },
  { text: <><strong className="text-off-white font-medium">Upload your org-sec-stack.md</strong> or build one at <Link href="/setup" className="text-signal-green hover:underline underline-offset-2">/setup</Link>.</> },
  { text: <><strong className="text-off-white font-medium">Select incident type, severity, asset.</strong> Download your checklist.</> },
];

const STEPS_SKILL = [
  { text: <><strong className="text-off-white font-medium">Download the skill bundle</strong> from <a href="https://github.com/mello-io/SIRT/releases" target="_blank" rel="noopener noreferrer" className="text-signal-green hover:underline underline-offset-2">GitHub Releases</a>.</> },
  { text: <><strong className="text-off-white font-medium">Generate org-sec-stack.md</strong> at <Link href="/setup" className="text-signal-green hover:underline underline-offset-2">/setup</Link>.</> },
  { text: <><strong className="text-off-white font-medium">Generate your incident file</strong> at <Link href="/incident" className="text-signal-green hover:underline underline-offset-2">/incident</Link>.</> },
  { text: <><strong className="text-off-white font-medium">Create a new Claude Project</strong> — Pro, Team, or Enterprise.</> },
  { text: <><strong className="text-off-white font-medium">Upload all 6 files</strong> to the project. Done once — persists forever.</> },
  { text: <><strong className="text-off-white font-medium">Attach your incident .md file</strong> and send the trigger phrase.</> },
  { text: <><strong className="text-off-white font-medium">Claude generates</strong> your stack-specific checklist.</> },
  { text: <><strong className="text-off-white font-medium">Download as .md.</strong> Nothing stored. Everything local.</> },
];

export default function HowToPage() {
  const [activeTab, setActiveTab] = useState<Tab>("api");

  return (
    <AppShell>
      <div className="flex-1 relative">

        {/* Hero */}
        <div className="text-center px-6 pt-16 pb-10 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-mono text-muted-ash border border-grid-line rounded px-2.5 py-1 uppercase tracking-widest mb-5">
            Security Incident Response Transcript
          </span>
          <h1 className="font-mono font-bold text-4xl text-off-white leading-tight mb-4">
            Two ways to use <span className="text-signal-green">S.I.R.T.</span>
          </h1>
          <p className="text-muted-ash text-sm leading-relaxed">
            Pick the deployment that fits your workflow.<br />
            Both produce the same MITRE-tagged, stack-specific IR checklist.
          </p>
        </div>

        {/* Tab switcher + demo frames */}
        <div className="px-6 pb-10 max-w-6xl mx-auto w-full">

          {/* Tab bar */}
          <div className="flex border border-grid-line rounded-t-lg overflow-hidden bg-deep-slate">
            <button
              type="button"
              onClick={() => setActiveTab("api")}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 text-sm font-medium transition-colors border-r border-grid-line relative ${
                activeTab === "api" ? "bg-iron text-off-white" : "text-muted-ash hover:bg-iron/50 hover:text-off-white"
              }`}
            >
              {activeTab === "api" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-signal-green" />
              )}
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-intel-blue border-intel-blue/30 bg-intel-blue/10">
                API KEY
              </span>
              Web Platform
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("skill")}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 text-sm font-medium transition-colors relative ${
                activeTab === "skill" ? "bg-iron text-off-white" : "text-muted-ash hover:bg-iron/50 hover:text-off-white"
              }`}
            >
              {activeTab === "skill" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-signal-green" />
              )}
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-signal-green border-signal-green/25 bg-signal-green/10">
                CLAUDE SKILL
              </span>
              Claude Project
            </button>
          </div>

          {/* Demo frame */}
          <div className="border border-t-0 border-grid-line rounded-b-lg overflow-hidden bg-void aspect-video relative">
            <video
              key={activeTab}
              src={activeTab === "api" ? "/how-to/SIRT-API-Demo.mp4" : "/how-to/SIRT-Skill-Demo.mp4"}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Steps summary */}
        <div className="px-6 pb-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* API Key steps */}
          <div className="bg-deep-slate border border-grid-line rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-grid-line">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-intel-blue border-intel-blue/30 bg-intel-blue/10">
                API KEY
              </span>
              <span className="font-mono text-sm font-semibold text-off-white">Web Platform — 5 steps</span>
            </div>
            <div className="flex flex-col gap-4">
              {STEPS_API.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full border border-signal-green/30 bg-signal-green/6 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-[11px] font-bold text-signal-green">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-ash leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Bundle steps */}
          <div className="bg-deep-slate border border-grid-line rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-grid-line">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-signal-green border-signal-green/25 bg-signal-green/10">
                CLAUDE SKILL
              </span>
              <span className="font-mono text-sm font-semibold text-off-white">Claude Project — 8 steps</span>
            </div>
            <div className="flex flex-col gap-4">
              {STEPS_SKILL.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full border border-signal-green/30 bg-signal-green/6 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-[11px] font-bold text-signal-green">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-ash leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
