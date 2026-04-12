// S.I.R.T. — /output (Screen 04)
// Two-panel output view. Reads SirtOutput from sessionStorage.
// Left panel: session summary + action buttons.
// Right panel: rendered markdown checklist with custom component overrides.
//
// Markdown rendering strategy:
//   - Content is pre-split by H2 headings before rendering.
//   - Each H2 section is wrapped in a collapsible PhaseBlock.
//   - Custom overrides: MitreTag (ATT&CK links), DecisionPoint (⚠️ callouts),
//     ToolQueryBlock (fenced code), styled blockquote/h1/h3/li.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Download, RotateCcw, CheckCircle } from "lucide-react";
import React from "react";
import type { Components } from "react-markdown";

import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";
import { MitreTag } from "@/components/sirt/MitreTag";
import { DecisionPoint } from "@/components/sirt/DecisionPoint";
import { PhaseBlock } from "@/components/sirt/PhaseBlock";
import { ToolQueryBlock } from "@/components/sirt/ToolQueryBlock";
import { downloadMarkdown, buildOutputFilename } from "@/lib/utils/file-download";
import { SIRT_OUTPUT_KEY, type SirtOutput } from "@/lib/types/session";

// ── Section splitter ──────────────────────────────────────────────────────────
// Splits markdown into a preamble (before the first H2) and an array of
// { heading, body } sections, one per ## heading.

function splitSections(markdown: string): {
  preamble: string;
  sections: Array<{ heading: string; body: string }>;
} {
  const sections: Array<{ heading: string; body: string }> = [];
  const lines = markdown.split("\n");

  let currentHeading: string | null = null;
  let currentBody: string[] = [];
  let inPreamble = true;
  let preamble = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inPreamble) {
        preamble = currentBody.join("\n");
        inPreamble = false;
        currentBody = [];
      } else if (currentHeading !== null) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n") });
        currentBody = [];
      }
      currentHeading = line.slice(3).trim();
    } else {
      currentBody.push(line);
    }
  }

  // Flush last section
  if (currentHeading !== null) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n") });
  }

  // Fallback: no H2 sections found — everything is preamble
  if (sections.length === 0 && inPreamble) {
    preamble = lines.join("\n");
  }

  return { preamble, sections };
}

// ── Markdown component overrides ──────────────────────────────────────────────

const markdownComponents: Components = {
  // ATT&CK links → purple badge; other links → standard styled anchor
  a({ href, children }) {
    if (href?.includes("attack.mitre.org")) {
      return <MitreTag href={href}>{children}</MitreTag>;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-intel-blue underline underline-offset-2 hover:text-intel-blue/80 transition-colors"
      >
        {children}
      </a>
    );
  },

  // Paragraphs starting with ⚠️ DECISION POINT: → amber callout
  p({ children }) {
    const childArray = React.Children.toArray(children);
    const first = childArray[0];
    if (typeof first === "string" && first.startsWith("⚠️ DECISION POINT:")) {
      return <DecisionPoint>{children}</DecisionPoint>;
    }
    return (
      <p className="text-off-white/85 text-sm leading-relaxed mb-3">{children}</p>
    );
  },

  // Block code (fenced) → ToolQueryBlock; inline code → badge
  pre({ children }) {
    // Extract lang from child code element, then render ToolQueryBlock
    let lang = "";
    let codeContent: React.ReactNode = children;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const el = child as React.ReactElement<{
          className?: string;
          children?: React.ReactNode;
        }>;
        const match = /language-(\w+)/.exec(el.props.className || "");
        if (match) lang = match[1];
        if (el.props.children !== undefined) codeContent = el.props.children;
      }
    });

    return <ToolQueryBlock lang={lang}>{codeContent}</ToolQueryBlock>;
  },

  code({ className, children }) {
    // Only reached for inline code (block code is intercepted by pre override)
    const isBlock = /language-(\w+)/.test(className || "");
    if (isBlock) return null; // handled by pre
    return (
      <code className="bg-iron text-off-white font-mono text-xs px-1.5 py-0.5 rounded border border-grid-line">
        {children}
      </code>
    );
  },

  // H1 title
  h1({ children }) {
    return (
      <h1 className="font-mono font-bold text-lg text-off-white mb-4 mt-2 leading-tight">
        {children}
      </h1>
    );
  },

  // H3 tool sub-sections
  h3({ children }) {
    return (
      <h3 className="font-mono font-semibold text-xs text-intel-blue uppercase tracking-widest mt-5 mb-2">
        {children}
      </h3>
    );
  },

  // Checklist + bullet lists
  ul({ children }) {
    return <ul className="space-y-1.5 mb-4 pl-1">{children}</ul>;
  },
  ol({ children }) {
    return (
      <ol className="space-y-1.5 mb-4 pl-4 list-decimal">{children}</ol>
    );
  },
  li({ children }) {
    return (
      <li className="text-sm text-off-white/85 leading-relaxed pl-1">
        {children}
      </li>
    );
  },

  // Header blockquote (metadata block at top of output)
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-signal-green/30 pl-4 my-4 space-y-0.5 bg-deep-slate/50 py-3 rounded-r">
        {children}
      </blockquote>
    );
  },

  strong({ children }) {
    return <strong className="text-off-white font-semibold">{children}</strong>;
  },

  // Horizontal rule between sections
  hr() {
    return <hr className="border-grid-line my-4" />;
  },
};

// ── Severity color helper ─────────────────────────────────────────────────────

function severityClasses(severity: string) {
  if (severity === "P1")
    return "text-incident-red border-incident-red/30 bg-incident-red/10";
  if (severity === "P2")
    return "text-threat-amber border-threat-amber/30 bg-threat-amber/10";
  if (severity === "P3")
    return "text-signal-green border-signal-green/30 bg-signal-green/10";
  return "text-intel-blue border-intel-blue/30 bg-intel-blue/10";
}

// ── Timestamp formatter ───────────────────────────────────────────────────────

function fmtTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OutputPage() {
  const router = useRouter();
  const [output, setOutput] = useState<SirtOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(SIRT_OUTPUT_KEY);
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setOutput(JSON.parse(raw) as SirtOutput);
    } catch {
      setLoadError(true);
    }
  }, [router]);

  // ⌘/Ctrl + D — download shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (!output) return;
        downloadMarkdown(
          output.content,
          buildOutputFilename(output.meta.incidentSubType)
        );
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [output]);

  // Error state — bad sessionStorage data
  if (loadError) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <p className="font-mono text-off-white text-sm">
              Failed to load session output.
            </p>
            <Button
              onClick={() => router.push("/session")}
              className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm h-9 px-5"
            >
              Start New Session
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Loading — waiting for sessionStorage read
  if (!output) return null;

  const { preamble, sections } = splitSections(output.content);
  const filename = buildOutputFilename(output.meta.incidentSubType);

  function handleDownload() {
    downloadMarkdown(output!.content, filename);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output!.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail
    }
  }

  function handleNewSession() {
    sessionStorage.removeItem(SIRT_OUTPUT_KEY);
    router.push("/session");
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* ── Left panel: session summary + actions ────────────────────── */}
        <aside className="w-full lg:w-68 xl:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-grid-line bg-deep-slate">
          <div className="sticky top-0 p-5 space-y-5 lg:max-h-[calc(100vh-57px)] lg:overflow-y-auto">
            {/* Meta */}
            <div>
              <p className="text-[10px] font-mono text-muted-ash uppercase tracking-widest mb-4">
                Session Summary
              </p>

              <div className="space-y-3.5">
                <div>
                  <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                    Incident
                  </p>
                  <p className="text-xs font-mono text-off-white leading-snug">
                    {output.meta.incidentSubType}
                  </p>
                  <p className="text-[10px] font-mono text-muted-ash mt-0.5">
                    {output.meta.incidentSubTypeId} ·{" "}
                    {output.meta.incidentCategory}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                    Asset Type
                  </p>
                  <p className="text-xs font-mono text-off-white">
                    {output.meta.assetType}
                  </p>
                </div>

                {output.meta.severity && (
                  <div>
                    <p className="text-[10px] font-mono text-muted-ash mb-1">
                      Severity
                    </p>
                    <span
                      className={`inline-block text-[11px] font-mono font-semibold border rounded px-2 py-0.5 ${severityClasses(output.meta.severity)}`}
                    >
                      {output.meta.severity}
                    </span>
                  </div>
                )}

                {output.meta.detectionTime && (
                  <div>
                    <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                      Detection Time
                    </p>
                    <p className="text-[11px] font-mono text-off-white">
                      {output.meta.detectionTime}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                    Organisation
                  </p>
                  <p className="text-xs font-mono text-signal-green">
                    {output.meta.orgName || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                    Generated
                  </p>
                  <p className="text-[11px] font-mono text-muted-ash">
                    {fmtTimestamp(output.meta.generatedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-muted-ash mb-0.5">
                    Provider
                  </p>
                  <p className="text-[11px] font-mono text-off-white capitalize">
                    {output.provider}
                  </p>
                  {output.tokensUsed > 0 && (
                    <p className="text-[10px] font-mono text-muted-ash">
                      {output.tokensUsed.toLocaleString()} tokens
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-grid-line">
              <Button
                onClick={handleDownload}
                className="w-full bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-xs h-8 px-3"
              >
                <Download size={12} className="mr-2" aria-hidden="true" />
                Download .md
                <span className="ml-auto text-[10px] opacity-60 font-normal hidden sm:inline">
                  ⌘D
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full border-grid-line text-muted-ash hover:text-off-white hover:bg-iron font-mono text-xs h-8 px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle
                      size={12}
                      className="mr-2 text-signal-green"
                      aria-hidden="true"
                    />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} className="mr-2" aria-hidden="true" />
                    Copy to Clipboard
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleNewSession}
                className="w-full text-muted-ash hover:text-off-white font-mono text-xs h-8 px-3"
              >
                <RotateCcw size={12} className="mr-2" aria-hidden="true" />
                New Session
              </Button>
            </div>

            {/* Filename preview */}
            <p className="text-[10px] font-mono text-muted-ash/50 leading-relaxed break-all">
              {filename}
            </p>
          </div>
        </aside>

        {/* ── Right panel: rendered checklist ──────────────────────────── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-3xl">
            {/* Preamble: blockquote header, H1 title, incident overview */}
            {preamble.trim() && (
              <div className="mb-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {preamble}
                </ReactMarkdown>
              </div>
            )}

            {/* H2 sections rendered as collapsible PhaseBlocks */}
            {sections.length > 0 ? (
              sections.map((section, i) => (
                <PhaseBlock key={i} heading={section.heading}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {section.body}
                  </ReactMarkdown>
                </PhaseBlock>
              ))
            ) : (
              // Fallback: no H2 sections detected — render full content
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {output.content}
              </ReactMarkdown>
            )}

            {/* MITRE ATT&CK attribution — required for public ATT&CK usage */}
            <p className="mt-10 pt-4 border-t border-grid-line text-[10px] font-mono text-muted-ash/50 leading-relaxed">
              MITRE ATT&amp;CK® is a registered trademark of The MITRE
              Corporation. Technique references link to{" "}
              <a
                href="https://attack.mitre.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-ash transition-colors underline underline-offset-2"
              >
                attack.mitre.org
              </a>
              .
            </p>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
