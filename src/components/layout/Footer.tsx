"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image src="/logo.png" alt="FussMatt" width={160} height={48} className="h-12 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t("shopTitle")}</h3>
            <ul className="space-y-3">
              <li><Link href="/produkte" className="text-sm hover:text-amber-500 transition-colors">{tNav("allProducts")}</Link></li>
              <li><Link href="/produkte?typ=3d" className="text-sm hover:text-amber-500 transition-colors">{tNav("3d")}</Link></li>
              <li><Link href="/produkte?typ=5d" className="text-sm hover:text-amber-500 transition-colors">{tNav("5d")}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t("infoTitle")}</h3>
            <ul className="space-y-3">
              <li><Link href="/versand" className="text-sm hover:text-amber-500 transition-colors">{t("shippingLink")}</Link></li>
              <li><Link href="/widerruf" className="text-sm hover:text-amber-500 transition-colors">{t("returnLink")}</Link></li>
              <li><Link href="/kontakt" className="text-sm hover:text-amber-500 transition-colors">{t("contactLink")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t("legalTitle")}</h3>
            <ul className="space-y-3">
              <li><Link href="/impressum" className="text-sm hover:text-amber-500 transition-colors">{t("imprint")}</Link></li>
              <li><Link href="/datenschutz" className="text-sm hover:text-amber-500 transition-colors">{t("privacy")}</Link></li>
              <li><Link href="/agb" className="text-sm hover:text-amber-500 transition-colors">{t("terms")}</Link></li>
              <li><Link href="/widerruf" className="text-sm hover:text-amber-500 transition-colors">{t("withdrawal")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs">{t("copyright", { year: new Date().getFullYear() })}</p>
            <button
              onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
              className="text-xs text-gray-500 hover:text-amber-500 transition-colors underline"
            >
              {t("cookieSettings")}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">{t("paymentMethods")}:</span>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span>Stripe</span>
              <span>&#183;</span>
              <span>PayPal</span>
              <span>&#183;</span>
              <span>Klarna</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
