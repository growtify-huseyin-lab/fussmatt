import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "versand" });
  return { title: t("title") };
}

export default async function VersandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VersandContent />;
}

function VersandContent() {
  const t = useTranslations("versand");

  const countries = [
    { key: "switzerland", days: "days2_4" },
    { key: "germany", days: "days3_5" },
    { key: "austria", days: "days3_5" },
    { key: "france", days: "days4_7" },
    { key: "italy", days: "days4_7" },
    { key: "netherlands", days: "days3_5" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>{t("costTitle")}</h2>
          <p>{t("costIntro")}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-8">{t("country")}</th>
                  <th className="text-left py-2 pr-8">{t("shippingCost")}</th>
                  <th className="text-left py-2">{t("deliveryTime")}</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.key}>
                    <td className="py-2 pr-8">{t(c.key)}</td>
                    <td className="py-2 pr-8">{t("free")}</td>
                    <td className="py-2">{t(c.days)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>{t("partnerTitle")}</h2>
          <p>{t("partnerDesc")}</p>
        </section>

        <section>
          <h2>{t("processingTitle")}</h2>
          <p>{t("processingDesc")}</p>
        </section>

        <section>
          <h2>{t("questionTitle")}</h2>
          <p>
            {t("questionDesc")}{" "}
            <a href="mailto:info@fussmatt.com" className="text-amber-600 hover:text-amber-700">
              info@fussmatt.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
