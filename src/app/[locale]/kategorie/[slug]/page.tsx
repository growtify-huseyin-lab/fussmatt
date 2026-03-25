import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLocalizedProductsWithTotal, getLocalizedCategories, getLocalizedCategoryBySlug } from "@/lib/woocommerce-i18n";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { JsonLd, breadcrumbSchema, generateHreflangAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { WCProduct, WCCategory } from "@/types/woocommerce";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const page = typeof sp.seite === "string" ? parseInt(sp.seite) : 1;
  setRequestLocale(locale);

  let category: WCCategory | null = null;
  try {
    category = await getLocalizedCategoryBySlug(locale as Locale, slug);
  } catch { /* API error */ }
  if (!category) notFound();

  let products: WCProduct[] = [];
  let allCategories: WCCategory[] = [];
  let totalPages = 1;
  try {
    const [result, cats] = await Promise.all([
      getLocalizedProductsWithTotal(locale as Locale, { category: category.id, per_page: 20, page }),
      getLocalizedCategories(locale as Locale, { parent: 0 }),
    ]);
    products = result.products;
    totalPages = result.totalPages;
    allCategories = cats;
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

        {/* Product Grid */}
        <div className="mb-12">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/kategorie/${slug}`}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">Keine Produkte in dieser Kategorie.</p>
            </div>
          )}
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
