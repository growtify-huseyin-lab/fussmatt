"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const COOKIE_KEY = "fussmatt-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookie");

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay to avoid CLS
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: false, timestamp: Date.now() }));
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false, timestamp: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-950 text-white rounded-2xl shadow-2xl p-6 sm:flex sm:items-center sm:gap-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <p className="text-sm leading-relaxed text-gray-300">
            {t("message")}
          </p>
          <a href="/datenschutz" className="text-xs text-amber-500 hover:text-amber-400 mt-1 inline-block">
            {t("learnMore")}
          </a>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors"
          >
            {t("reject")}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
