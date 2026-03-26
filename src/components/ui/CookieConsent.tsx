"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateConsentMode } from "@/lib/gtm";

const COOKIE_KEY = "fussmatt-consent";

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getConsentState(): ConsentState | null {
  return getConsent();
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
      updateConsentMode(consent.analytics, consent.marketing);
    }
  }, []);

  // Allow reopening from footer button
  useEffect(() => {
    const handler = () => {
      const consent = getConsent();
      if (consent) {
        setAnalytics(consent.analytics);
        setMarketing(consent.marketing);
      }
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  const saveConsent = (consent: ConsentState) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    updateConsentMode(consent.analytics, consent.marketing);
    setVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, timestamp: Date.now() });
  };

  const handleRejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false, timestamp: Date.now() });
  };

  const handleSaveSettings = () => {
    saveConsent({ essential: true, analytics, marketing, timestamp: Date.now() });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-950 text-white rounded-2xl shadow-2xl p-6">
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-gray-300">
            {"Wir verwenden Cookies, um Ihnen das beste Einkaufserlebnis zu bieten. Sie können Ihre Einstellungen jederzeit anpassen."}
          </p>
          <Link href="/datenschutz" className="text-xs text-amber-500 hover:text-amber-400 mt-1 inline-block">
            {"Datenschutzerklärung"}
          </Link>
        </div>

        {showSettings && (
          <div className="mb-4 space-y-3 border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{"Notwendig"}</p>
                <p className="text-xs text-gray-400">{"Erforderlich für die Grundfunktionen des Shops."}</p>
              </div>
              <div className="bg-amber-600 text-xs font-medium px-3 py-1 rounded-full">{"Immer aktiv"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{"Statistiken"}</p>
                <p className="text-xs text-gray-400">{"Helfen uns, die Nutzung der Website zu verstehen."}</p>
              </div>
              <button
                onClick={() => setAnalytics(!analytics)}
                className={`relative w-11 h-6 rounded-full transition-colors ${analytics ? "bg-amber-600" : "bg-gray-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${analytics ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{"Marketing"}</p>
                <p className="text-xs text-gray-400">{"Werden für personalisierte Werbung verwendet."}</p>
              </div>
              <button
                onClick={() => setMarketing(!marketing)}
                className={`relative w-11 h-6 rounded-full transition-colors ${marketing ? "bg-amber-600" : "bg-gray-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${marketing ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {!showSettings ? (
            <>
              <button
                onClick={() => setShowSettings(true)}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors"
              >
                {"Einstellungen"}
              </button>
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors"
              >
                {"Nur notwendige"}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors"
              >
                {"Alle akzeptieren"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSettings(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors"
              >
                {"Zurück"}
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors"
              >
                {"Auswahl speichern"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
