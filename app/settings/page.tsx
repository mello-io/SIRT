"use client";

// S.I.R.T. — Screen 05: Settings
// Deploy mode indicator, LLM provider default, clear API key, GitHub link, version info.

import { useState } from "react";
import { ExternalLink, Trash2, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";
import { SkillBundleCTA } from "@/components/sirt/SkillBundleCTA";
import { DEPLOY_MODE } from "@/lib/config";
import type { Provider } from "@/lib/types/llm";

const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Anthropic (claude-sonnet-4-6)",
  openai: "OpenAI (gpt-4o)",
  google: "Google (gemini-1.5-pro)",
  mistral: "Mistral (mistral-large-latest)",
};

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  function clearApiKey() {
    sessionStorage.removeItem("sirt_api_key");
    sessionStorage.removeItem("sirt_provider");
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }

  const deployLabel =
    DEPLOY_MODE === "vercel" ? "Vercel Mode" : "Static Mode";
  const deployDescription =
    DEPLOY_MODE === "vercel"
      ? "API calls are proxied through Vercel Functions. Your key stays server-side."
      : "API calls go directly from your browser to the LLM provider.";

  return (
    <AppShell>
      <div className="flex-1 px-6 py-12 max-w-xl mx-auto w-full">
        <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
          Settings
        </h1>
        <p className="text-sm text-muted-ash mb-10">
          Session and deployment configuration.
        </p>

        <div className="space-y-6">
          {/* Deploy mode */}
          <section className="bg-deep-slate border border-grid-line rounded p-5">
            <h2 className="font-mono text-sm font-semibold text-off-white mb-1">
              Deploy Mode
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded border ${
                  DEPLOY_MODE === "vercel"
                    ? "text-signal-green border-signal-green/40 bg-signal-green/10"
                    : "text-intel-blue border-intel-blue/40 bg-intel-blue/10"
                }`}
              >
                {deployLabel}
              </span>
            </div>
            <p className="text-xs text-muted-ash mt-2 leading-relaxed">
              {deployDescription}
            </p>
          </section>

          {/* LLM providers */}
          <section className="bg-deep-slate border border-grid-line rounded p-5">
            <h2 className="font-mono text-sm font-semibold text-off-white mb-1">
              LLM Providers
            </h2>
            <p className="text-xs text-muted-ash mb-4 leading-relaxed">
              Provider and API key are selected per session and stored in{" "}
              <code className="text-off-white bg-iron px-1 py-0.5 rounded text-[11px]">
                sessionStorage
              </code>{" "}
              only — cleared when the tab closes.
            </p>
            <ul className="space-y-1.5">
              {(Object.entries(PROVIDER_LABELS) as [Provider, string][]).map(
                ([id, label]) => (
                  <li
                    key={id}
                    className="flex items-center gap-2 text-xs font-mono text-muted-ash"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-grid-line inline-block" />
                    {label}
                  </li>
                )
              )}
            </ul>
          </section>

          {/* Clear API key */}
          <section className="bg-deep-slate border border-grid-line rounded p-5">
            <h2 className="font-mono text-sm font-semibold text-off-white mb-1">
              Session Data
            </h2>
            <p className="text-xs text-muted-ash mb-4 leading-relaxed">
              Clears the API key and provider stored in this session.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearApiKey}
              className="border-grid-line text-muted-ash hover:text-incident-red hover:border-incident-red/40 font-mono text-xs h-8 gap-2"
            >
              {cleared ? (
                <>
                  <CheckCircle size={13} className="text-signal-green" />
                  <span className="text-signal-green">Cleared</span>
                </>
              ) : (
                <>
                  <Trash2 size={13} />
                  Clear stored API key
                </>
              )}
            </Button>
          </section>

          {/* Skill bundle */}
          <section className="bg-deep-slate border border-grid-line rounded p-5">
            <h2 className="font-mono text-sm font-semibold text-off-white mb-4">
              Skill Bundle
            </h2>
            <SkillBundleCTA variant="inline" />
          </section>

          {/* About */}
          <section className="bg-deep-slate border border-grid-line rounded p-5">
            <h2 className="font-mono text-sm font-semibold text-off-white mb-3">
              About
            </h2>
            <dl className="space-y-2 text-xs font-mono">
              {[
                ["Product", "S.I.R.T. — Security Incident Response Transcript"],
                ["Version", "v1.0"],
                ["Incident types", "22 across 7 categories"],
                ["Tool library", "60+ tools across 9 categories"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <dt className="text-muted-ash w-32 shrink-0">{label}</dt>
                  <dd className="text-off-white">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="https://github.com/mello-io/SIRT"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-intel-blue hover:underline underline-offset-2"
            >
              <ExternalLink size={12} />
              github.com/mello-io/SIRT
            </a>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
