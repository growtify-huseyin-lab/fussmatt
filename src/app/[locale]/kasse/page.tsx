"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { WCAddress } from "@/types/woocommerce";

export default function KassePage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [billing, setBilling] = useState<WCAddress>({
    first_name: "", last_name: "", company: "", address_1: "", address_2: "",
    city: "", state: "", postcode: "", country: "DE", email: "", phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          shipping: billing,
          locale,
          line_items: items.map((item) => ({
            product_id: item.product.id,
            variation_id: item.variation?.id || 0,
            quantity: item.quantity,
            name: item.product.name,
            price: parseFloat(item.variation?.price || item.product.price),
          })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.sessionUrl) {
        clearCart();
        window.location.href = data.sessionUrl;
      } else {
        setError(data?.error || t("orderError"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(t("orderError"));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">{t("emptyCart")}</p>
        <Link href="/produkte" className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">{t("backToShop")} &rarr;</Link>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("billingTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">{t("firstName")} *</label><input name="first_name" required value={billing.first_name} onChange={handleChange} className={inputCls} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">{t("lastName")} *</label><input name="last_name" required value={billing.last_name} onChange={handleChange} className={inputCls} /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t("company")}</label><input name="company" value={billing.company} onChange={handleChange} className={inputCls} /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t("street")} *</label><input name="address_1" required value={billing.address_1} onChange={handleChange} className={inputCls} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">{t("postcode")} *</label><input name="postcode" required value={billing.postcode} onChange={handleChange} className={inputCls} /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">{t("city")} *</label><input name="city" required value={billing.city} onChange={handleChange} className={inputCls} /></div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t("country")} *</label>
                <select name="country" value={billing.country} onChange={handleChange} className={`${inputCls} bg-white`}>
                  <option value="DE">{t("germany")}</option>
                  <option value="AT">{t("austria")}</option>
                  <option value="CH">{t("switzerland")}</option>
                  <option value="FR">{t("france")}</option>
                  <option value="IT">{t("italy")}</option>
                  <option value="NL">{t("netherlands")}</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">{t("phone")}</label><input name="phone" type="tel" value={billing.phone} onChange={handleChange} className={inputCls} /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t("email")} *</label><input name="email" type="email" required value={billing.email} onChange={handleChange} className={inputCls} /></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-gray-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("summaryTitle")}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.variation?.id || 0}`} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} &times; {item.quantity}</span>
                  <span className="font-medium text-gray-900">{formatPrice(parseFloat(item.variation?.price || item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm"><span className="text-gray-600">{t("subtotal")}</span><span className="font-medium">{formatPrice(totalPrice())}</span></div>
              <div className="flex justify-between text-sm mt-2"><span className="text-gray-600">{t("shipping")}</span><span className="text-green-600 font-medium">{t("shippingFree")}</span></div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-base font-bold text-gray-900">{t("total")}</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice())}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{t("inclVat")}</p>
            </div>
            {error && (
              <div role="alert" className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}
            <label className="mt-4 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                {t("agbAccept")}{" "}
                <Link href="/agb" className="text-amber-600 hover:text-amber-700 underline" target="_blank">{t("agbLink")}</Link>
                {" "}{t("agbAnd")}{" "}
                <Link href="/datenschutz" className="text-amber-600 hover:text-amber-700 underline" target="_blank">{t("privacyLink")}</Link>
                {" "}{t("agbAnd")}{" "}
                <Link href="/widerruf" className="text-amber-600 hover:text-amber-700 underline" target="_blank">{t("withdrawalLink")}</Link>
                {" "}{t("agbRead")}
              </span>
            </label>
            <button type="submit" disabled={loading || !agbAccepted} className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors">
              {loading ? t("processing") : t("placeOrder")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
