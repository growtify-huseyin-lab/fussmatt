"use client";

import { Suspense, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";

function ConfirmationContent() {
  const t = useTranslations("orderConfirmation");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">{t("noSession")}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          {t("backToShop")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{t("thankYou")}</h1>
      <p className="mt-3 text-gray-500">{t("confirmEmail")}</p>
      <p className="mt-2 text-sm text-gray-400">{t("orderProcessing")}</p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors"
      >
        {t("backToShop")}
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
