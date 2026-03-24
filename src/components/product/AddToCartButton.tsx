"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import type { WCProduct, WCProductVariation } from "@/types/woocommerce";

interface AddToCartButtonProps {
  product: WCProduct;
  variations: WCProductVariation[];
}

export default function AddToCartButton({ product, variations }: AddToCartButtonProps) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const isVariable = product.type === "variable" && variations.length > 0;
  const selectedVariation = isVariable
    ? variations.find((v) => v.attributes.every((a) => !a.option || selectedAttrs[a.name] === a.option))
    : undefined;
  const canAdd = product.stock_status === "instock" && (!isVariable || selectedVariation);

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, quantity, selectedVariation, selectedAttrs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {isVariable && product.attributes.filter((a) => a.variation).map((attr) => (
        <div key={attr.name}>
          <label className="block text-sm font-medium text-gray-900 mb-2">{attr.name}</label>
          <select
            value={selectedAttrs[attr.name] || ""}
            onChange={(e) => setSelectedAttrs((prev) => ({ ...prev, [attr.name]: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="">{t("selectVariant")}</option>
            {attr.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">&minus;</button>
          <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-gray-200">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">+</button>
        </div>
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`flex-1 h-12 rounded-xl font-medium text-sm transition-all ${added ? "bg-green-600 text-white" : canAdd ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          {added ? t("added") : isVariable && !selectedVariation ? t("chooseVariant") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
