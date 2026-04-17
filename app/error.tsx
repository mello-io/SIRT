"use client";

// Global error boundary — catches unhandled errors in the Next.js App Router.

import { useEffect } from "react";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[SIRT] unhandled error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-5 max-w-sm">
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-ash uppercase tracking-widest">
              Error
            </p>
            <p className="font-mono font-semibold text-off-white">
              Something went wrong.
            </p>
            <p className="text-xs text-muted-ash leading-relaxed">
              No data was transmitted. Your API key and session data remain
              untouched.
            </p>
          </div>

          {error.digest && (
            <p className="text-[10px] font-mono text-muted-ash/50">
              ref: {error.digest}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm h-9 px-5"
            >
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="border-grid-line text-muted-ash hover:text-off-white font-mono text-sm h-9 px-5"
            >
              Return home
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
