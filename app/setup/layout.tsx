import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up Your Org Stack — S.I.R.T.",
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
