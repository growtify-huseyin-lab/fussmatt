"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fussmattenOpen, setFussmattenOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const t = useTranslations("nav");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFussmattenOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-950 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="hidden sm:flex items-center gap-4">
            <a href="/kontakt" className="hover:text-white transition-colors">Kontakt</a>
            <span className="text-gray-600">|</span>
            <a href="/impressum" className="hover:text-white transition-colors">&#220;ber uns</a>
          </div>
          <div className="flex-1 text-center sm:text-right">
            <span className="text-amber-400 font-medium">Kostenloser Versand &amp; 30 Tage Geld-Zur&#252;ck-Garantie</span>
          </div>
        </div>
      </div>

      {/* Main Header: Logo + Search + Actions */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="FussMatt"
              width={220}
              height={55}
              className="h-12 lg:h-16 w-auto"
              priority
            />
          </Link>

          {/* Search Bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form action="/produkte" method="GET" className="w-full relative">
              <input
                type="text"
                name="suche"
                placeholder="Produkte suchen..."
                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />

            {/* Cart */}
            <Link
              href="/warenkorb"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("cart")}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("menu")}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar — desktop */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-0 h-12 text-sm font-semibold uppercase tracking-wide">
            {/* Fussmatten — with dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setFussmattenOpen(!fussmattenOpen)}
                className={`flex items-center gap-1 px-4 h-12 transition-colors ${fussmattenOpen ? "text-amber-600" : "text-gray-700 hover:text-amber-600"}`}
              >
                Fussmatten
                <svg className={`w-3.5 h-3.5 transition-transform ${fussmattenOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown */}
              {fussmattenOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                  <Link href="/kategorie/5d-fussmatten" className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    5D Premium Fussmatten
                  </Link>
                  <Link href="/kategorie/3d-fussmatten" className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    3D Fussmatten
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <Link href="/kategorie/passend-fuer-lkw-truck-fussmatten" className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    LKW-Truck Fussmatten
                  </Link>
                  <Link href="/kategorie/passend-fuer-kleinbus-pickup-fussmatten" className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    Kleinbus &amp; Pickup Fussmatten
                  </Link>
                  <Link href="/kategorie/universal-fussmatten" className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    Universal Fussmatten
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <Link href="/produkte" className="block px-5 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors normal-case" onClick={() => setFussmattenOpen(false)}>
                    Alle Fussmatten anzeigen &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link href="/kategorie/kofferraummatte" className="px-4 h-12 flex items-center text-gray-700 hover:text-amber-600 transition-colors">
              Kofferraummatte
            </Link>

            <Link href="/kategorie/fuss-und-kofferraummatten-set" className="px-4 h-12 flex items-center text-gray-700 hover:text-amber-600 transition-colors">
              Fuss- und Kofferraummatten Set
            </Link>

            <Link href="/ratgeber" className="px-4 h-12 flex items-center text-gray-700 hover:text-amber-600 transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-1">
            {/* Search — mobile */}
            <form action="/produkte" method="GET" className="mb-4">
              <div className="relative">
                <input type="text" name="suche" placeholder="Produkte suchen..." className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </form>

            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pt-2">Fussmatten</p>
            <Link href="/kategorie/5d-fussmatten" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>5D Premium Fussmatten</Link>
            <Link href="/kategorie/3d-fussmatten" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>3D Fussmatten</Link>
            <Link href="/kategorie/universal-fussmatten" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Universal Fussmatten</Link>

            <div className="my-2 border-t border-gray-100" />
            <Link href="/kategorie/kofferraummatte" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Kofferraummatte</Link>
            <Link href="/kategorie/fuss-und-kofferraummatten-set" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Fuss- &amp; Kofferraummatten Set</Link>

            <div className="my-2 border-t border-gray-100" />
            <Link href="/ratgeber" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/produkte" className="block px-3 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Alle Produkte &rarr;</Link>
          </div>
        </div>
      )}
    </header>
  );
}
