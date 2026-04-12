"use client";

// S.I.R.T. CategorySection
// Accordion section per tool category. Starts open, collapses on header click.

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ToolCard } from "@/components/sirt/ToolCard";
import type { Tool, ToolCategory } from "@/lib/constants/tool-library";

interface CategorySectionProps {
  category: ToolCategory;
  tools: Tool[];
  selectedToolIds: Set<string>;
  onToggle: (id: string) => void;
}

export function CategorySection({
  category,
  tools,
  selectedToolIds,
  onToggle,
}: CategorySectionProps) {
  const [open, setOpen] = useState(true);

  const selectedCount = tools.filter((t) => selectedToolIds.has(t.id)).length;

  return (
    <div className="border border-grid-line rounded overflow-hidden">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-deep-slate hover:bg-iron/60 transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-signal-green"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-semibold text-off-white">
            {category}
          </span>
          <span className="text-[10px] font-mono text-muted-ash">
            {tools.length} tool{tools.length !== 1 ? "s" : ""}
          </span>
          {selectedCount > 0 && (
            <span className="text-[10px] font-mono text-signal-green border border-signal-green/40 rounded px-1.5 py-0.5 leading-none">
              {selectedCount} selected
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={14} className="text-muted-ash shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-muted-ash shrink-0" />
        )}
      </button>

      {/* Tool grid */}
      {open && (
        <div className="bg-void/40 px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSelected={selectedToolIds.has(tool.id)}
              onToggle={() => onToggle(tool.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
