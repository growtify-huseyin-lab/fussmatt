"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { WCAddress } from "@/types/woocommerce";

export default function KassePage() {
  const t = useTranslations("checkout");
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
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
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: "stripe", payment_method_title: "Card", set_paid: false,
          billing, shipping: billing,
          line_items: items.map((item) => ({ product_id: item.product.id, variation_id: item.variation?.id || 0, quantity: item.quantity })),
        }),
      });
      if (res.ok) { clearCart(); setOrderPlaced(true); }
    } catch (err) { console.error("Order error:", err); }
    finally { setLoading(false); }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("thankYou")}</h1>
        <p className="mt-3 text-gray-500">{t("confirmEmail")}</p>
        <Link href="/" className="mt-6 inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors">{t("backToShop")}</Link>
      </div>
    );
  }

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
            <button type="submit" disabled={loading} className="mt-6 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors">
              {loading ? t("processing") : t("placeOrder")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
