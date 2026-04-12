// S.I.R.T. SubTypeSelector
// Rendered after an incident category is selected.
// Shows all sub-types with MITRE tags inline.

import type { IncidentCategory } from "@/lib/constants/incident-types";

interface SubTypeSelectorProps {
  category: IncidentCategory;
  selectedSubTypeId: string | null;
  onSelect: (subTypeId: string) => void;
}

export function SubTypeSelector({
  category,
  selectedSubTypeId,
  onSelect,
}: SubTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-ash mb-3">
        {category.icon} {category.name} — select a sub-type:
      </p>
      {category.subTypes.map((subType) => {
        const isSelected = selectedSubTypeId === subType.id;
        return (
          <button
            key={subType.id}
            type="button"
            onClick={() => onSelect(subType.id)}
            aria-pressed={isSelected}
            className={`w-full text-left rounded border px-4 py-3 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green group ${
              isSelected
                ? "border-signal-green bg-signal-green/5"
                : "border-grid-line bg-deep-slate hover:border-muted-ash/60 hover:bg-iron/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-muted-ash">
                    {subType.id}
                  </span>
                  <p
                    className={`text-sm font-mono font-semibold leading-tight transition-colors ${
                      isSelected ? "text-signal-green" : "text-off-white"
                    }`}
                  >
                    {subType.name}
                  </p>
                </div>
                <p className="text-xs text-muted-ash leading-relaxed line-clamp-2">
                  {subType.description}
                </p>
              </div>
              {/* MITRE tags */}
              <div className="flex flex-wrap gap-1 shrink-0 justify-end">
                {subType.mitreTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-mitre-purple border border-mitre-purple/30 bg-mitre-purple/10 rounded px-1.5 py-0.5 leading-none whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
