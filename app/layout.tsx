import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteContent } from "@/lib/content";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { ClientErrorMonitor } from "@/components/client-error-monitor";
import { StickyContactCta } from "@/components/sticky-contact-cta";
import { getCurrentLanguage } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.person.website),
  title: {
    default: `${siteContent.person.name} | ${siteContent.person.role}`,
    template: `%s | ${siteContent.person.name}`,
  },
  description: siteContent.hero.proofLine,
  applicationName: `${siteContent.person.name} Portfolio`,
  openGraph: {
    title: `${siteContent.person.name} | ${siteContent.person.role}`,
    description: siteContent.hero.proofLine,
    url: siteContent.person.website,
    siteName: siteContent.person.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/first.png",
        width: 1200,
        height: 630,
        alt: `${siteContent.person.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.person.name} | ${siteContent.person.role}`,
    description: siteContent.hero.proofLine,
    images: ["/images/first.png"],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/first.png?v=2", type: "image/png" },
    ],
    apple: [{ url: "/images/first.png?v=2", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getCurrentLanguage();
  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <StickyContactCta />
        <ClientErrorMonitor />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
