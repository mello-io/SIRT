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
  title: "S.I.R.T. - Security Incident Response Transcript",
  description:
    "SOAR for humans. Generate comprehensive, stack-specific IR checklists tailored to your exact security tools. MITRE ATT&CK referenced. Free for SOC analysts.",
  metadataBase: new URL("https://sirt-five.vercel.app"),
  icons: {
    icon: "/sirt-logo.png",
  },
  openGraph: {
    title: "S.I.R.T. - Security Incident Response Transcript",
    description:
      "Stack-specific IR checklists for SOC analysts. 22 incident types. 60+ security tools. MITRE ATT&CK referenced. No SOAR required.",
    url: "https://sirt-five.vercel.app",
    siteName: "S.I.R.T.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "S.I.R.T. - Security Incident Response Transcript",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S.I.R.T. - Security Incident Response Transcript",
    description:
      "Stack-specific IR checklists for SOC analysts. 22 incident types. 60+ tools. MITRE ATT&CK tagged. Free.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-8UEK98pEDeDxj1_PNpgGf3dNsCx6EuCwNgf086mf5E",
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
