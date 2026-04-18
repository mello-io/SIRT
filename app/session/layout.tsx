import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Incident Session — S.I.R.T.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
