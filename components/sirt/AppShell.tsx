// S.I.R.T. App Shell
// Top nav bar present on all screens. Server component — no client interactivity.

import Link from "next/link";
import { Settings, FileText, BookOpen } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Render the application shell with a top navigation bar and main content area.
 *
 * The component provides a consistent layout containing a banner-style navigation
 * (brand link, version badge, links to Incident and Settings) and a main region
 * that hosts the page-specific content.
 *
 * @param children - The screen-specific content to render beneath the navigation.
 * @returns The app shell element containing the top nav and the `children` content.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-void">
      {/* Top nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b border-grid-line shrink-0"
        role="banner"
      >
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="S.I.R.T. — home"
        >
          <span className="font-mono font-bold text-xl text-signal-green tracking-tight group-hover:opacity-90 transition-opacity">
            S.I.R.T.
          </span>
          <span className="text-[11px] font-mono text-muted-ash border border-grid-line rounded px-1.5 py-0.5 leading-none">
            v1.1
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/how-to"
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted-ash hover:text-off-white transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green"
            aria-label="How to use SIRT"
          >
            <BookOpen size={13} aria-hidden="true" />
            <span className="hidden sm:inline">How to use SIRT</span>
          </Link>
          <Link
            href="/incident"
            className="flex items-center gap-1.5 text-[11px] font-mono text-incident-red hover:text-incident-red/80 transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-incident-red"
            aria-label="Generate Incident File"
          >
            <FileText size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Generate Incident File</span>
          </Link>
          <Link
            href="/settings"
            className="text-muted-ash hover:text-off-white transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-green"
            aria-label="Settings"
          >
            <Settings size={18} aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 flex flex-col hero-grid">{children}</main>

      {/* Global footer */}
      <footer className="border-t border-grid-line px-6 py-4 grid grid-cols-3 items-center text-[11px] font-mono text-muted-ash shrink-0">
        <span>S.I.R.T. v1.1</span>
        <span className="text-center">© 2026 mello-io</span>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <Link href="/privacy" className="hover:text-off-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-off-white transition-colors">Terms of Service</Link>
          <a
            href="https://github.com/mello-io/SIRT/tree/main/audit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-off-white transition-colors"
          >
            Security Audit
          </a>
          <a
            href="https://github.com/mello-io/SIRT"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-off-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
