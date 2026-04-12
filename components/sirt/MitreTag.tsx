// S.I.R.T. MitreTag
// Renders ATT&CK technique links as purple inline badges with external link icon.
// Used in the markdown renderer to override links pointing to attack.mitre.org.

import { ExternalLink } from "lucide-react";

interface MitreTagProps {
  href: string;
  children: React.ReactNode;
}

export function MitreTag({ href, children }: MitreTagProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px] font-mono text-mitre-purple border border-mitre-purple/30 bg-mitre-purple/10 rounded px-1.5 py-0.5 leading-none whitespace-nowrap hover:bg-mitre-purple/20 transition-colors no-underline"
    >
      {children}
      <ExternalLink size={9} className="shrink-0" aria-hidden="true" />
    </a>
  );
}
