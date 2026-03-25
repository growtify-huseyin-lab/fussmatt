import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { WCProduct } from "@/types/woocommerce";
import { formatPrice, wpMediaUrl } from "@/lib/utils";

interface ProductCardProps {
  product: WCProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  const mainImage = product.images[0];

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {mainImage ? (
          <Image
            src={wpMediaUrl(mainImage.src)}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        {product.on_sale && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
            {t("sale")}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        {product.categories.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {product.categories.map((c) => c.name).join(" / ")}
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.on_sale && product.regular_price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.regular_price)}</span>
          )}
        </div>
        <div className="mt-2">
          {product.stock_status === "instock" ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {t("inStock")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-red-500">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {t("outOfStock")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
