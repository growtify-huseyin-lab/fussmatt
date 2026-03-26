import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Allgemeine Geschäftsbedingungen (AGB)" };
}

export default async function AGBPage() {

  return <AGBContent />;
}

function AGBContent() {

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Allgemeine Geschäftsbedingungen (AGB)"}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>{"§ 1 Geltungsbereich"}</h2>
          <p>{"Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Bestellungen, die über den Online-Shop www.fussmatt.com getätigt werden. Betreiberin des Shops ist die Royal Road GmbH, Dübendorfstrasse 4, 8051 Zürich, Schweiz (nachfolgend «FussMatt»)."}</p>
          <p>{"Mit der Bestellung akzeptiert der Kunde diese AGB. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, FussMatt stimmt deren Geltung ausdrücklich schriftlich zu."}</p>
        </section>

        <section>
          <h2>{"§ 2 Vertragsschluss"}</h2>
          <p>{"Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung an den Kunden, Waren zu bestellen."}</p>
          <p>{"Durch Absenden der Bestellung gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt zustande, wenn FussMatt die Bestellung durch eine Auftragsbestätigung per E-Mail annimmt oder die Ware versendet."}</p>
        </section>

        <section>
          <h2>{"§ 3 Preise und Zahlungsbedingungen"}</h2>
          <p>{"Alle Preise verstehen sich in Schweizer Franken (CHF) oder Euro (EUR), inkl. der gesetzlichen Mehrwertsteuer (8,1% in der Schweiz / 19% in DE / 20% in AT)."}</p>
          <p>{"Wir akzeptieren folgende Zahlungsarten:"}</p>
          <ul>
            <li>{"Kreditkarte (Visa, Mastercard, American Express) über Stripe"}</li>
            <li>{"PayPal"}</li>
            <li>{"Klarna (Rechnung / Ratenzahlung, wo verfügbar)"}</li>
          </ul>
          <p>{"Die Zahlung ist mit Bestellabschluss fällig."}</p>
        </section>

        <section>
          <h2>{"§ 4 Versand und Lieferung"}</h2>
          <p>{"Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse."}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">{"Land"}</th>
                <th className="text-left py-2">{"Versandkosten"}</th>
                <th className="text-left py-2">{"Lieferzeit"}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">{"Schweiz"}</td><td>{"Kostenlos ab CHF 50"}</td><td>{"3–5 Werktage"}</td></tr>
              <tr className="border-b"><td className="py-2">{"Deutschland"}</td><td>{"Kostenlos ab € 50"}</td><td>{"3–7 Werktage"}</td></tr>
              <tr className="border-b"><td className="py-2">{"Österreich"}</td><td>{"ab € 5,90"}</td><td>{"4–8 Werktage"}</td></tr>
              <tr className="border-b"><td className="py-2">{"Frankreich"}</td><td>{"ab € 7,90"}</td><td>{"5–10 Werktage"}</td></tr>
              <tr className="border-b"><td className="py-2">{"Italien"}</td><td>{"ab € 7,90"}</td><td>{"5–10 Werktage"}</td></tr>
              <tr><td className="py-2">{"Niederlande"}</td><td>{"ab € 6,90"}</td><td>{"4–8 Werktage"}</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-2">{"Lieferzeiten sind geschätzt und beginnen ab Zahlungseingang. Bei Dropshipping-Artikeln kann die Lieferzeit abweichen."}</p>
        </section>

        <section>
          <h2>{"§ 5 Widerrufsrecht / Rückgabe"}</h2>
          <p>
            {"Für Kunden aus der EU gilt das gesetzliche Widerrufsrecht von 14 Tagen ab Warenerhalt. Details finden Sie in unserer"}{" "}
            <Link href="/widerruf" className="text-amber-600 hover:text-amber-700">{"Widerrufsbelehrung"}</Link>.
          </p>
          <p>{"Für Kunden in der Schweiz bieten wir freiwillig ein Rückgaberecht von 30 Tagen ab Warenerhalt. Die Ware muss unbenutzt, in Originalverpackung und vollständig zurückgesandt werden."}</p>
          <p>{"Die Rücksendekosten trägt der Kunde, sofern kein Mangel vorliegt."}</p>
        </section>

        <section>
          <h2>{"§ 6 Gewährleistung"}</h2>
          <p>{"Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist beträgt 2 Jahre ab Lieferung (gemäss Art. 210 OR für CH-Kunden / § 438 BGB für DE-Kunden)."}</p>
        </section>

        <section>
          <h2>{"§ 7 Haftungsbeschränkung"}</h2>
          <p>{"Die Haftung von FussMatt für leichte Fahrlässigkeit wird ausgeschlossen, soweit gesetzlich zulässig. Dies gilt nicht für Schäden an Leben, Körper oder Gesundheit."}</p>
        </section>

        <section>
          <h2>{"§ 8 Eigentumsvorbehalt"}</h2>
          <p>{"Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum der Royal Road GmbH."}</p>
        </section>

        <section>
          <h2>{"§ 9 Datenschutz"}</h2>
          <p>
            {"Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer"}{" "}
            <Link href="/datenschutz" className="text-amber-600 hover:text-amber-700">{"Datenschutzerklärung"}</Link>.
          </p>
        </section>

        <section>
          <h2>{"§ 10 Anwendbares Recht und Gerichtsstand"}</h2>
          <p>{"Es gilt Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand ist Zürich, Schweiz."}</p>
          <p>{"Für Verbraucher aus der EU gelten zusätzlich die zwingenden Bestimmungen des Verbraucherschutzrechts des jeweiligen Wohnsitzstaates, sofern diese günstiger sind."}</p>
        </section>

        <p className="text-sm text-gray-500 mt-8">{"Stand: März 2026"}</p>
      </div>
    </div>
  );
}
