import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { JsonLd, organizationSchema, webSiteSchema } from "@/lib/seo";
import { GA_ID, getConsentModeDefaultScript, getGTMScript } from "@/lib/gtm";
import CookieConsent from "@/components/ui/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GTM_ID = "GTM-NPKV5XCD";

export const metadata: Metadata = {
  title: {
    default: "FussMatt | Premium Auto-Fussmatten",
    template: "%s | FussMatt",
  },
  description:
    "Premium 3D & 5D Auto-Fussmatten aus TPE-Material. Passgenau f\u00fcr Ihr Fahrzeug.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fussmatt.com"),
  verification: {
    google: "bHPKZZdbQVW6fcxGn29heI5zJgc2K55lyjvo6Vbi4zA",
  },
  openGraph: {
    type: "website",
    siteName: "FussMatt",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fussmatt",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${geistSans.variable} antialiased`}>
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        {/* 1. Consent Mode v2 defaults — MUST load before any Google tag */}
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getConsentModeDefaultScript() }}
        />
        {/* 2. GA4 gtag.js loader */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        {/* 3. GTM container */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: getGTMScript(GTM_ID) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-[family-name:var(--font-geist-sans)]">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
