import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>Angaben gem&auml;ss Art. 3 Abs. 1 lit. s UWG (Schweiz)</h2>
          <p className="whitespace-pre-line">
            <strong>FussMatt</strong>
            {`\nEin Angebot der Royal Road GmbH\nD\u00fcbendorfstrasse 4\n8051 Z\u00fcrich\nSchweiz`}
          </p>
        </section>

        <section>
          <h2>Handelsregistereintrag</h2>
          <p className="whitespace-pre-line">{`Eingetragen im Handelsregister des Kantons Z\u00fcrich\nHandelsregisternummer: CH-020.4.074.049-1\nRechtsform: Gesellschaft mit beschr\u00e4nkter Haftung (GmbH)`}</p>
        </section>

        <section>
          <h2>Gesch&auml;ftsf&uuml;hrer</h2>
          <p>Dipl. Ing. Abdurrahman Uyanik</p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p className="whitespace-pre-line">{`E-Mail: info@fussmatt.com\nWebsite: www.fussmatt.com`}</p>
        </section>

        <section>
          <h2>EU-Streitschlichtung</h2>
          <p>
            F&uuml;r Kunden aus der EU: Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        <section>
          <h2>Haftungsausschluss</h2>
          <p>Der Autor &uuml;bernimmt keine Gew&auml;hr f&uuml;r die Richtigkeit, Genauigkeit, Aktualit&auml;t, Zuverl&auml;ssigkeit und Vollst&auml;ndigkeit der Informationen.</p>
          <p>Haftungsanspr&uuml;che gegen den Autor wegen Sch&auml;den materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der ver&ouml;ffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische St&ouml;rungen entstanden sind, werden ausgeschlossen.</p>
        </section>

        <section>
          <h2>Urheberrechte</h2>
          <p>Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website geh&ouml;ren ausschliesslich der Royal Road GmbH oder den speziell genannten Rechteinhabern. F&uuml;r die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtstr&auml;gers im Voraus einzuholen.</p>
        </section>
      </div>
    </div>
  );
}
