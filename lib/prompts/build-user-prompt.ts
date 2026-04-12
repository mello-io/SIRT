// S.I.R.T. User Prompt Builder
// Constructs the dynamic, per-session user prompt from: org stack, incident type,
// asset type, severity, detection time, and optional tool doc excerpts.
// Called on the client before dispatching to /api/generate.

import type { OrgStack } from "@/lib/utils/stack-parser";
import type { IncidentSubType } from "@/lib/constants/incident-types";
import type { AssetType } from "@/lib/constants/asset-types";
import { getMitreContext } from "@/lib/prompts/mitre-context";

export interface BuildPromptOptions {
  stack: OrgStack;
  subType: IncidentSubType;
  assetType: AssetType;
  severity?: string;
  detectionTime?: string;
  toolDocs?: Record<string, string>; // toolName → doc excerpt
}

export function buildUserPrompt(opts: BuildPromptOptions): string {
  const { stack, subType, assetType, severity, detectionTime, toolDocs } = opts;
  const mitreCtx = getMitreContext(subType.id);

  const lines: string[] = [];

  // ── Incident context ────────────────────────────────────────────────────────
  lines.push("## Incident Context");
  lines.push("");
  lines.push(`- **Incident Type:** ${subType.name} (Sub-type ${subType.id})`);
  lines.push(`- **Asset Type:** ${assetType.name} — ${assetType.description}`);
  lines.push(
    `- **Severity Tag:** ${severity ? `${severity} (metadata only — treat as active priority)` : "Not tagged"}`
  );
  lines.push(
    `- **Detection Time:** ${detectionTime ? `${detectionTime} (use for time-filter guidance in tool queries)` : "Not specified"}`
  );
  lines.push(`- **Organisation:** ${stack.orgName}`);
  lines.push("");

  // ── Incident description ────────────────────────────────────────────────────
  lines.push("## Incident Description");
  lines.push("");
  lines.push(subType.description);
  lines.push("");

  // ── Organisation security stack ─────────────────────────────────────────────
  lines.push("## Organisation Security Stack");
  lines.push("");

  const categories = Object.keys(stack.tools);
  if (categories.length === 0) {
    lines.push("No tools specified.");
  } else {
    for (const category of categories) {
      const tools = stack.tools[category];
      if (!tools || tools.length === 0) continue;
      lines.push(`**${category}:**`);
      for (const tool of tools) {
        const docNote =
          tool.docSource === "custom" && tool.customDocName
            ? `(Custom docs: ${tool.customDocName})`
            : tool.docSource === "public"
            ? "(Public docs)"
            : "(No docs)";
        lines.push(`- ${tool.name} ${docNote}`);
      }
      lines.push("");
    }
  }

  // ── MITRE ATT&CK context ────────────────────────────────────────────────────
  lines.push("## MITRE ATT&CK Techniques for This Incident");
  lines.push("");

  if (mitreCtx.techniques.length === 0) {
    lines.push(
      `Primary tags from incident library: ${subType.mitreTags.join(", ")}`
    );
  } else {
    for (const technique of mitreCtx.techniques) {
      lines.push(
        `- [${technique.id}](${technique.url}) — **${technique.name}** (${technique.tactic}): ${technique.description}`
      );
    }
  }
  lines.push("");

  // ── Tool documentation excerpts (if available) ──────────────────────────────
  if (toolDocs && Object.keys(toolDocs).length > 0) {
    lines.push("## Tool Documentation Context");
    lines.push("");
    lines.push(
      "Use the following documentation excerpts to generate more specific, accurate tool queries:"
    );
    lines.push("");
    for (const [toolName, excerpt] of Object.entries(toolDocs)) {
      if (!excerpt.trim()) continue;
      lines.push(`### ${toolName}`);
      lines.push(excerpt.slice(0, 2000)); // cap per-tool to 2KB
      lines.push("");
    }
  }

  // ── Instruction ─────────────────────────────────────────────────────────────
  lines.push("## Instruction");
  lines.push("");
  lines.push(
    "Generate a complete incident response checklist for the incident described above."
  );
  lines.push(
    "The checklist must use the specific tools listed in the organisation's stack — reference them by exact name."
  );
  lines.push(
    "Follow your output format instructions precisely: header block, title, incident overview, MITRE reference, all 6 IR phases with tool-specific steps and query blocks, minimum 3 decision points, and escalation criteria."
  );

  return lines.join("\n");
}
