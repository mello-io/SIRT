// Custom 404 page

import Link from "next/link";
import { AppShell } from "@/components/sirt/AppShell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-5 max-w-sm">
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-ash uppercase tracking-widest">
              404
            </p>
            <p className="font-mono font-semibold text-off-white">
              Page not found.
            </p>
            <p className="text-xs text-muted-ash leading-relaxed">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <Link href="/">
            <Button className="bg-signal-green text-void hover:bg-signal-green/90 font-mono font-semibold text-sm h-9 px-5">
              Return home
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
