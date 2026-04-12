// S.I.R.T. DocStatusBadge
// Three states: public docs mapped / custom docs loaded / no docs available

interface DocStatusBadgeProps {
  docSource: "public" | "custom" | "none";
  fileName?: string;
}

export function DocStatusBadge({ docSource, fileName }: DocStatusBadgeProps) {
  if (docSource === "public") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-intel-blue border border-intel-blue/30 bg-intel-blue/10 rounded px-2 py-0.5 whitespace-nowrap">
        📄 Public docs mapped
      </span>
    );
  }

  if (docSource === "custom") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-mono text-signal-green border border-signal-green/30 bg-signal-green/10 rounded px-2 py-0.5 whitespace-nowrap max-w-[200px] truncate"
        title={fileName ? `Custom docs: ${fileName}` : "Custom docs loaded"}
      >
        📁 {fileName ? `${fileName}` : "Custom docs loaded"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-ash border border-grid-line rounded px-2 py-0.5 whitespace-nowrap">
      ⚠️ No docs available
    </span>
  );
}
