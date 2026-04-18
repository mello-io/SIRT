import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
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

/**
 * Root layout component that sets global HTML attributes and renders the application content.
 *
 * Applies the `dark` theme and font CSS variables to the `<html>` element, renders `children` inside
 * the `<body>`, and mounts analytics integrations.
 *
 * @param children - The page content to render within the root layout's `<body>`.
 * @returns The root HTML structure for the application, including analytics components.
 */
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
