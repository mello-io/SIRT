// S.I.R.T. — Screen 01: Landing
// Product name, tagline, two primary CTAs, footer.

import Link from "next/link";
import { ArrowRight, Terminal, ExternalLink } from "lucide-react";
import { SkillBundleCTA } from "@/components/sirt/SkillBundleCTA";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative">
        {/* Hero block */}
        <div className="max-w-xl w-full">
          <div className="mb-8">
            <span className="inline-block text-[11px] font-mono text-muted-ash border border-grid-line rounded px-2.5 py-1 uppercase tracking-widest">
              Security Incident Response Transcript
            </span>
          </div>

          <h1 className="font-mono font-bold text-5xl text-off-white mb-4 tracking-tight leading-none">
            S.I.R.T.
          </h1>

          <p className="font-mono text-lg text-signal-green mb-3 tracking-tight">
            SOAR for humans.
          </p>

          <p className="text-muted-ash text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Comprehensive IR checklists tailored to your exact security stack.
            Stack-aware. MITRE-tagged. Analyst-ready.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/setup">
              <Button className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-6 h-11 w-full sm:w-auto">
                Set Up Org Stack
                <ArrowRight size={15} className="ml-2" />
              </Button>
            </Link>

            <Link href="/session">
              <Button
                variant="outline"
                className="border-grid-line bg-transparent text-off-white hover:bg-deep-slate font-mono text-sm px-6 h-11 w-full sm:w-auto"
              >
                Start Incident Session
                <Terminal size={15} className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Skill bundle path */}
          <div className="mt-6 max-w-sm mx-auto w-full">
            <SkillBundleCTA variant="card" />
          </div>

          {/* Quick-start hint */}
          <p className="mt-4 text-xs text-muted-ash font-mono">
            Already have an{" "}
            <code className="text-off-white bg-iron px-1 py-0.5 rounded text-[11px]">
              org-sec-stack.md
            </code>
            ?{" "}
            <Link
              href="/session"
              className="text-intel-blue hover:underline underline-offset-2"
            >
              Load it directly →
            </Link>
          </p>
        </div>

        {/* How it works */}
        <div className="mt-20 max-w-2xl w-full">
          <p className="text-[11px] font-mono text-muted-ash uppercase tracking-widest mb-6">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Set up your stack",
                body: "Select your security tools from 60+ options across 9 categories.",
              },
              {
                step: "02",
                title: "Select incident type",
                body: "Choose from 22 incident sub-types across 7 categories with MITRE tags.",
              },
              {
                step: "03",
                title: "Download checklist",
                body: "Get a phase-structured, tool-specific IR checklist as a portable .md file.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="bg-deep-slate border border-grid-line rounded p-4 text-left"
              >
                <span className="font-mono text-[11px] text-signal-green mb-2 block">
                  {step}
                </span>
                <p className="font-mono text-sm text-off-white font-semibold mb-1">
                  {title}
                </p>
                <p className="text-xs text-muted-ash leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-grid-line px-6 py-4 flex items-center justify-between text-[11px] font-mono text-muted-ash">
        <span>S.I.R.T. v1.0</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">⌘D — download checklist</span>
          <a
            href="https://github.com/mello-io/SIRT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-off-white transition-colors"
            aria-label="GitHub repository"
          >
            <ExternalLink size={13} />
            GitHub
          </a>
        </div>
      </footer>
    </AppShell>
  );
}
