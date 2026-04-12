// S.I.R.T. ToolQueryBlock
// Monospace fenced code block with tool name as a header badge.
// Rendered by the custom markdown `pre` override in the output view.
// The `lang` prop is the fenced code language label (e.g. "splunk", "kql", "yara").

interface ToolQueryBlockProps {
  lang: string;
  children: React.ReactNode;
}

export function ToolQueryBlock({ lang, children }: ToolQueryBlockProps) {
  return (
    <div className="my-4 rounded border border-grid-line overflow-hidden">
      {lang && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-iron border-b border-grid-line">
          <span className="text-[10px] font-mono text-muted-ash uppercase tracking-wider">
            {lang}
          </span>
        </div>
      )}
      <pre className="bg-iron/50 px-4 py-3 overflow-x-auto m-0">
        <code className="font-mono text-[13px] text-off-white leading-relaxed whitespace-pre">
          {children}
        </code>
      </pre>
    </div>
  );
}
