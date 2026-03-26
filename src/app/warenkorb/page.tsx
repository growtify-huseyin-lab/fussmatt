import type { Metadata } from "next";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Warenkorb",
};

export default async function WarenkorbPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {

  return <WarenkorbContent />;
}

function WarenkorbContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Warenkorb"}</h1>
      <CartDrawer />
    </div>
  );
}
