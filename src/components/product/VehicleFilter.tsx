"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { VehicleBrand } from "@/lib/vehicle-data";

interface VehicleFilterProps {
  brands: VehicleBrand[];
  variant?: "hero" | "sidebar";
  selectedBrand?: string;
  selectedModel?: string;
  /** When set, search stays within this category */
  categorySlug?: string;
}

export default function VehicleFilter({
  brands,
  variant = "hero",
  selectedBrand,
  selectedModel,
  categorySlug,
}: VehicleFilterProps) {
  const t = useTranslations("filter");
  const router = useRouter();
  const [brand, setBrand] = useState(selectedBrand || "");
  const [model, setModel] = useState(selectedModel || "");

  const currentBrand = useMemo(
    () => brands.find((b) => b.slug === brand || b.name === brand),
    [brands, brand]
  );

  const models = currentBrand?.models || [];

  const handleSearch = () => {
    if (!brand) return;
    const selectedFullModel = models.find(
      (m) => m.slug === model || m.fullName === model
    );
    const query = selectedFullModel
      ? selectedFullModel.fullName
      : currentBrand?.name || "";
    // Stay within category context if on a category page
    const basePath = categorySlug
      ? `/kategorie/${categorySlug}`
      : "/produkte";
    router.push(`${basePath}?suche=${encodeURIComponent(query)}`);
  };

  // ─── Hero variant: MyFussmatten style white card ──────
  if (variant === "hero") {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md mx-auto lg:mx-0 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
          {t("title")}
        </h2>

        <div className="space-y-4">
          {/* Brand */}
          <div className="relative">
            <select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setModel(""); }}
              className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none appearance-none cursor-pointer transition-colors"
            >
              <option value="">{t("selectBrand")}</option>
              {brands.map((b, i) => (
                <option key={`${b.slug}-${i}`} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Model */}
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!brand || models.length === 0}
              className={`w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base text-gray-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none appearance-none cursor-pointer transition-colors ${!brand ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <option value="">{t("selectModel")}</option>
              {models.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {currentBrand?.name} {m.name}
                </option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Search button — pill shape like MyFussmatten */}
        <button
          onClick={handleSearch}
          disabled={!brand}
          className="mt-8 px-12 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base uppercase tracking-wider rounded-full transition-colors shadow-lg shadow-amber-500/25"
        >
          {t("search")}
        </button>
      </div>
    );
  }

  // ─── Sidebar variant ──────────────────────────────────
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
        {t("vehicleFilter")}
      </h3>
      <div className="space-y-3">
        <div className="relative">
          <select
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setModel(""); }}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none cursor-pointer"
          >
            <option value="">{t("selectBrand")}</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand || models.length === 0}
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none cursor-pointer ${!brand ? "opacity-50" : ""}`}
          >
            <option value="">{t("selectModel")}</option>
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {currentBrand?.name} {m.name}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <button
          onClick={handleSearch}
          disabled={!brand}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-colors"
        >
          {t("search")}
        </button>
      </div>
    </div>
  );
}
