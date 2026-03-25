import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "datenschutz" });
  return { title: t("title") };
}

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DatenschutzContent />;
}

function DatenschutzContent() {
  const t = useTranslations("datenschutz");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>{t("s1Title")}</h2>
          <p>
            <strong>Royal Road GmbH</strong> ({t("s1Address")})<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>{t("s1P1")}</p>
        </section>

        <section>
          <h2>{t("s2Title")}</h2>
          <p>{t("s2P1")}</p>
          <ul>
            <li>{t("s2List1")}</li>
            <li>{t("s2List2")}</li>
            <li>{t("s2List3")}</li>
            <li>{t("s2List4")}</li>
            <li>{t("s2List5")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("s3Title")}</h2>
          <p>{t("s3P1")}</p>
          <ul>
            <li>{t("s3List1")}</li>
            <li>{t("s3List2")}</li>
            <li>{t("s3List3")}</li>
            <li>{t("s3List4")}</li>
            <li>{t("s3List5")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("s4Title")}</h2>
          <p>{t("s4P1")}</p>
          <h3>{t("s4EssentialTitle")}</h3>
          <p>{t("s4EssentialP1")}</p>
          <h3>{t("s4AnalyticsTitle")}</h3>
          <p>{t("s4AnalyticsP1")}</p>
        </section>

        <section>
          <h2>{t("s5Title")}</h2>
          <p>{t("s5P1")}</p>
          <p><strong>{t("s5P2")}</strong></p>
          <p>{t("s5P3")}</p>
        </section>

        <section>
          <h2>{t("s6Title")}</h2>
          <p>{t("s6P1")}</p>
          <ul>
            <li><strong>Stripe</strong> {t("s6Stripe")}</li>
            <li><strong>PayPal</strong> {t("s6Paypal")}</li>
          </ul>
          <p>{t("s6P2")}</p>
        </section>

        <section>
          <h2>{t("s7Title")}</h2>
          <p>{t("s7P1")}</p>
          <ul>
            <li>{t("s7List1")}</li>
            <li>{t("s7List2")}</li>
            <li>{t("s7List3")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("s8Title")}</h2>
          <p>{t("s8P1")}</p>
        </section>

        <section>
          <h2>{t("s9Title")}</h2>
          <p>{t("s9P1")}</p>
          <ul>
            <li>{t("s9List1")}</li>
            <li>{t("s9List2")}</li>
            <li>{t("s9List3")}</li>
            <li>{t("s9List4")}</li>
            <li>{t("s9List5")}</li>
            <li>{t("s9List6")}</li>
            <li>{t("s9List7")}</li>
          </ul>
          <p>{t("s9P2")}</p>
          <p>{t("s9P3")}</p>
        </section>

        <section>
          <h2>{t("s10Title")}</h2>
          <p>{t("s10P1")}</p>
        </section>

        <section>
          <h2>{t("s11Title")}</h2>
          <p>{t("s11P1")}</p>
          <p className="text-sm text-gray-500">{t("lastUpdated")}</p>
        </section>
      </div>
    </div>
  );
}
