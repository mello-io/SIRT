// S.I.R.T. IncidentTypeCard
// One card per incident category (7 total). Click to select.

import type { IncidentCategory } from "@/lib/constants/incident-types";

interface IncidentTypeCardProps {
  category: IncidentCategory;
  isSelected: boolean;
  onSelect: () => void;
}

export function IncidentTypeCard({
  category,
  isSelected,
  onSelect,
}: IncidentTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full text-left rounded border p-4 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green group ${
        isSelected
          ? "border-signal-green bg-signal-green/5"
          : "border-grid-line bg-deep-slate hover:border-muted-ash/60 hover:bg-iron/40"
      }`}
    >
      <div className="flex flex-col gap-2">
        <span className="text-2xl" aria-hidden="true">
          {category.icon}
        </span>
        <div>
          <p
            className={`text-sm font-mono font-semibold leading-tight transition-colors ${
              isSelected ? "text-signal-green" : "text-off-white"
            }`}
          >
            {category.name}
          </p>
          <p className="text-[10px] text-muted-ash mt-0.5 font-mono">
            {category.subTypes.length} sub-type
            {category.subTypes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </button>
  );
}
