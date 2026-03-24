import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocalizedProducts, getLocalizedCategories } from "@/lib/woocommerce-i18n";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import VehicleFilter from "@/components/product/VehicleFilter";
import type { Locale } from "@/i18n/config";
import type { VehicleBrand } from "@/lib/vehicle-data";
import type { WCProduct, WCCategory } from "@/types/woocommerce";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let products: WCProduct[] = [];
  let categories: WCCategory[] = [];
  let vehicleBrands: VehicleBrand[] = [];

  try {
    [products, categories, vehicleBrands] = await Promise.all([
      getLocalizedProducts(locale as Locale, { per_page: 8, orderby: "date" }),
      getLocalizedCategories(locale as Locale, { parent: 0 }),
      fetchVehicleHierarchy(),
    ]);
  } catch {
    // API not available yet
  }

  return <HomeContent products={products} categories={categories} vehicleBrands={vehicleBrands} />;
}

function HomeContent({
  products,
  categories,
  vehicleBrands,
}: {
  products: WCProduct[];
  categories: WCCategory[];
  vehicleBrands: VehicleBrand[];
}) {
  const t = useTranslations("home");
  const tHero = useTranslations("hero");
  const tUsp = useTranslations("usp");
  const tFilter = useTranslations("filter");

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-amber-600/20 text-amber-400 rounded-full mb-6">
                {tHero("badge")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {tHero("title1")}
                <br />
                <span className="text-amber-500">{tHero("title2")}</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {tHero("description")}
              </p>
            </div>

            {/* Right: Vehicle Filter Card */}
            <div className="w-full lg:w-auto flex-shrink-0">
              <VehicleFilter brands={vehicleBrands} variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "\uD83D\uDE97", title: tUsp("fitTitle"), desc: tUsp("fitDesc") },
              { icon: "\uD83D\uDCA7", title: tUsp("waterTitle"), desc: tUsp("waterDesc") },
              { icon: "\uD83D\uDE9A", title: tUsp("shipTitle"), desc: tUsp("shipDesc") },
              { icon: "\u21A9\uFE0F", title: tUsp("returnTitle"), desc: tUsp("returnDesc") },
            ].map((usp) => (
              <div key={usp.title} className="flex items-center gap-3">
                <span className="text-2xl">{usp.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{usp.title}</p>
                  <p className="text-xs text-gray-500">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Type Categories — MyFussmatten style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "\uD83D\uDFE7", label: tFilter("all5d"), href: "/produkte?kategorie=5d-premium-fussmatten", desc: "Premium", color: "from-amber-500 to-amber-600" },
            { icon: "\uD83D\uDFE9", label: tFilter("all3d"), href: "/produkte?kategorie=3d-fussmatten", desc: "Standard", color: "from-gray-700 to-gray-800" },
            { icon: "\uD83D\uDFE6", label: tFilter("trunk"), href: "/produkte?kategorie=kofferraummatten", desc: "Kofferraum", color: "from-slate-600 to-slate-700" },
            { icon: "\u2B50", label: tFilter("allBrands"), href: "/produkte", desc: "", color: "from-gray-900 to-gray-950" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl p-6 h-40 flex flex-col justify-end text-white"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} group-hover:scale-105 transition-transform duration-300`} />
              <div className="relative">
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <h3 className="text-lg font-bold">{cat.label}</h3>
                {cat.desc && <p className="text-sm text-white/70">{cat.desc}</p>}
              </div>
            </Link>
          ))}
        </div>

        {/* Brand chips */}
        {categories.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t("brandsTitle")}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produkte?kategorie=${cat.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-sm font-medium text-gray-700 rounded-full transition-colors"
                >
                  {cat.name} <span className="text-gray-400 text-xs">({cat.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("latestTitle")}</h2>
          <Link
            href="/produkte"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            {t("showAll")} &rarr;
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">{t("loading")}</p>
            <p className="text-sm text-gray-400 mt-2">{t("loadingSub")}</p>
          </div>
        )}
      </section>

      {/* Why FussMatt */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("whyTitle")}</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">{t("whyDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t("feature1Title"), desc: t("feature1Desc") },
              { title: t("feature2Title"), desc: t("feature2Desc") },
              { title: t("feature3Title"), desc: t("feature3Desc") },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-5">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
