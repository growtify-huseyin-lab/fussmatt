import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Datenschutzerklärung" };
}

export default async function DatenschutzPage() {
  return <DatenschutzContent />;
}

function DatenschutzContent() {

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Datenschutzerklärung"}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <section>
          <h2>{"1. Verantwortliche Stelle"}</h2>
          <p>
            <strong>Royal Road GmbH</strong> ({"«FussMatt»"})<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>{"Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und halten uns an die Regeln des Schweizer Datenschutzgesetzes (DSG) sowie der EU-Datenschutz-Grundverordnung (DSGVO), soweit diese auf uns anwendbar ist."}</p>
        </section>

        <section>
          <h2>{"2. Erhebung und Verarbeitung personenbezogener Daten"}</h2>
          <p>{"Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen einer Bestellung, Kontaktaufnahme oder Registrierung freiwillig mitteilen. Dazu gehören:"}</p>
          <ul>
            <li>{"Vor- und Nachname"}</li>
            <li>{"E-Mail-Adresse"}</li>
            <li>{"Rechnungs- und Lieferadresse"}</li>
            <li>{"Telefonnummer (optional)"}</li>
            <li>{"Zahlungsinformationen (werden direkt vom Zahlungsanbieter verarbeitet)"}</li>
          </ul>
        </section>

        <section>
          <h2>{"3. Zweck der Datenverarbeitung"}</h2>
          <p>{"Wir verwenden Ihre Daten ausschliesslich für:"}</p>
          <ul>
            <li>{"Abwicklung Ihrer Bestellungen und Lieferung"}</li>
            <li>{"Kundenkommunikation und Support"}</li>
            <li>{"Rechnungsstellung"}</li>
            <li>{"Verbesserung unserer Website und Dienste"}</li>
            <li>{"Erfüllung gesetzlicher Pflichten"}</li>
          </ul>
        </section>

        <section>
          <h2>{"4. Cookies"}</h2>
          <p>{"Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf Ihrem Endgerät gespeichert werden."}</p>
          <h3>{"Notwendige Cookies"}</h3>
          <p>{"Diese Cookies sind für den Betrieb der Website erforderlich (z.B. Warenkorb, Spracheinstellungen). Sie können nicht deaktiviert werden."}</p>
          <h3>{"Analyse-Cookies"}</h3>
          <p>{"Mit Ihrer Einwilligung setzen wir Analyse-Cookies ein, um die Nutzung unserer Website zu verstehen und zu verbessern. Sie können diese Cookies über unseren Cookie-Banner ablehnen."}</p>
        </section>

        <section>
          <h2>{"5. Google Analytics"}</h2>
          <p>{"Diese Website nutzt Google Analytics (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics verwendet Cookies zur Analyse der Websitenutzung. Die durch das Cookie erzeugten Informationen werden an einen Server von Google übertragen und dort gespeichert."}</p>
          <p><strong>{"IP-Anonymisierung: Auf dieser Website ist die IP-Anonymisierung aktiviert. Ihre IP-Adresse wird vor der Übermittlung gekürzt."}</strong></p>
          <p>{"Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO / Art. 31 Abs. 1 DSG)."}</p>
        </section>

        <section>
          <h2>{"6. Zahlungsanbieter"}</h2>
          <p>{"Für die Zahlungsabwicklung nutzen wir folgende Drittanbieter:"}</p>
          <ul>
            <li><strong>Stripe</strong> {"(Stripe Payments Europe, Ltd.) – Kreditkartenzahlungen"}</li>
            <li><strong>PayPal</strong> {"(PayPal (Europe) S.à r.l. et Cie, S.C.A.) – PayPal-Zahlungen"}</li>
          </ul>
          <p>{"Ihre Zahlungsdaten werden direkt an den jeweiligen Zahlungsanbieter übermittelt und dort gemäss deren Datenschutzrichtlinien verarbeitet. Wir speichern keine Kreditkartennummern oder Bankdaten."}</p>
        </section>

        <section>
          <h2>{"7. Datenweitergabe an Dritte"}</h2>
          <p>{"Wir geben Ihre personenbezogenen Daten nur weiter, wenn dies für die Vertragserfüllung notwendig ist:"}</p>
          <ul>
            <li>{"Versanddienstleister (DHL, DPD) für die Lieferung"}</li>
            <li>{"Zahlungsanbieter für die Zahlungsabwicklung"}</li>
            <li>{"Buchhalter / Steuerberater für die gesetzlich vorgeschriebene Buchhaltung"}</li>
          </ul>
        </section>

        <section>
          <h2>{"8. Datensicherheit"}</h2>
          <p>{"Wir verwenden angemessene technische und organisatorische Sicherheitsmassnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulation, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen. Unsere Website verwendet SSL-Verschlüsselung."}</p>
        </section>

        <section>
          <h2>{"9. Ihre Rechte"}</h2>
          <p>{"Sie haben jederzeit das Recht auf:"}</p>
          <ul>
            <li>{"Auskunft über Ihre gespeicherten Daten"}</li>
            <li>{"Berichtigung unrichtiger Daten"}</li>
            <li>{"Löschung Ihrer Daten"}</li>
            <li>{"Einschränkung der Verarbeitung"}</li>
            <li>{"Datenübertragbarkeit"}</li>
            <li>{"Widerspruch gegen die Verarbeitung"}</li>
            <li>{"Widerruf Ihrer Einwilligung"}</li>
          </ul>
          <p>{"Bitte richten Sie Ihre Anfragen an: info@fussmatt.com"}</p>
          <p>{"Sie haben zudem das Recht, eine Beschwerde beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) einzureichen."}</p>
        </section>

        <section>
          <h2>{"10. Aufbewahrungsdauer"}</h2>
          <p>{"Wir speichern Ihre Daten nur so lange, wie dies für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen (in der Regel 10 Jahre gemäss Schweizer OR)."}</p>
        </section>

        <section>
          <h2>{"11. Änderungen"}</h2>
          <p>{"Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen. Die aktuelle Version ist stets auf unserer Website verfügbar."}</p>
          <p className="text-sm text-gray-500">{"Stand: März 2026"}</p>
        </section>
      </div>
    </div>
  );
}
