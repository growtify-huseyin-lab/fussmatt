import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });
  return { title: t("title") };
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImpressumContent />;
}

function ImpressumContent() {
  const t = useTranslations("impressum");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>{t("companyTitle")}</h2>
          <p className="whitespace-pre-line">
            <strong>FussMatt</strong>{"\n"}{t("companyInfo")}
          </p>
        </section>

        <section>
          <h2>{t("registerTitle")}</h2>
          <p className="whitespace-pre-line">{t("registerInfo")}</p>
        </section>

        <section>
          <h2>{t("directorTitle")}</h2>
          <p>{t("directorName")}</p>
        </section>

        <section>
          <h2>{t("contactTitle")}</h2>
          <p className="whitespace-pre-line">{t("contactInfo")}</p>
        </section>

        {/* TODO: MWST numarası eklenecek — CHE-xxx.xxx.xxx MWST */}

        <section>
          <h2>{t("euDisputeTitle")}</h2>
          <p>
            {t("euDisputeP1")}{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>{t("euDisputeP2")}</p>
        </section>

        <section>
          <h2>{t("disclaimerTitle")}</h2>
          <p>{t("disclaimerP1")}</p>
          <p>{t("disclaimerP2")}</p>
        </section>

        <section>
          <h2>{t("copyrightTitle")}</h2>
          <p>{t("copyrightP1")}</p>
        </section>
      </div>
    </div>
  );
}
