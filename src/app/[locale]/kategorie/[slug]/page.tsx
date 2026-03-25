import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLocalizedProducts, getLocalizedCategories, getLocalizedCategoryBySlug } from "@/lib/woocommerce-i18n";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import VehicleFilter from "@/components/product/VehicleFilter";
import { JsonLd, breadcrumbSchema, generateHreflangAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { WCProduct, WCCategory } from "@/types/woocommerce";
import type { VehicleBrand } from "@/lib/vehicle-data";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// SEO descriptions per category
const CATEGORY_SEO: Record<string, { titleSuffix: string; description: string }> = {
  "5d-fussmatten": {
    titleSuffix: "5D Premium Auto-Fussmatten aus TPE",
    description: "Entdecken Sie unsere 5D Premium Fussmatten mit erh\u00f6hten R\u00e4ndern f\u00fcr maximalen Schutz. Aus hochwertigem TPE-Material, passgenau f\u00fcr Ihr Fahrzeug.",
  },
  "3d-fussmatten": {
    titleSuffix: "3D Auto-Fussmatten aus TPE",
    description: "3D Auto-Fussmatten mit pr\u00e4ziser Passform. TPE-Material, wasserdicht und langlebig. F\u00fcr alle g\u00e4ngigen Fahrzeugmodelle verf\u00fcgbar.",
  },
  "kofferraummatte": {
    titleSuffix: "Kofferraummatten aus TPE",
    description: "Passgenaue Kofferraummatten aus TPE-Material. Sch\u00fctzen Sie Ihren Kofferraum zuverl\u00e4ssig vor Schmutz, Feuchtigkeit und Kratzern.",
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getLocalizedCategoryBySlug(locale as Locale, slug);
  if (!category) return { title: "Kategorie nicht gefunden" };

  const seo = CATEGORY_SEO[slug] || { titleSuffix: category.name, description: `${category.name} bei FussMatt. Premium Qualit\u00e4t, passgenau, TPE-Material.` };

  return {
    title: seo.titleSuffix,
    description: seo.description,
    alternates: { languages: generateHreflangAlternates(`/kategorie/${slug}`) },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getLocalizedCategoryBySlug(locale as Locale, slug);
  if (!category) notFound();

  let products: WCProduct[] = [];
  let allCategories: WCCategory[] = [];
  let vehicleBrands: VehicleBrand[] = [];
  try {
    [products, allCategories, vehicleBrands] = await Promise.all([
      getLocalizedProducts(locale as Locale, { category: category.id, per_page: 50 }),
      getLocalizedCategories(locale as Locale, { parent: 0 }),
      fetchVehicleHierarchy(),
    ]);
  } catch { /* */ }

  const seo = CATEGORY_SEO[slug];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: category.name, url: `/kategorie/${slug}` },
      ], locale as Locale)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 mb-8 text-white">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <span>/</span>
            <span className="text-amber-400">{category.name}</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold">
            {category.name}
          </h1>
          {seo && (
            <p className="mt-3 text-gray-300 max-w-2xl">{seo.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-400">{category.count} Produkte</p>
        </div>

        {/* Filter + Products */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Sidebar Filter */}
          {vehicleBrands.length > 0 && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <VehicleFilter brands={vehicleBrands} variant="sidebar" />
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-gray-500">Keine Produkte in dieser Kategorie.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Weitere Kategorien</h2>
          <div className="flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/kategorie/${c.slug}`}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-sm font-medium text-gray-700 rounded-full transition-colors"
                >
                  {c.name} <span className="text-gray-400">({c.count})</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
