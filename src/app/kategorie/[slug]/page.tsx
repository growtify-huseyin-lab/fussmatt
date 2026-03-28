export const revalidate = 300; // ISR: rebuild every 5 min

import type { Metadata } from "next";
import { getProductsWithTotal, getCategories, getCategoryBySlug } from "@/lib/woocommerce";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import VehicleFilter from "@/components/product/VehicleFilter";
import Pagination from "@/components/ui/Pagination";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import type { WCProduct, WCCategory } from "@/types/woocommerce";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategorie nicht gefunden" };

  const seo = CATEGORY_SEO[slug] || { titleSuffix: category.name, description: `${category.name} bei FussMatt. Premium Qualit\u00e4t, passgenau, TPE-Material.` };

  return {
    title: seo.titleSuffix,
    description: seo.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = typeof sp.seite === "string" ? parseInt(sp.seite) : 1;
  const search = typeof sp.suche === "string" ? sp.suche : undefined;

  let category: WCCategory | null = null;
  try {
    category = await getCategoryBySlug(slug);
  } catch { /* API error */ }
  if (!category) notFound();

  let products: WCProduct[] = [];
  let allCategories: WCCategory[] = [];
  let totalPages = 1;
  let vehicleBrands: import("@/lib/vehicle-data").VehicleBrand[] = [];
  try {
    const productParams: Record<string, string | number> = { category: category.id, per_page: 20, page };
    if (search) productParams.search = search;

    const [result, cats] = await Promise.all([
      getProductsWithTotal(productParams),
      getCategories({ parent: 0 }),
    ]);
    products = result.products;
    totalPages = result.totalPages;
    allCategories = cats;
  } catch { /* */ }
  try {
    vehicleBrands = await fetchVehicleHierarchy();
  } catch { /* */ }

  const seo = CATEGORY_SEO[slug];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: category.name, url: `/kategorie/${slug}` },
      ], )} />

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
          {/* Sidebar */}
          {vehicleBrands.length > 0 && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <VehicleFilter brands={vehicleBrands} variant="sidebar" categorySlug={slug} />
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
          {search && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Suche: &ldquo;{search}&rdquo;</span>
              <a href={`/kategorie/${slug}`} className="text-xs text-amber-600 hover:underline">Filter entfernen</a>
            </div>
          )}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>

        {/* Other Categories */}
        <div className="mt-12 pt-10 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weitere Kategorien</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {allCategories
              .filter((c) => c.slug !== slug)
              .map((c) => {
                const icons: Record<string, string> = {
                  "5d-fussmatten": "\u2B50",
                  "3d-fussmatten": "\uD83D\uDFE9",
                  "kofferraummatte": "\uD83D\uDE97",
                  "fuss-und-kofferraummatten-set": "\uD83D\uDCE6",
                  "passend-fuer-lkw-truck-fussmatten": "\uD83D\uDE9A",
                  "passend-fuer-kleinbus-pickup-fussmatten": "\uD83D\uDE90",
                  "universal-fussmatten": "\u2699\uFE0F",
                };
                return (
                  <Link
                    key={c.id}
                    href={`/kategorie/${c.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md p-4 flex flex-col items-center text-center gap-2 transition-all"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{icons[c.slug] || "\uD83D\uDCCC"}</span>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700 transition-colors leading-tight">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{c.count} Produkte</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
