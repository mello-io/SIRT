import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "S.I.R.T. — Security Incident Response Transcript",
  description:
    "SOAR for humans. Comprehensive IR checklists, tailored to your exact security stack.",
  icons: {
    icon: "/sirt-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        {children}
        <footer className="border-t border-[#243040] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#6B7A8D]">
          <span>S.I.R.T. v1.1</span>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy" className="hover:text-[#E8EDF2] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#E8EDF2] transition-colors">Terms of Service</Link>
            <a
              href="https://github.com/mello-io/SIRT/tree/main/audit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8EDF2] transition-colors"
            >
              Security Audit
            </a>
            <a
              href="https://github.com/mello-io/SIRT"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8EDF2] transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
