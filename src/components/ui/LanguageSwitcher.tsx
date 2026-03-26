"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  // v1: Single locale (DE only) — hide switcher
  if (locales.length <= 1) return null;

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSwitch = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-sm"
        aria-label="Language"
      >
        <span className="text-base">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-xs font-medium text-gray-600 uppercase">{locale}</span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleSwitch(l)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                l === locale
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
              {l === locale && (
                <svg className="w-4 h-4 ml-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
