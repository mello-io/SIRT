// S.I.R.T. File Download Utility
// Browser-side only — must not be imported in server components or API routes.

/**
 * Triggers a markdown file download in the browser.
 * @param content  Raw markdown string to write to the file.
 * @param filename Target filename (e.g. "SIRT-ransomware-2026-04-11.md").
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds the standard S.I.R.T. output filename.
 * Format: SIRT-[incident-slug]-[YYYY-MM-DD].md
 */
export function buildOutputFilename(incidentSlug: string, date?: Date): string {
  const d = date ?? new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const slug = incidentSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `SIRT-${slug}-${yyyy}-${mm}-${dd}.md`;
}
