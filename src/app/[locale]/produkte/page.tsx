import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getLocalizedProductsWithTotal, getLocalizedCategories, getLocalizedCategoryBySlug } from "@/lib/woocommerce-i18n";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import type { Locale } from "@/i18n/config";
import type { WCProduct, WCCategory } from "@/types/woocommerce";

const ALLOWED_CATEGORY_SLUGS = [
  "5d-fussmatten",
  "3d-fussmatten",
  "passend-fuer-lkw-truck-fussmatten",
  "passend-fuer-kleinbus-pickup-fussmatten",
  "universal-fussmatten",
  "kofferraummatte",
  "fuss-und-kofferraummatten-set",
];

export const metadata: Metadata = {
  title: "Alle Fussmatten",
};

export default async function ProduktePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const kategorie = typeof sp.kategorie === "string" ? sp.kategorie : undefined;
  const search = typeof sp.suche === "string" ? sp.suche : undefined;
  const page = typeof sp.seite === "string" ? parseInt(sp.seite) : 1;

  let products: WCProduct[] = [];
  let categories: WCCategory[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const productParams: Record<string, string | number> = { per_page: 20, page, orderby: "date" };
    if (kategorie) {
      const cat = await getLocalizedCategoryBySlug(locale as Locale, kategorie);
      if (cat) productParams.category = cat.id;
    }
    if (search) productParams.search = search;

    const allCategories = await getLocalizedCategories(locale as Locale, { per_page: 100 });
    categories = allCategories.filter((cat) => ALLOWED_CATEGORY_SLUGS.includes(cat.slug));
    const result = await getLocalizedProductsWithTotal(locale as Locale, productParams);
    products = result.products;
    totalPages = result.totalPages;
    total = result.total;
  } catch {
    // API error
  }

  return (
    <ProdukteContent products={products} categories={categories} kategorie={kategorie} search={search} page={page} totalPages={totalPages} total={total} />
  );
}

function ProdukteContent({ products, categories, kategorie, search, page, totalPages, total }: {
  products: WCProduct[]; categories: WCCategory[]; kategorie?: string; search?: string; page: number; totalPages: number; total: number;
}) {
  const t = useTranslations("products");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {kategorie ? `${t("title")}: ${kategorie}` : search ? `${t("title")}: "${search}"` : t("title")}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{t("found", { count: total || products.length })}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <form action="" method="GET" className="mb-6">
              <div className="relative">
                <input type="text" name="suche" placeholder={t("searchPlaceholder")} defaultValue={search}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </form>
            {categories.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("categories")}</h3>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a href={`?kategorie=${cat.slug}`}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${kategorie === cat.slug ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                        {cat.name} <span className="text-xs text-gray-400 ml-1">({cat.count})</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">{t("noProducts")}</p>
              <a href="?" className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">{t("showAllProducts")}</a>
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/produkte"
            queryParams={{
              ...(kategorie ? { kategorie } : {}),
              ...(search ? { suche: search } : {}),
            }}
          />
        </div>
      </div>
    </div>
  );
}
