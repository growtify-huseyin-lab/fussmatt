import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = { title: "Datenschutzerkl\u00e4rung" };

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerkl&#228;rung</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>1. Verantwortliche Stelle</h2>
          <p>
            <strong>Royal Road GmbH</strong> (&#171;FussMatt&#187;)<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>
            Wir nehmen den Schutz Ihrer pers&#246;nlichen Daten sehr ernst und halten uns an die
            Regeln des Schweizer Datenschutzgesetzes (DSG) sowie der EU-Datenschutz-Grundverordnung
            (DSGVO), soweit diese auf uns anwendbar ist.
          </p>
        </section>

        <section>
          <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>
            Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen einer Bestellung,
            Kontaktaufnahme oder Registrierung freiwillig mitteilen. Dazu geh&#246;ren:
          </p>
          <ul>
            <li>Vor- und Nachname</li>
            <li>E-Mail-Adresse</li>
            <li>Rechnungs- und Lieferadresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Zahlungsinformationen (werden direkt vom Zahlungsanbieter verarbeitet)</li>
          </ul>
        </section>

        <section>
          <h2>3. Zweck der Datenverarbeitung</h2>
          <p>Wir verwenden Ihre Daten ausschliesslich f&#252;r:</p>
          <ul>
            <li>Abwicklung Ihrer Bestellungen und Lieferung</li>
            <li>Kundenkommunikation und Support</li>
            <li>Rechnungsstellung</li>
            <li>Verbesserung unserer Website und Dienste</li>
            <li>Erf&#252;llung gesetzlicher Pflichten</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf
            Ihrem Endger&#228;t gespeichert werden.
          </p>
          <h3>Notwendige Cookies</h3>
          <p>
            Diese Cookies sind f&#252;r den Betrieb der Website erforderlich (z.B. Warenkorb,
            Spracheinstellungen). Sie k&#246;nnen nicht deaktiviert werden.
          </p>
          <h3>Analyse-Cookies</h3>
          <p>
            Mit Ihrer Einwilligung setzen wir Analyse-Cookies ein, um die Nutzung unserer Website
            zu verstehen und zu verbessern. Sie k&#246;nnen diese Cookies &#252;ber unseren
            Cookie-Banner ablehnen.
          </p>
        </section>

        <section>
          <h2>5. Google Analytics</h2>
          <p>
            Diese Website nutzt Google Analytics (Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland). Google Analytics verwendet Cookies zur Analyse der Websitenutzung.
            Die durch das Cookie erzeugten Informationen werden an einen Server von Google &#252;bertragen
            und dort gespeichert.
          </p>
          <p>
            <strong>IP-Anonymisierung:</strong> Auf dieser Website ist die IP-Anonymisierung aktiviert.
            Ihre IP-Adresse wird vor der &#220;bermittlung gek&#252;rzt.
          </p>
          <p>
            Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO / Art. 31 Abs. 1 DSG).
          </p>
        </section>

        <section>
          <h2>6. Zahlungsanbieter</h2>
          <p>
            F&#252;r die Zahlungsabwicklung nutzen wir folgende Drittanbieter:
          </p>
          <ul>
            <li><strong>Stripe</strong> (Stripe Payments Europe, Ltd.) &#8211; Kreditkartenzahlungen</li>
            <li><strong>PayPal</strong> (PayPal (Europe) S.&#224; r.l. et Cie, S.C.A.) &#8211; PayPal-Zahlungen</li>
          </ul>
          <p>
            Ihre Zahlungsdaten werden direkt an den jeweiligen Zahlungsanbieter &#252;bermittelt und
            dort gem&#228;ss deren Datenschutzrichtlinien verarbeitet. Wir speichern keine
            Kreditkartennummern oder Bankdaten.
          </p>
        </section>

        <section>
          <h2>7. Datenweitergabe an Dritte</h2>
          <p>
            Wir geben Ihre personenbezogenen Daten nur weiter, wenn dies f&#252;r die
            Vertragserf&#252;llung notwendig ist:
          </p>
          <ul>
            <li>Versanddienstleister (DHL, DPD) f&#252;r die Lieferung</li>
            <li>Zahlungsanbieter f&#252;r die Zahlungsabwicklung</li>
            <li>Buchhalter / Steuerberater f&#252;r die gesetzlich vorgeschriebene Buchhaltung</li>
          </ul>
        </section>

        <section>
          <h2>8. Datensicherheit</h2>
          <p>
            Wir verwenden angemessene technische und organisatorische Sicherheitsmassnahmen, um Ihre
            Daten gegen zuf&#228;llige oder vors&#228;tzliche Manipulation, Verlust, Zerst&#246;rung
            oder den Zugriff unberechtigter Personen zu sch&#252;tzen. Unsere Website verwendet
            SSL-Verschl&#252;sselung.
          </p>
        </section>

        <section>
          <h2>9. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft &#252;ber Ihre gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>L&#246;schung Ihrer Daten</li>
            <li>Einschr&#228;nkung der Verarbeitung</li>
            <li>Daten&#252;bertragbarkeit</li>
            <li>Widerspruch gegen die Verarbeitung</li>
            <li>Widerruf Ihrer Einwilligung</li>
          </ul>
          <p>
            Bitte richten Sie Ihre Anfragen an: info@fussmatt.com
          </p>
          <p>
            Sie haben zudem das Recht, eine Beschwerde beim Eidgen&#246;ssischen Datenschutz- und
            &#214;ffentlichkeitsbeauftragten (ED&#214;B) einzureichen.
          </p>
        </section>

        <section>
          <h2>10. Aufbewahrungsdauer</h2>
          <p>
            Wir speichern Ihre Daten nur so lange, wie dies f&#252;r die Erf&#252;llung des jeweiligen
            Zwecks erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen
            (in der Regel 10 Jahre gem&#228;ss Schweizer OR).
          </p>
        </section>

        <section>
          <h2>11. &#196;nderungen</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerkl&#228;rung jederzeit anzupassen. Die aktuelle
            Version ist stets auf unserer Website verf&#252;gbar.
          </p>
          <p className="text-sm text-gray-500">Stand: M&#228;rz 2026</p>
        </section>
      </div>
    </div>
  );
}
