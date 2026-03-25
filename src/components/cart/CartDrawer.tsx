"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { wpMediaUrl } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const t = useTranslations("cart");

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="text-gray-500 text-sm">{t("empty")}</p>
        <Link href="/produkte" className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">
          {t("shopNow")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => {
          const image = item.variation?.image || item.product.images[0];
          const price = item.variation?.price || item.product.price;
          const key = `${item.product.id}-${item.variation?.id || 0}`;
          return (
            <div key={key} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                {image && <Image src={wpMediaUrl(image.src)} alt={item.product.name} fill sizes="80px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                {item.selectedAttributes && (
                  <p className="text-xs text-gray-500 mt-0.5">{Object.values(item.selectedAttributes).join(" / ")}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation?.id)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors">&minus;</button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation?.id)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors">+</button>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{formatPrice(parseFloat(price) * item.quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.product.id, item.variation?.id)} className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors" aria-label={t("remove")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t("subtotal")}</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice())}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{t("vatNote")}</p>
      </div>

      <div className="space-y-3">
        <Link href="/kasse" className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-3 rounded-xl font-medium transition-colors">{t("checkout")}</Link>
        <Link href="/produkte" className="block w-full text-center py-3 text-sm text-gray-600 hover:text-amber-600 transition-colors">{t("continueShopping")}</Link>
      </div>
    </div>
  );
}
