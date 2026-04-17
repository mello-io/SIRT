"use client";

// S.I.R.T. — Screen 02: Stack Setup Wizard
// 3-step wizard: Tool Selection → Documentation Enrichment → Org Profile Review

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle,
  X,
} from "lucide-react";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategorySection } from "@/components/sirt/CategorySection";
import { DocStatusBadge } from "@/components/sirt/DocStatusBadge";
import {
  TOOL_LIBRARY,
  TOOL_CATEGORIES,
  type Tool,
  type ToolCategory,
} from "@/lib/constants/tool-library";
import { downloadMarkdown } from "@/lib/utils/file-download";
import { track } from "@/lib/analytics/vercel";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DocOverride {
  docSource: "custom" | "none";
  fileName?: string;
}

interface CustomTool {
  id: string;
  name: string;
  category: ToolCategory;
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1 as const, label: "Tool Selection" },
  { n: 2 as const, label: "Documentation" },
  { n: 3 as const, label: "Org Profile" },
];

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div
      className="flex items-center w-full max-w-lg mx-auto mb-10"
      aria-label="Wizard progress"
    >
      {STEPS.map((step, i) => (
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
              aria-current={step.n === current ? "step" : undefined}
            >
              {step.n < current ? "✓" : `0${step.n}`}
            </div>
            <span
              className={`text-[11px] font-mono whitespace-nowrap hidden sm:block transition-colors ${
                step.n === current ? "text-off-white" : "text-muted-ash"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 transition-colors ${
                step.n < current ? "bg-signal-green/40" : "bg-grid-line"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SetupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customTools, setCustomTools] = useState<CustomTool[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [customCategory, setCustomCategory] = useState<ToolCategory>("SIEM");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 2 state
  const [docOverrides, setDocOverrides] = useState<Map<string, DocOverride>>(
    new Map()
  );

  // Step 3 state
  const [orgName, setOrgName] = useState("");
  const [generated, setGenerated] = useState(false);

  // ── Derived values ──────────────────────────────────────────────────────────

  const filteredLibraryTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TOOL_LIBRARY;
    return TOOL_LIBRARY.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.publisher.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedLibraryTools: Tool[] = TOOL_LIBRARY.filter((t) =>
    selectedIds.has(t.id)
  );
  const selectedCustomTools: CustomTool[] = customTools.filter((ct) =>
    selectedIds.has(ct.id)
  );
  const allSelectedTools = [
    ...selectedLibraryTools,
    ...selectedCustomTools.map((ct) => ({
      ...ct,
      publisher: "Custom",
      publicDocsUrl: "",
    })),
  ];

  // ── Event handlers ──────────────────────────────────────────────────────────

  function toggleTool(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addCustomTool() {
    const name = customInput.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    setCustomTools((prev) => [...prev, { id, name, category: customCategory }]);
    setSelectedIds((prev) => { const next = new Set(prev); next.add(id); return next; });
    setCustomInput("");
  }

  function removeCustomTool(id: string) {
    setCustomTools((prev) => prev.filter((ct) => ct.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDocOverrides((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  function handleFileUpload(toolId: string, file: File) {
    setDocOverrides(
      (prev) =>
        new Map(prev).set(toolId, {
          docSource: "custom",
          fileName: file.name,
        })
    );
  }

  function clearDocOverride(toolId: string) {
    setDocOverrides((prev) => {
      const next = new Map(prev);
      next.delete(toolId);
      return next;
    });
  }

  function getDocSource(toolId: string): "public" | "custom" | "none" {
    const override = docOverrides.get(toolId);
    if (override) return override.docSource;
    if (customTools.some((ct) => ct.id === toolId)) return "none";
    return "public";
  }

  function generateOrgStack() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const lines: string[] = [
      "# org-sec-stack.md",
      `> Organisation: ${orgName.trim() || "My Organisation"}`,
      `> Generated: ${dateStr}`,
      `> S.I.R.T. Version: v1.0`,
      "",
    ];

    for (const category of TOOL_CATEGORIES) {
      const libTools = selectedLibraryTools.filter(
        (t) => t.category === category
      );
      const custTools = selectedCustomTools.filter(
        (ct) => ct.category === category
      );
      if (libTools.length + custTools.length === 0) continue;

      lines.push(`## ${category}`);
      for (const tool of libTools) {
        const override = docOverrides.get(tool.id);
        if (override?.docSource === "custom" && override.fileName) {
          lines.push(`- ${tool.name} (Custom docs: ${override.fileName})`);
        } else {
          lines.push(`- ${tool.name} (Public docs)`);
        }
      }
      for (const tool of custTools) {
        lines.push(`- ${tool.name} (No docs)`);
      }
      lines.push("");
    }

    downloadMarkdown(lines.join("\n"), "org-sec-stack.md");
    track("stack_setup_completed", { tool_count: selectedIds.size + customTools.length });
    setGenerated(true);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AppShell>
      <div className="flex-1 px-6 py-8 w-full max-w-4xl mx-auto">
        <StepIndicator current={step} />

        {/* ── Step 1: Tool Selection ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
                Tool Selection
              </h1>
              <p className="text-sm text-muted-ash leading-relaxed">
                Select every security tool in your stack. The more you include,
                the more specific the checklist output.
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-ash pointer-events-none"
                aria-hidden="true"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by name, publisher, or category..."
                className="pl-8 bg-iron border-grid-line text-off-white placeholder:text-muted-ash font-mono text-sm focus-visible:ring-signal-green h-9"
              />
            </div>

            {/* Category sections */}
            <div className="space-y-2 mb-5">
              {TOOL_CATEGORIES.map((category) => {
                const tools = filteredLibraryTools.filter(
                  (t) => t.category === category
                );
                if (tools.length === 0) return null;
                return (
                  <CategorySection
                    key={category}
                    category={category}
                    tools={tools}
                    selectedToolIds={selectedIds}
                    onToggle={toggleTool}
                  />
                );
              })}
              {filteredLibraryTools.length === 0 && (
                <p className="text-sm text-muted-ash font-mono text-center py-8">
                  No tools match &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>

            {/* Add custom tool */}
            <div className="bg-deep-slate border border-grid-line rounded p-4 mb-8">
              <p className="text-xs font-mono text-muted-ash mb-3">
                Tool not in the library? Add it manually:
              </p>
              <div className="flex gap-2">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTool()}
                  placeholder="Tool name..."
                  className="bg-iron border-grid-line text-off-white placeholder:text-muted-ash font-mono text-sm focus-visible:ring-signal-green h-9 flex-1 min-w-0"
                />
                <select
                  value={customCategory}
                  onChange={(e) =>
                    setCustomCategory(e.target.value as ToolCategory)
                  }
                  className="bg-iron border border-grid-line text-off-white font-mono text-xs rounded px-2 h-9 focus:outline-none focus:ring-1 focus:ring-signal-green shrink-0"
                  aria-label="Category for custom tool"
                >
                  {TOOL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={addCustomTool}
                  disabled={!customInput.trim()}
                  className="bg-deep-slate border border-grid-line text-off-white hover:bg-iron font-mono text-xs h-9 px-3 disabled:opacity-40 shrink-0"
                  aria-label="Add custom tool"
                >
                  <Plus size={13} aria-hidden="true" />
                </Button>
              </div>

              {customTools.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customTools.map((ct) => (
                    <span
                      key={ct.id}
                      className="inline-flex items-center gap-1.5 bg-iron border border-grid-line rounded px-2 py-1 text-xs font-mono text-off-white"
                    >
                      {ct.name}
                      <span className="text-muted-ash">· {ct.category}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomTool(ct.id)}
                        className="text-muted-ash hover:text-incident-red transition-colors ml-0.5"
                        aria-label={`Remove ${ct.name}`}
                      >
                        <X size={11} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-ash">
                {selectedIds.size > 0
                  ? `${selectedIds.size} tool${selectedIds.size !== 1 ? "s" : ""} selected`
                  : "Select at least one tool to continue"}
              </span>
              <Button
                onClick={() => setStep(2)}
                disabled={selectedIds.size === 0}
                className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-5 h-9 disabled:opacity-40"
              >
                Next
                <ArrowRight size={14} className="ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Documentation Enrichment ──────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
                Documentation Enrichment
              </h1>
              <p className="text-sm text-muted-ash leading-relaxed">
                Public docs are mapped by default for all library tools.
                Optionally upload your own runbooks or config docs for more
                specific output.
              </p>
            </div>

            <div className="space-y-2 mb-8">
              {allSelectedTools.map((tool) => {
                const docSource = getDocSource(tool.id);
                const override = docOverrides.get(tool.id);
                const isCustomTool = customTools.some(
                  (ct) => ct.id === tool.id
                );

                return (
                  <div
                    key={tool.id}
                    className="bg-deep-slate border border-grid-line rounded p-4 flex items-center gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-mono text-off-white font-semibold truncate">
                        {tool.name}
                      </p>
                      <p className="text-xs text-muted-ash mt-0.5">
                        {tool.publisher} · {tool.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                      <DocStatusBadge
                        docSource={docSource}
                        fileName={override?.fileName}
                      />

                      {!isCustomTool && docSource !== "custom" && (
                        <label className="text-xs font-mono text-intel-blue hover:underline underline-offset-2 cursor-pointer">
                          Upload custom
                          <input
                            type="file"
                            accept=".md,.pdf"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(tool.id, file);
                            }}
                          />
                        </label>
                      )}

                      {override && (
                        <button
                          type="button"
                          onClick={() => clearDocOverride(tool.id)}
                          className="text-xs font-mono text-muted-ash hover:text-off-white transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-grid-line text-muted-ash hover:text-off-white hover:bg-deep-slate font-mono text-sm h-9 px-4"
              >
                <ArrowLeft size={14} className="mr-2" aria-hidden="true" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-5 h-9"
              >
                Next
                <ArrowRight size={14} className="ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Org Profile Review ─────────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <h1 className="font-mono font-bold text-2xl text-off-white mb-1">
                Org Profile Review
              </h1>
              <p className="text-sm text-muted-ash leading-relaxed">
                Review your stack, name your org, and download the profile file.
              </p>
            </div>

            {/* Stack summary */}
            <div className="bg-deep-slate border border-grid-line rounded p-5 mb-6">
              <p className="text-[11px] font-mono text-muted-ash uppercase tracking-widest mb-4">
                Stack Summary — {selectedIds.size} tool
                {selectedIds.size !== 1 ? "s" : ""}
              </p>
              <div className="space-y-4">
                {TOOL_CATEGORIES.map((category) => {
                  const libTools = selectedLibraryTools.filter(
                    (t) => t.category === category
                  );
                  const custTools = selectedCustomTools.filter(
                    (ct) => ct.category === category
                  );
                  if (libTools.length + custTools.length === 0) return null;
                  return (
                    <div key={category}>
                      <p className="text-xs font-mono text-muted-ash mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[...libTools, ...custTools].map((tool) => {
                          const ds = getDocSource(tool.id);
                          return (
                            <span
                              key={tool.id}
                              className={`inline-flex items-center gap-1 text-xs font-mono rounded px-2 py-0.5 border ${
                                ds === "custom"
                                  ? "bg-signal-green/10 border-signal-green/30 text-signal-green"
                                  : ds === "public"
                                  ? "bg-iron border-grid-line text-off-white"
                                  : "bg-iron border-grid-line text-muted-ash"
                              }`}
                            >
                              {tool.name}
                              {ds === "custom" && (
                                <span className="text-[9px] opacity-70">
                                  custom
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Org name input */}
            <div className="mb-8">
              <label
                htmlFor="org-name"
                className="block text-xs font-mono text-muted-ash mb-2"
              >
                Organisation name{" "}
                <span className="text-muted-ash/60">(optional)</span>
              </label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Acme Security Team"
                className="bg-iron border-grid-line text-off-white placeholder:text-muted-ash font-mono text-sm focus-visible:ring-signal-green h-9 max-w-sm"
              />
            </div>

            {/* Generate / success */}
            {!generated ? (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-grid-line text-muted-ash hover:text-off-white hover:bg-deep-slate font-mono text-sm h-9 px-4"
                >
                  <ArrowLeft size={14} className="mr-2" aria-hidden="true" />
                  Back
                </Button>
                <Button
                  onClick={generateOrgStack}
                  className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm px-5 h-9"
                >
                  <Download size={14} className="mr-2" aria-hidden="true" />
                  Generate org-sec-stack.md
                </Button>
              </div>
            ) : (
              <div className="bg-signal-green/10 border border-signal-green/30 rounded p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="text-signal-green shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-mono text-signal-green font-semibold">
                      org-sec-stack.md downloaded
                    </p>
                    <p className="text-xs text-muted-ash mt-1 leading-relaxed">
                      Your org profile is saved locally. Load it in{" "}
                      <Link
                        href="/session"
                        className="text-intel-blue hover:underline underline-offset-2"
                      >
                        Start Incident Session
                      </Link>{" "}
                      to generate a checklist.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        type="button"
                        onClick={generateOrgStack}
                        variant="outline"
                        className="border-grid-line text-muted-ash hover:text-off-white hover:bg-deep-slate font-mono text-xs h-7 px-3"
                      >
                        Download again
                      </Button>
                      <Link href="/session">
                        <Button className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-xs h-7 px-3">
                          Start Session →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
