// S.I.R.T. ToolCard
// Selectable card for a security tool. Signal Green border when active.

import { Check } from "lucide-react";
import type { Tool } from "@/lib/constants/tool-library";

interface ToolCardProps {
  tool: Pick<Tool, "id" | "name" | "publisher" | "category">;
  isSelected: boolean;
  onToggle: () => void;
}

export function ToolCard({ tool, isSelected, onToggle }: ToolCardProps) {
  // Letter avatar from publisher initials
  const initials = tool.publisher
    .split(/[\s/]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={`w-full text-left rounded border p-3 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green group ${
        isSelected
          ? "border-signal-green bg-signal-green/5"
          : "border-grid-line bg-deep-slate hover:border-muted-ash/60 hover:bg-iron/40"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Letter avatar */}
        <div
          className={`w-7 h-7 rounded flex items-center justify-center shrink-0 text-[10px] font-mono font-bold transition-colors ${
            isSelected
              ? "bg-signal-green text-void"
              : "bg-iron text-muted-ash group-hover:text-off-white"
          }`}
          aria-hidden="true"
        >
          {initials || "?"}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-mono font-semibold leading-tight truncate transition-colors ${
              isSelected ? "text-off-white" : "text-off-white/80 group-hover:text-off-white"
            }`}
          >
            {tool.name}
          </p>
          <p className="text-[10px] text-muted-ash truncate mt-0.5 leading-tight">
            {tool.publisher}
          </p>
        </div>

        {/* Selected check */}
        {isSelected && (
          <Check
            size={12}
            className="text-signal-green shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
}
