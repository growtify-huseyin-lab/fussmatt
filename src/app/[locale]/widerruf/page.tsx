import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "widerruf" });
  return { title: t("title") };
}

export default async function WiderrufPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WiderrufContent />;
}

function WiderrufContent() {
  const t = useTranslations("widerruf");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
          <p className="font-semibold text-amber-800">
            {t("chNoticeTitle")}
          </p>
          <p className="text-amber-700 mt-1">
            {t.rich("chNoticeText", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <section>
          <h2>{t("euTitle")}</h2>
          <p>{t("euP1")}</p>
          <p>
            {t.rich("euP2", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p>{t("euP3")}</p>
        </section>

        <section>
          <h2>{t("exerciseTitle")}</h2>
          <p>{t("exerciseP1")}</p>
          <p>
            <strong>Royal Road GmbH</strong> (FussMatt)<br />
            Dübendorfstrasse 4<br />
            8051 Zürich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>{t("exerciseP2")}</p>
        </section>

        <section>
          <h2>{t("consequencesTitle")}</h2>
          <p>{t("consequencesP1")}</p>
          <p>{t("consequencesP2")}</p>
          <p>{t("consequencesP3")}</p>
          <p>{t("consequencesP4")}</p>
          <p>
            <strong>{t("consequencesP5")}</strong>
          </p>
        </section>

        <section>
          <h2>{t("formTitle")}</h2>
          <p className="text-sm text-gray-500">
            {t("formIntro")}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm space-y-3">
            <p>{t("formTo")}</p>
            <p>{t("formText")}</p>
            <p>______________________________________________________</p>
            <p>{t("formOrdered")}</p>
            <p>{t("formName")}</p>
            <p>{t("formAddress")}</p>
            <p>{t("formDate")}</p>
            <p>{t("formSignature")}</p>
            <p className="text-xs text-gray-400 mt-4">{t("formNote")}</p>
          </div>
        </section>

        <p className="text-sm text-gray-500 mt-8">{t("lastUpdated")}</p>
      </div>
    </div>
  );
}
