import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Incident File — S.I.R.T.",
};

export default function IncidentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
