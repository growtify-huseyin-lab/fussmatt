import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = { title: "AGB" };

export default async function AGBPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Allgemeine Gesch&#228;ftsbedingungen (AGB)</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>&#167; 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Gesch&#228;ftsbedingungen (AGB) gelten f&#252;r s&#228;mtliche
            Bestellungen, die &#252;ber den Online-Shop www.fussmatt.com get&#228;tigt werden.
            Betreiberin des Shops ist die Royal Road GmbH, D&#252;bendorfstrasse 4, 8051 Z&#252;rich,
            Schweiz (nachfolgend &#171;FussMatt&#187;).
          </p>
          <p>
            Mit der Bestellung akzeptiert der Kunde diese AGB. Abweichende Bedingungen des Kunden
            werden nicht anerkannt, es sei denn, FussMatt stimmt deren Geltung ausdr&#252;cklich
            schriftlich zu.
          </p>
        </section>

        <section>
          <h2>&#167; 2 Vertragsschluss</h2>
          <p>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar,
            sondern eine unverbindliche Aufforderung an den Kunden, Waren zu bestellen.
          </p>
          <p>
            Durch Absenden der Bestellung gibt der Kunde ein verbindliches Angebot ab. Der Vertrag
            kommt zustande, wenn FussMatt die Bestellung durch eine Auftragsbest&#228;tigung per
            E-Mail annimmt oder die Ware versendet.
          </p>
        </section>

        <section>
          <h2>&#167; 3 Preise und Zahlungsbedingungen</h2>
          <p>
            Alle Preise verstehen sich in Schweizer Franken (CHF) oder Euro (EUR), inkl. der
            gesetzlichen Mehrwertsteuer (8,1% in der Schweiz / 19% in DE / 20% in AT).
          </p>
          <p>Wir akzeptieren folgende Zahlungsarten:</p>
          <ul>
            <li>Kreditkarte (Visa, Mastercard, American Express) &#252;ber Stripe</li>
            <li>PayPal</li>
            <li>Klarna (Rechnung / Ratenzahlung, wo verf&#252;gbar)</li>
          </ul>
          <p>Die Zahlung ist mit Bestellabschluss f&#228;llig.</p>
        </section>

        <section>
          <h2>&#167; 4 Versand und Lieferung</h2>
          <p>Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse.</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Land</th>
                <th className="text-left py-2">Versandkosten</th>
                <th className="text-left py-2">Lieferzeit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">Schweiz</td><td>Kostenlos ab CHF 50</td><td>3&#8211;5 Werktage</td></tr>
              <tr className="border-b"><td className="py-2">Deutschland</td><td>Kostenlos ab &#8364; 50</td><td>3&#8211;7 Werktage</td></tr>
              <tr className="border-b"><td className="py-2">&#214;sterreich</td><td>ab &#8364; 5,90</td><td>4&#8211;8 Werktage</td></tr>
              <tr className="border-b"><td className="py-2">Frankreich</td><td>ab &#8364; 7,90</td><td>5&#8211;10 Werktage</td></tr>
              <tr className="border-b"><td className="py-2">Italien</td><td>ab &#8364; 7,90</td><td>5&#8211;10 Werktage</td></tr>
              <tr><td className="py-2">Niederlande</td><td>ab &#8364; 6,90</td><td>4&#8211;8 Werktage</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-2">
            Lieferzeiten sind gesch&#228;tzt und beginnen ab Zahlungseingang. Bei Dropshipping-Artikeln
            kann die Lieferzeit abweichen.
          </p>
        </section>

        <section>
          <h2>&#167; 5 Widerrufsrecht / R&#252;ckgabe</h2>
          <p>
            F&#252;r Kunden aus der EU gilt das gesetzliche Widerrufsrecht von 14 Tagen ab Warenerhalt.
            Details finden Sie in unserer{" "}
            <a href="/widerruf" className="text-amber-600 hover:text-amber-700">Widerrufsbelehrung</a>.
          </p>
          <p>
            F&#252;r Kunden in der Schweiz bieten wir freiwillig ein R&#252;ckgaberecht von
            <strong> 30 Tagen</strong> ab Warenerhalt. Die Ware muss unbenutzt, in Originalverpackung
            und vollst&#228;ndig zur&#252;ckgesandt werden.
          </p>
          <p>
            Die R&#252;cksendekosten tr&#228;gt der Kunde, sofern kein Mangel vorliegt.
          </p>
        </section>

        <section>
          <h2>&#167; 6 Gew&#228;hrleistung</h2>
          <p>
            Es gelten die gesetzlichen Gew&#228;hrleistungsrechte. Die Gew&#228;hrleistungsfrist
            betr&#228;gt 2 Jahre ab Lieferung (gem&#228;ss Art. 210 OR f&#252;r CH-Kunden /
            &#167; 438 BGB f&#252;r DE-Kunden).
          </p>
        </section>

        <section>
          <h2>&#167; 7 Haftungsbeschr&#228;nkung</h2>
          <p>
            Die Haftung von FussMatt f&#252;r leichte Fahrl&#228;ssigkeit wird ausgeschlossen,
            soweit gesetzlich zul&#228;ssig. Dies gilt nicht f&#252;r Sch&#228;den an Leben,
            K&#246;rper oder Gesundheit.
          </p>
        </section>

        <section>
          <h2>&#167; 8 Eigentumsvorbehalt</h2>
          <p>
            Die gelieferte Ware bleibt bis zur vollst&#228;ndigen Bezahlung Eigentum der
            Royal Road GmbH.
          </p>
        </section>

        <section>
          <h2>&#167; 9 Datenschutz</h2>
          <p>
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer{" "}
            <a href="/datenschutz" className="text-amber-600 hover:text-amber-700">Datenschutzerkl&#228;rung</a>.
          </p>
        </section>

        <section>
          <h2>&#167; 10 Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG).
            Gerichtsstand ist Z&#252;rich, Schweiz.
          </p>
          <p>
            F&#252;r Verbraucher aus der EU gelten zus&#228;tzlich die zwingenden Bestimmungen
            des Verbraucherschutzrechts des jeweiligen Wohnsitzstaates, sofern diese g&#252;nstiger sind.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Stand: M&#228;rz 2026</p>
      </div>
    </div>
  );
}
