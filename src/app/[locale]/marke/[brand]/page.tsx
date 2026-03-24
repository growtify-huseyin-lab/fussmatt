import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getLocalizedProducts, getLocalizedCategories } from "@/lib/woocommerce-i18n";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import VehicleFilter from "@/components/product/VehicleFilter";
import { JsonLd, breadcrumbSchema, generateHreflangAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { WCProduct } from "@/types/woocommerce";

interface BrandPageProps {
  params: Promise<{ locale: string; brand: string }>;
}

export async function generateStaticParams() {
  try {
    const brands = await fetchVehicleHierarchy();
    const params = [];
    for (const locale of locales) {
      for (const brand of brands) {
        params.push({ locale, brand: brand.slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const brands = await fetchVehicleHierarchy();
  const brandData = brands.find((b) => b.slug === brand);
  if (!brandData) return { title: "Marke nicht gefunden" };

  const title = `${brandData.name} Fussmatten | 3D & 5D Premium Auto-Matten`;
  const description = `Premium 3D & 5D Auto-Fussmatten f\u00fcr ${brandData.name}. Passgenau aus TPE-Material. ${brandData.models.length} Modelle verf\u00fcgbar.`;

  return {
    title,
    description,
    alternates: { languages: generateHreflangAlternates(`/marke/${brand}`) },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, brand } = await params;
  setRequestLocale(locale);

  const brands = await fetchVehicleHierarchy();
  const brandData = brands.find((b) => b.slug === brand);
  if (!brandData) notFound();

  let products: WCProduct[] = [];
  try {
    products = await getLocalizedProducts(locale as Locale, {
      search: brandData.name,
      per_page: 50,
    });
  } catch { /* */ }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: "Marken", url: "/produkte" },
        { name: brandData.name, url: `/marke/${brand}` },
      ], locale as Locale)} />

      <BrandContent
        brandData={brandData}
        products={products}
        allBrands={brands}
        brand={brand}
      />
    </>
  );
}

function BrandContent({
  brandData,
  products,
  allBrands,
  brand,
}: {
  brandData: { name: string; slug: string; models: { name: string; slug: string; years: string; fullName: string }[] };
  products: WCProduct[];
  allBrands: { name: string; slug: string; models: { name: string; slug: string; years: string }[] }[];
  brand: string;
}) {
  const t = useTranslations("products");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 mb-8 text-white">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <span className="text-amber-400">{brandData.name}</span>
        </nav>
        <h1 className="text-3xl lg:text-4xl font-bold">
          {brandData.name} <span className="text-amber-500">Fussmatten</span>
        </h1>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Premium 3D &amp; 5D Auto-Fussmatten aus TPE-Material f&#252;r {brandData.name} Fahrzeuge.
          Millimetergenau gefertigt f&#252;r perfekte Passform. {brandData.models.length} Modelle verf&#252;gbar.
        </p>
      </div>

      {/* Models Grid */}
      {brandData.models.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {brandData.name} Modelle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {brandData.models.map((model) => (
              <Link
                key={model.slug}
                href={`/marke/${brand}/${model.slug}`}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-amber-50 rounded-xl transition-colors group"
              >
                <span className="text-xl">{"\uD83D\uDE97"}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-amber-700 truncate">
                    {model.name}
                  </p>
                  {model.years && (
                    <p className="text-xs text-gray-500">{model.years}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {brandData.name} Fussmatten ({products.length})
          </h2>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">{t("noProducts")}</p>
          </div>
        )}
      </div>

      {/* Other Brands */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Weitere Marken</h2>
        <div className="flex flex-wrap gap-2">
          {allBrands
            .filter((b) => b.slug !== brand)
            .slice(0, 20)
            .map((b) => (
              <Link
                key={b.slug}
                href={`/marke/${b.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-sm font-medium text-gray-700 rounded-full transition-colors"
              >
                {b.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
