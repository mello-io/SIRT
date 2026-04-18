import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Incident Session — S.I.R.T.",
};

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
