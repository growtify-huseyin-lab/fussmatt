export const revalidate = 300;

import type { Metadata } from "next";
import { getProductBySlug, getProductVariations } from "@/lib/woocommerce";
import { notFound } from "next/navigation";
import { formatPrice, stripHtml, wpMediaUrl } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductGallery from "@/components/product/ProductGallery";
import ProductAccordion from "@/components/product/ProductAccordion";
import { JsonLd, productSchema, breadcrumbSchema } from "@/lib/seo";
import type { WCProduct, WCProductVariation } from "@/types/woocommerce";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: stripHtml(product.short_description || product.description).slice(0, 160),
    openGraph: { images: product.images[0] ? [{ url: wpMediaUrl(product.images[0].src) }] : [] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  let variations: WCProductVariation[] = [];
  if (product.type === "variable" && product.variations.length > 0) {
    try { variations = await getProductVariations(product.id); } catch { /* */ }
  }

  return (
    <>
      <JsonLd data={productSchema(product, )} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: "Fussmatten", url: "/produkte" },
        ...(() => { const cat = product.categories.find(c => c.slug !== "unkategorisiert" && c.slug !== "uncategorized"); return cat ? [{ name: cat.name, url: `/produkte?kategorie=${cat.slug}` }] : []; })(),
        { name: product.name, url: `/produkt/${product.slug}` },
      ], )} />
      <ProductContent product={product} variations={variations} />
    </>
  );
}

function ProductContent({ product, variations }: { product: WCProduct; variations: WCProductVariation[] }) {

  // Key attributes for quick summary (shown above Add to Cart)
  const keyAttrs = product.attributes.filter((a) => a.visible && ["Marke", "Modell", "Fahrzeug", "Material"].includes(a.name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Interactive Gallery */}
        <ProductGallery
          images={product.images}
          productName={product.name}
          onSale={product.on_sale}
        />

        {/* Right: Product Info */}
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-amber-600">{"Startseite"}</a>
            <span>/</span>
            <a href="/produkte" className="hover:text-amber-600">{"Fussmatten"}</a>
            {(() => { const cat = product.categories.find(c => c.slug !== "unkategorisiert" && c.slug !== "uncategorized"); return cat ? (<><span>/</span><a href={`/produkte?kategorie=${cat.slug}`} className="hover:text-amber-600">{cat.name}</a></>) : null; })()}
          </nav>

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-1.5 text-xs text-gray-400">{"Art.-Nr."}: {product.sku}</p>
          )}

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
                <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                  {Math.round((1 - parseFloat(product.price) / parseFloat(product.regular_price)) * 100)}% Rabatt
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">{"Inkl. MwSt. zzgl. Versandkosten"}</p>

          {/* Stock Status */}
          <div className="mt-4">
            {product.stock_status === "instock" ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {"Auf Lager – Sofort lieferbar"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-red-500 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {"Derzeit nicht verfügbar"}
              </span>
            )}
          </div>

          {/* Key Attributes — compact inline chips */}
          {keyAttrs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {keyAttrs.map((attr) => (
                <span
                  key={attr.name}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <span className="text-gray-400">{attr.name}:</span>
                  <span className="font-semibold text-gray-900">{attr.options.join(", ")}</span>
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton product={product} variations={variations} />
          </div>

          {/* USP Features */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              { icon: "\uD83D\uDE97", text: "Passgenaue Fertigung" },
              { icon: "\uD83D\uDCA7", text: "Wasserdicht (TPE)" },
              { icon: "\u2744\uFE0F", text: "Bis -40°C flexibel" },
              { icon: "\u267B\uFE0F", text: "100% recycelbar" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <span>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          {/* Accordion: Beschreibung + Zusätzliche Informationen + Versand */}
          <ProductAccordion
            description={product.description}
            attributes={product.attributes}
          />
        </div>
      </div>
    </div>
  );
}
