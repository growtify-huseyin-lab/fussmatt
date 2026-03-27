import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";
import { fetchVehicleHierarchy } from "@/lib/vehicle-data";
import ProductCard from "@/components/product/ProductCard";
import VehicleFilter from "@/components/product/VehicleFilter";
import type { VehicleBrand } from "@/lib/vehicle-data";
import type { WCProduct } from "@/types/woocommerce";

// ISR: rebuild at most every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
  title: "FussMatt | Premium 3D & 5D Auto-Fussmatten",
  description: "Massgeschneiderte Premium Auto-Fussmatten aus TPE-Material. 3D & 5D Modelle f\u00fcr alle Fahrzeugmarken. Kostenloser Versand in CH, DE, AT, FR, IT, NL.",
  openGraph: {
    title: "FussMatt | Premium 3D & 5D Auto-Fussmatten",
    description: "Premium Auto-Fussmatten aus TPE-Material. Kostenloser Versand.",
  },
};

export default async function HomePage() {
  let products: WCProduct[] = [];
  let vehicleBrands: VehicleBrand[] = [];

  try {
    [products, vehicleBrands] = await Promise.all([
      getProducts({ per_page: 8, orderby: "date" }),
      fetchVehicleHierarchy(),
    ]);
  } catch {
    // API not available yet
  }

  return <HomeContent products={products} vehicleBrands={vehicleBrands} />;
}

function HomeContent({
  products,
  vehicleBrands,
}: {
  products: WCProduct[];
  vehicleBrands: VehicleBrand[];
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-amber-600/20 text-amber-400 rounded-full mb-6">
                Premium TPE Material
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Passgenaue
                <br />
                <span className="text-amber-500">Auto-Fussmatten</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                3D &amp; 5D Fussmatten aus hochwertigem TPE-Material. Millimetergenau f&uuml;r Ihr Fahrzeug gefertigt. Wasser- und schmutzabweisend.
              </p>
            </div>
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
              { icon: "\uD83D\uDE97", title: "Passgenau", desc: "F\u00fcr Ihr Fahrzeugmodell" },
              { icon: "\uD83D\uDCA7", title: "Wasserdicht", desc: "TPE-Material" },
              { icon: "\uD83D\uDE9A", title: "Kostenloser Versand", desc: "Ab 50\u20AC in DE" },
              { icon: "\u21A9\uFE0F", title: "30 Tage", desc: "R\u00fcckgaberecht" },
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Kategorien</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "5D Premium Fussmatten", href: "/kategorie/5d-fussmatten" },
              { label: "3D Fussmatten", href: "/kategorie/3d-fussmatten" },
              { label: "LKW-Truck Fussmatten", href: "/kategorie/passend-fuer-lkw-truck-fussmatten" },
              { label: "Kleinbus & Pickup Fussmatten", href: "/kategorie/passend-fuer-kleinbus-pickup-fussmatten" },
              { label: "Universal Fussmatten", href: "/kategorie/universal-fussmatten" },
              { label: "Kofferraummatte", href: "/kategorie/kofferraummatte" },
              { label: "Fuss- & Kofferraummatten Set", href: "/kategorie/fuss-und-kofferraummatten-set" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-4 py-2 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-sm font-medium text-gray-700 rounded-full transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Neueste Produkte</h2>
          <Link href="/produkte" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
            Alle anzeigen &rarr;
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
            <p className="text-gray-500">Produkte werden geladen...</p>
            <p className="text-sm text-gray-400 mt-2">WooCommerce-Backend wird eingerichtet.</p>
          </div>
        )}
      </section>

      {/* Why FussMatt */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Warum FussMatt?</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">Qualit&auml;t, Passgenauigkeit und Design &ndash; vereint in einer Fussmatte.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "TPE Premium Material", desc: "Umweltfreundlich, geruchlos und extrem langlebig. Bis zu -40\u00B0C flexibel." },
              { title: "3D-Vermessung", desc: "Jede Matte wird per 3D-Scan millimetergenau f\u00fcr Ihr Fahrzeugmodell gefertigt." },
              { title: "Einfache Montage", desc: "Perfekte Passform ohne Zuschneiden. Einfach einlegen und fertig." },
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
