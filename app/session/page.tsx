"use client";

// S.I.R.T. — Screen 03: Incident Session
// Step 1: Load Org Profile | Step 2: Incident Configuration + Generate

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  FileText,
  ArrowLeft,
  ArrowRight,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IncidentTypeCard } from "@/components/sirt/IncidentTypeCard";
import { SubTypeSelector } from "@/components/sirt/SubTypeSelector";
import { AssetTypeDropdown } from "@/components/sirt/AssetTypeDropdown";
import { ProgressTerminal } from "@/components/sirt/ProgressTerminal";
import { SkillBundleCTA } from "@/components/sirt/SkillBundleCTA";
import { INCIDENT_CATEGORIES } from "@/lib/constants/incident-types";
import { ASSET_TYPES } from "@/lib/constants/asset-types";
import { parseOrgStack, stackToolCount } from "@/lib/utils/stack-parser";
import { track } from "@/lib/analytics/vercel";
import { buildUserPrompt } from "@/lib/prompts/build-user-prompt";
import { isVercelMode } from "@/lib/config";
import { SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import { callProvider } from "@/lib/api/provider";
import type { OrgStack } from "@/lib/utils/stack-parser";
import type { Provider } from "@/lib/types/llm";
import {
  SIRT_OUTPUT_KEY,
  SIRT_API_KEY,
  SIRT_PROVIDER_KEY,
  type SirtOutput,
} from "@/lib/types/session";

// ── Step indicator ─────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1 as const, label: "Load Org Profile" },
    { n: 2 as const, label: "Configure Incident" },
  ];
  return (
    <div className="flex items-center w-full max-w-lg mx-auto mb-10">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                step.n < current
                  ? "bg-signal-green border-signal-green text-void"
                  : step.n === current
                  ? "border-signal-green text-signal-green"
                  : "border-grid-line text-muted-ash"
              }`}
            >
              {step.n < current ? "✓" : `0${step.n}`}
            </div>
            <span
              className={`text-[11px] font-mono whitespace-nowrap hidden sm:block ${
                step.n === current ? "text-off-white" : "text-muted-ash"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 ${
                step.n < current ? "bg-signal-green/40" : "bg-grid-line"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "anthropic", label: "Anthropic (claude-sonnet-4-6)" },
  { id: "openai", label: "OpenAI (gpt-4o)" },
  { id: "google", label: "Google (gemini-2.5-flash)" },
  { id: "mistral", label: "Mistral (mistral-large-latest)" },
];

const SEVERITY_OPTIONS = ["P1", "P2", "P3", "P4"];

export default function SessionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [orgStack, setOrgStack] = useState<OrgStack | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Step 2 state
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<string | null>(null);
  const [assetTypeId, setAssetTypeId] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [detectionTime, setDetectionTime] = useState<string>("");
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState(false);

  // Generate state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // ── File handling ────────────────────────────────────────────────────────

  function processFile(file: File) {
    setParseError(null);
    if (!file.name.endsWith(".md")) {
      setParseError("Please upload a .md file (org-sec-stack.md).");
      return;
    }
    if (file.size > 1_048_576) {
      setParseError("File is too large (max 1 MB). Please upload a valid org-sec-stack.md.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const stack = parseOrgStack(content);
        if (stackToolCount(stack) === 0) {
          setParseError(
            "No tools detected. Check the file format matches org-sec-stack.md."
          );
          return;
        }
        setOrgStack(stack);
      } catch {
        setParseError("Could not parse org-sec-stack.md. Check the file format.");
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  // ── Generate ─────────────────────────────────────────────────────────────

  const selectedCategory = INCIDENT_CATEGORIES.find(
    (c) => c.id === selectedCategoryId
  );
  const selectedSubType = selectedCategory?.subTypes.find(
    (s) => s.id === selectedSubTypeId
  );
  const selectedAsset = ASSET_TYPES.find((a) => a.id === assetTypeId);

  const canGenerate =
    !!orgStack &&
    !!selectedSubType &&
    !!selectedAsset &&
    apiKey.trim().length > 0;

  async function handleGenerate() {
    if (!orgStack || !selectedSubType || !selectedAsset) return;

    setIsGenerating(true);
    setGenerateError(null);

    // Persist provider + key to sessionStorage
    sessionStorage.setItem(SIRT_API_KEY, apiKey.trim());
    sessionStorage.setItem(SIRT_PROVIDER_KEY, provider);

    const userPrompt = buildUserPrompt({
      stack: orgStack,
      subType: selectedSubType,
      assetType: selectedAsset,
      severity: severity || undefined,
      detectionTime: detectionTime || undefined,
    });

    try {
      let content: string;
      let tokensUsed = 0;
      let usedProvider = provider;

      if (isVercelMode()) {
        // Vercel mode: proxy through /api/generate
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider,
            apiKey: apiKey.trim(),
            userPrompt,
            incidentTypeId: selectedSubType.id,
            assetTypeId,
            toolCount: stackToolCount(orgStack),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? `Server error: ${res.status}`);
        }

        content = data.content;
        tokensUsed = data.tokensUsed ?? 0;
        usedProvider = data.provider ?? provider;
      } else {
        // Static mode: call provider directly from browser
        const result = await callProvider({
          provider,
          apiKey: apiKey.trim(),
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
          maxTokens: 8000,
        });
        content = result.content;
        tokensUsed = result.tokensUsed;
        usedProvider = result.provider;
      }

      // Store output in sessionStorage and navigate to output view
      const output: SirtOutput = {
        content,
        provider: usedProvider,
        tokensUsed,
        meta: {
          orgName: orgStack.orgName,
          incidentCategory: selectedCategory?.name ?? "",
          incidentSubType: selectedSubType.name,
          incidentSubTypeId: selectedSubType.id,
          assetType: selectedAsset.name,
          severity: severity || "Not tagged",
          detectionTime: detectionTime || "Not specified",
          generatedAt: new Date().toISOString(),
          provider: usedProvider,
        },
      };

      sessionStorage.setItem(SIRT_OUTPUT_KEY, JSON.stringify(output));
      track("checklist_generated", {
        incident_subtype_id: selectedSubType.id,
        asset_type: assetTypeId,
        provider: usedProvider,
      });
      router.push("/output");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed. Try again.";
      track("generation_error", { provider, error_type: err instanceof Error ? err.name : "unknown" });
      setGenerateError(message);
      setIsGenerating(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppShell>
      <div className="flex-1 px-6 py-8 w-full max-w-3xl mx-auto">
        <StepIndicator current={step} />

        {/* ── Step 1: Load Org Profile ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
                Load Org Profile
              </h1>
              <p className="text-sm text-muted-ash leading-relaxed">
                Upload your{" "}
                <code className="text-off-white bg-iron px-1 py-0.5 rounded text-xs">
                  org-sec-stack.md
                </code>{" "}
                to begin. Don&apos;t have one?{" "}
                <Link
                  href="/setup"
                  className="text-intel-blue hover:underline underline-offset-2"
                >
                  Set up your stack →
                </Link>
              </p>
            </div>

            {/* Drag & drop zone */}
            {!orgStack ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload org-sec-stack.md"
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green ${
                  dragActive
                    ? "border-signal-green bg-signal-green/5"
                    : "border-grid-line hover:border-muted-ash/60 bg-deep-slate"
                }`}
              >
                <Upload
                  size={32}
                  className={`mx-auto mb-3 transition-colors ${
                    dragActive ? "text-signal-green" : "text-muted-ash"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-sm text-off-white mb-1">
                  Drop org-sec-stack.md here
                </p>
                <p className="text-xs text-muted-ash">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md"
                  className="sr-only"
                  aria-label="Upload org-sec-stack.md"
                  onChange={handleFileInput}
                />
              </div>
            ) : (
              /* Stack confirmation */
              <div className="bg-deep-slate border border-signal-green/30 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle
                    size={16}
                    className="text-signal-green"
                    aria-hidden="true"
                  />
                  <p className="font-mono text-sm text-signal-green font-semibold">
                    {orgStack.orgName}
                  </p>
                  <span className="text-xs text-muted-ash font-mono">
                    · {stackToolCount(orgStack)} tool
                    {stackToolCount(orgStack) !== 1 ? "s" : ""} detected
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {Object.entries(orgStack.tools).map(([category, tools]) =>
                    tools.length === 0 ? null : (
                      <div key={category} className="flex gap-3 items-start">
                        <span className="text-[11px] font-mono text-muted-ash w-40 shrink-0 pt-0.5">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tools.map((tool) => (
                            <span
                              key={tool.name}
                              className="text-[11px] font-mono bg-iron border border-grid-line rounded px-1.5 py-0.5 text-off-white"
                            >
                              {tool.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-grid-line">
                  <button
                    type="button"
                    onClick={() => {
                      setOrgStack(null);
                      setParseError(null);
                    }}
                    className="text-xs font-mono text-muted-ash hover:text-off-white transition-colors"
                  >
                    Load different file
                  </button>
                  <span className="text-grid-line">·</span>
                  <Link
                    href="/setup"
                    className="text-xs font-mono text-intel-blue hover:underline underline-offset-2"
                  >
                    Edit stack
                  </Link>
                </div>
              </div>
            )}

            {parseError && (
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-threat-amber">
                <AlertTriangle size={13} aria-hidden="true" />
                {parseError}
              </div>
            )}

            <div className="flex justify-end mt-8">
              <Button
                onClick={() => setStep(2)}
                disabled={!orgStack}
                className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-5 h-9 disabled:opacity-40"
              >
                Next
                <ArrowRight size={14} className="ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Generating: ProgressTerminal overlay ─────────────────────── */}
        {step === 2 && isGenerating && (
          <div className="py-8">
            <p className="text-xs font-mono text-muted-ash mb-5 text-center">
              Building your incident response checklist...
            </p>
            <ProgressTerminal />
          </div>
        )}

        {/* ── Step 2: Incident Configuration ───────────────────────────── */}
        {step === 2 && !isGenerating && (
          <div className="space-y-8">
            <div>
              <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
                Incident Configuration
              </h1>
              <p className="text-sm text-muted-ash leading-relaxed">
                Select the incident type, affected asset, and your LLM provider to
                generate the checklist.
              </p>
            </div>

            {/* Incident type — category grid */}
            <section>
              <label className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-3">
                Incident Type{" "}
                <span className="text-incident-red normal-case tracking-normal">
                  *
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {INCIDENT_CATEGORIES.map((cat) => (
                  <IncidentTypeCard
                    key={cat.id}
                    category={cat}
                    isSelected={selectedCategoryId === cat.id}
                    onSelect={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedSubTypeId(null);
                    }}
                  />
                ))}
              </div>

              {/* Sub-type selector — or empty state hint */}
              {selectedCategory ? (
                <div className="bg-deep-slate border border-grid-line rounded p-4">
                  <SubTypeSelector
                    category={selectedCategory}
                    selectedSubTypeId={selectedSubTypeId}
                    onSelect={setSelectedSubTypeId}
                  />
                </div>
              ) : (
                <p className="text-xs font-mono text-muted-ash text-center py-3 border border-dashed border-grid-line rounded">
                  Select a category above to see incident sub-types.
                </p>
              )}
            </section>

            {/* Asset type */}
            <section>
              <label
                htmlFor="asset-type"
                className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-2"
              >
                Asset Type{" "}
                <span className="text-incident-red normal-case tracking-normal">
                  *
                </span>
              </label>
              <AssetTypeDropdown value={assetTypeId} onChange={setAssetTypeId} />
            </section>

            {/* Severity + detection time (optional) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="severity"
                  className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-2"
                >
                  Severity{" "}
                  <span className="text-muted-ash/50 normal-case tracking-normal">
                    (tag only)
                  </span>
                </label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green appearance-none"
                >
                  <option value="">Not tagged</option>
                  {SEVERITY_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-ash font-mono mt-1">
                  For tagging only — all incidents treated as active priority.
                </p>
              </div>

              <div>
                <label
                  htmlFor="detection-time"
                  className="block text-xs font-mono text-muted-ash uppercase tracking-widest mb-2"
                >
                  Detection Time{" "}
                  <span className="text-muted-ash/50 normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="detection-time"
                  type="datetime-local"
                  value={detectionTime}
                  onChange={(e) => setDetectionTime(e.target.value)}
                  className="w-full bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green [color-scheme:dark]"
                />
                <p className="text-[10px] text-muted-ash font-mono mt-1">
                  Used for time-filter guidance in tool query blocks.
                </p>
              </div>
            </section>

            {/* LLM provider + API key */}
            <section className="bg-deep-slate border border-grid-line rounded p-5">
              <div className="flex items-center gap-2 mb-4">
                <Key size={14} className="text-muted-ash" aria-hidden="true" />
                <p className="text-xs font-mono text-muted-ash uppercase tracking-widest">
                  LLM Provider
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="provider"
                    className="block text-xs font-mono text-muted-ash mb-2"
                  >
                    Provider
                  </label>
                  <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as Provider)}
                    className="w-full bg-iron border border-grid-line text-off-white font-mono text-sm rounded px-3 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green appearance-none"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="api-key"
                    className="block text-xs font-mono text-muted-ash mb-2"
                  >
                    API Key{" "}
                    <span className="text-muted-ash/50">
                      (session only — cleared on tab close)
                    </span>
                  </label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="bg-iron border-grid-line text-off-white placeholder:text-muted-ash font-mono text-sm focus-visible:ring-signal-green h-9 pr-10"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-ash hover:text-off-white transition-colors"
                      aria-label={showKey ? "Hide API key" : "Show API key"}
                    >
                      {showKey ? (
                        <EyeOff size={14} aria-hidden="true" />
                      ) : (
                        <Eye size={14} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Skill bundle alternative */}
            <SkillBundleCTA variant="inline" />

            {/* Error */}
            {generateError && (
              <div className="flex items-start gap-2 bg-incident-red/10 border border-incident-red/30 rounded p-3">
                <AlertTriangle
                  size={14}
                  className="text-incident-red shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs font-mono text-incident-red leading-relaxed">
                  {generateError}
                </p>
              </div>
            )}

            {/* Navigation + Generate */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="border-grid-line text-muted-ash hover:text-off-white hover:bg-deep-slate font-mono text-sm h-9 px-4"
              >
                <ArrowLeft size={14} className="mr-2" aria-hidden="true" />
                Back
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-6 h-9 disabled:opacity-40 min-w-[180px]"
              >
                <FileText size={14} className="mr-2" aria-hidden="true" />
                Generate Checklist
              </Button>
            </div>

            {!canGenerate && !isGenerating && (
              <p className="text-[11px] text-muted-ash font-mono text-right -mt-4">
                {!selectedSubType
                  ? "Select an incident type to continue"
                  : !assetTypeId
                  ? "Select an asset type to continue"
                  : !apiKey.trim()
                  ? "Enter your API key to continue"
                  : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
