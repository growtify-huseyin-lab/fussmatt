import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { JsonLd, organizationSchema, webSiteSchema } from "@/lib/seo";
import { GTM_ID, getConsentModeDefaultScript, getGTMScript } from "@/lib/gtm";
import CookieConsent from "@/components/ui/CookieConsent";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FussMatt | Premium Auto-Fussmatten",
    template: "%s | FussMatt",
  },
  description:
    "Premium 3D & 5D Auto-Fussmatten aus TPE-Material. Passgenau f\u00fcr Ihr Fahrzeug.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fussmatt.com"),
  openGraph: {
    type: "website",
    siteName: "FussMatt",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fussmatt",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} antialiased`}>
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        {/* Consent Mode v2 defaults — MUST load before GTM */}
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getConsentModeDefaultScript() }}
        />
        {/* GTM container — loads only when GTM_ID is configured */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: getGTMScript(GTM_ID) }}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-[family-name:var(--font-geist-sans)]">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
