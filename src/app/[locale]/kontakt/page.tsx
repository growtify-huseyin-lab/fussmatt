import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kontakt" });
  return { title: t("title") };
}

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <KontaktContent />;
}

function KontaktContent() {
  const t = useTranslations("kontakt");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <p>{t("intro")}</p>
        </section>

        <section>
          <h2>{t("addressTitle")}</h2>
          <p>
            <strong>FussMatt</strong><br />
            Royal Road GmbH<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich<br />
            Schweiz
          </p>
        </section>

        <section>
          <h2>{t("emailTitle")}</h2>
          <p>
            <a href="mailto:info@fussmatt.com" className="text-amber-600 hover:text-amber-700">
              info@fussmatt.com
            </a>
          </p>
        </section>

        <section>
          <h2>{t("hoursTitle")}</h2>
          <p>
            {t("hours")}<br />
            {t("weekend")}
          </p>
          <p>{t("responseTime")}</p>
        </section>
      </div>
    </div>
  );
}
