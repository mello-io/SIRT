// S.I.R.T. DecisionPoint
// Amber callout block triggered when markdown paragraph starts with
// "⚠️ DECISION POINT:" — rendered by the custom markdown p override.

import { AlertTriangle } from "lucide-react";

interface DecisionPointProps {
  children: React.ReactNode;
}

export function DecisionPoint({ children }: DecisionPointProps) {
  return (
    <div className="my-4 flex gap-3 bg-threat-amber/10 border border-threat-amber/30 rounded p-4">
      <AlertTriangle
        size={15}
        className="text-threat-amber shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <p className="text-sm font-mono text-threat-amber leading-relaxed">{children}</p>
    </div>
  );
}
