import type { Metadata } from "next";
import { getProducts } from "@/lib/woocommerce";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import type { WCProduct } from "@/types/woocommerce";

interface ModelPageProps {
  params: Promise<{ locale: string; brand: string; model: string }>;
}

// Skip static generation for model pages — too many combinations.
// These are generated on-demand via ISR instead.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { brand, model } = await params;
  const brands = await fetchVehicleHierarchy();
  const brandData = brands.find((b) => b.slug === brand);
  const modelData = brandData?.models.find((m) => m.slug === model);
  if (!brandData || !modelData) return { title: "Modell nicht gefunden" };

  const title = `${brandData.name} ${modelData.name} Fussmatten${modelData.years ? ` ${modelData.years}` : ""}`;
  const description = `Premium 3D & 5D Fussmatten f\u00fcr ${brandData.name} ${modelData.name}${modelData.years ? ` (${modelData.years})` : ""}. Passgenau aus TPE.`;

  return {
    title,
    description,
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { locale, brand, model } = await params;

  const brands = await fetchVehicleHierarchy();
  const brandData = brands.find((b) => b.slug === brand);
  const modelData = brandData?.models.find((m) => m.slug === model);
  if (!brandData || !modelData) notFound();

  let products: WCProduct[] = [];
  try {
    products = await getProducts({
      search: modelData.fullName || `${brandData.name} ${modelData.name}`,
      per_page: 50,
    });
  } catch { /* */ }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: brandData.name, url: `/marke/${brand}` },
        { name: modelData.name, url: `/marke/${brand}/${model}` },
      ], )} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 mb-8 text-white">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <span>/</span>
            <Link href={`/marke/${brand}`} className="hover:text-amber-400">{brandData.name}</Link>
            <span>/</span>
            <span className="text-amber-400">{modelData.name}</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold">
            {brandData.name} {modelData.name}{" "}
            <span className="text-amber-500">Fussmatten</span>
          </h1>
          {modelData.years && (
            <p className="mt-2 text-lg text-gray-300">Baujahr {modelData.years}</p>
          )}
          <p className="mt-3 text-gray-400 max-w-2xl">
            Passgenaue 3D &amp; 5D Fussmatten aus TPE-Material f&#252;r Ihren {brandData.name} {modelData.name}.
            Wasserdicht, rutschfest und millimetergenau gefertigt.
          </p>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl mb-12">
            <p className="text-gray-500">Keine Produkte f&#252;r dieses Modell gefunden.</p>
            <Link href={`/marke/${brand}`} className="mt-4 inline-block text-sm font-medium text-amber-600">
              Alle {brandData.name} Modelle anzeigen &rarr;
            </Link>
          </div>
        )}

        {/* Other Models */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Weitere {brandData.name} Modelle</h2>
          <div className="flex flex-wrap gap-2">
            {brandData.models
              .filter((m) => m.slug !== model)
              .map((m) => (
                <Link
                  key={m.slug}
                  href={`/marke/${brand}/${m.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-sm font-medium text-gray-700 rounded-full transition-colors"
                >
                  {m.name} {m.years && <span className="text-gray-400">({m.years})</span>}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
