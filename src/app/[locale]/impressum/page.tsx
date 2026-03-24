import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = { title: "Impressum" };

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>Angaben gem&#228;ss Art. 3 Abs. 1 lit. s UWG (Schweiz)</h2>
          <p>
            <strong>FussMatt</strong><br />
            Ein Angebot der Royal Road GmbH<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich<br />
            Schweiz
          </p>
        </section>

        <section>
          <h2>Handelsregistereintrag</h2>
          <p>
            Eingetragen im Handelsregister des Kantons Z&#252;rich<br />
            Handelsregisternummer: CH-020.4.074.049-1<br />
            Rechtsform: Gesellschaft mit beschr&#228;nkter Haftung (GmbH)
          </p>
        </section>

        <section>
          <h2>Gesch&#228;ftsf&#252;hrer</h2>
          <p>Dipl. Ing. Abdurrahman Uyanik</p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            E-Mail: info@fussmatt.com<br />
            Website: www.fussmatt.com
          </p>
        </section>

        {/* TODO: MWST numarası eklenecek — CHE-xxx.xxx.xxx MWST */}

        <section>
          <h2>EU-Streitschlichtung</h2>
          <p>
            F&#252;r Kunden aus der EU: Die Europ&#228;ische Kommission stellt eine Plattform
            zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        <section>
          <h2>Haftungsausschluss</h2>
          <p>
            Der Autor &#252;bernimmt keine Gew&#228;hr f&#252;r die Richtigkeit, Genauigkeit,
            Aktualit&#228;t, Zuverl&#228;ssigkeit und Vollst&#228;ndigkeit der Informationen.
          </p>
          <p>
            Haftungsanspr&#252;che gegen den Autor wegen Sch&#228;den materieller oder immaterieller Art,
            die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der ver&#246;ffentlichten Informationen,
            durch Missbrauch der Verbindung oder durch technische St&#246;rungen entstanden sind, werden
            ausgeschlossen.
          </p>
        </section>

        <section>
          <h2>Urheberrechte</h2>
          <p>
            Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf
            dieser Website geh&#246;ren ausschliesslich der Royal Road GmbH oder den speziell genannten
            Rechteinhabern. F&#252;r die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung
            des Urheberrechtstr&#228;gers im Voraus einzuholen.
          </p>
        </section>
      </div>
    </div>
  );
}
