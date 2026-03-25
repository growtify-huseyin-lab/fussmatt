import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agb" });
  return { title: t("title") };
}

export default async function AGBPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AGBContent />;
}

function AGBContent() {
  const t = useTranslations("agb");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>{t("s1Title")}</h2>
          <p>{t("s1P1")}</p>
          <p>{t("s1P2")}</p>
        </section>

        <section>
          <h2>{t("s2Title")}</h2>
          <p>{t("s2P1")}</p>
          <p>{t("s2P2")}</p>
        </section>

        <section>
          <h2>{t("s3Title")}</h2>
          <p>{t("s3P1")}</p>
          <p>{t("s3PaymentIntro")}</p>
          <ul>
            <li>{t("s3PaymentVisa")}</li>
            <li>{t("s3PaymentPaypal")}</li>
            <li>{t("s3PaymentKlarna")}</li>
          </ul>
          <p>{t("s3PaymentDue")}</p>
        </section>

        <section>
          <h2>{t("s4Title")}</h2>
          <p>{t("s4Intro")}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">{t("s4ColCountry")}</th>
                <th className="text-left py-2">{t("s4ColCost")}</th>
                <th className="text-left py-2">{t("s4ColTime")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">{t("s4ChLabel")}</td><td>{t("s4ChCost")}</td><td>{t("s4ChTime")}</td></tr>
              <tr className="border-b"><td className="py-2">{t("s4DeLabel")}</td><td>{t("s4DeCost")}</td><td>{t("s4DeTime")}</td></tr>
              <tr className="border-b"><td className="py-2">{t("s4AtLabel")}</td><td>{t("s4AtCost")}</td><td>{t("s4AtTime")}</td></tr>
              <tr className="border-b"><td className="py-2">{t("s4FrLabel")}</td><td>{t("s4FrCost")}</td><td>{t("s4FrTime")}</td></tr>
              <tr className="border-b"><td className="py-2">{t("s4ItLabel")}</td><td>{t("s4ItCost")}</td><td>{t("s4ItTime")}</td></tr>
              <tr><td className="py-2">{t("s4NlLabel")}</td><td>{t("s4NlCost")}</td><td>{t("s4NlTime")}</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-2">{t("s4Note")}</p>
        </section>

        <section>
          <h2>{t("s5Title")}</h2>
          <p>
            {t("s5P1")}{" "}
            <Link href="/widerruf" className="text-amber-600 hover:text-amber-700">{t("s5P1Link")}</Link>.
          </p>
          <p>{t("s5P2")}</p>
          <p>{t("s5P3")}</p>
        </section>

        <section>
          <h2>{t("s6Title")}</h2>
          <p>{t("s6P1")}</p>
        </section>

        <section>
          <h2>{t("s7Title")}</h2>
          <p>{t("s7P1")}</p>
        </section>

        <section>
          <h2>{t("s8Title")}</h2>
          <p>{t("s8P1")}</p>
        </section>

        <section>
          <h2>{t("s9Title")}</h2>
          <p>
            {t("s9P1")}{" "}
            <Link href="/datenschutz" className="text-amber-600 hover:text-amber-700">{t("s9P1Link")}</Link>.
          </p>
        </section>

        <section>
          <h2>{t("s10Title")}</h2>
          <p>{t("s10P1")}</p>
          <p>{t("s10P2")}</p>
        </section>

        <p className="text-sm text-gray-500 mt-8">{t("lastUpdated")}</p>
      </div>
    </div>
  );
}
