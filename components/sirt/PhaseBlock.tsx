// S.I.R.T. PhaseBlock
// Collapsible section per IR phase in the output view.
// Wraps each H2 section (MITRE reference, 6 IR phases, escalation criteria).
// Used in /app/output/page.tsx — content is pre-split by H2 before rendering.

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface PhaseBlockProps {
  heading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function PhaseBlock({
  heading,
  children,
  defaultOpen = true,
}: PhaseBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-2.5 border-b border-grid-line text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green rounded-sm"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown
            size={13}
            className="text-signal-green shrink-0"
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            size={13}
            className="text-muted-ash group-hover:text-signal-green shrink-0 transition-colors"
            aria-hidden="true"
          />
        )}
        <span className="text-sm font-mono font-semibold text-off-white group-hover:text-signal-green/90 transition-colors">
          {heading}
        </span>
      </button>

      {open && <div className="pt-4">{children}</div>}
    </div>
  );
}
