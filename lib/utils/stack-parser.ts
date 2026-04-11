// S.I.R.T. Stack Parser
// Parses an org-sec-stack.md file into a typed OrgStack object.
// See TECH_STACK.md Section 7 for the canonical org-sec-stack.md format.

export interface StackTool {
  name: string;
  docSource: "public" | "custom" | "none";
  customDocName?: string;
}

export interface OrgStack {
  orgName: string;
  generatedDate: string;
  version: string;
  tools: Record<string, StackTool[]>;
}

export function parseOrgStack(content: string): OrgStack {
  const lines = content.split("\n");

  const stack: OrgStack = {
    orgName: "Unknown Organisation",
    generatedDate: "",
    version: "v1.0",
    tools: {},
  };

  let currentCategory = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Header metadata lines (blockquote format)
    const orgMatch = line.match(/^>\s*Organisation:\s*(.+)/);
    if (orgMatch) {
      stack.orgName = orgMatch[1].trim();
      continue;
    }

    const dateMatch = line.match(/^>\s*Generated:\s*(.+)/);
    if (dateMatch) {
      stack.generatedDate = dateMatch[1].trim();
      continue;
    }

    const versionMatch = line.match(/^>\s*S\.I\.R\.T\.\s*Version:\s*(.+)/);
    if (versionMatch) {
      stack.version = versionMatch[1].trim();
      continue;
    }

    // Category heading (## Category Name)
    const categoryMatch = line.match(/^##\s+(.+)/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      if (!stack.tools[currentCategory]) {
        stack.tools[currentCategory] = [];
      }
      continue;
    }

    // Tool entry (- Tool Name (doc source info))
    if (line.startsWith("- ") && currentCategory) {
      const toolLine = line.slice(2).trim();

      // Match: "Tool Name (Public docs)" or "Tool Name (Custom docs: filename)"
      const toolMatch = toolLine.match(/^(.+?)\s+\((.+)\)\s*$/);
      if (toolMatch) {
        const name = toolMatch[1].trim();
        const docInfo = toolMatch[2].trim();

        let docSource: "public" | "custom" | "none" = "none";
        let customDocName: string | undefined;

        if (docInfo.toLowerCase() === "public docs") {
          docSource = "public";
        } else if (docInfo.toLowerCase().startsWith("custom docs:")) {
          docSource = "custom";
          customDocName = docInfo.replace(/^custom docs:\s*/i, "").trim();
        }

        stack.tools[currentCategory].push({ name, docSource, customDocName });
      } else {
        // Tool with no doc info in parens — treat as no docs
        stack.tools[currentCategory].push({
          name: toolLine,
          docSource: "none",
        });
      }
    }
  }

  return stack;
}

// Returns a flat list of all tools across all categories
export function flattenStack(stack: OrgStack): StackTool[] {
  return Object.values(stack.tools).flat();
}

// Returns total tool count
export function stackToolCount(stack: OrgStack): number {
  return flattenStack(stack).length;
}
