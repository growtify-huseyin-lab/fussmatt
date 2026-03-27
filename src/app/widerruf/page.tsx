export const dynamic = "force-static";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Widerrufsbelehrung" };
}

export default async function WiderrufPage() {
  return <WiderrufContent />;
}

function WiderrufContent() {

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Widerrufsbelehrung"}</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
          <p className="font-semibold text-amber-800">
            {"Hinweis für Kunden in der Schweiz:"}
          </p>
          <p className="text-amber-700 mt-1">
            In der Schweiz besteht <strong>kein gesetzliches Widerrufsrecht</strong> f&uuml;r Online-K&auml;ufe. Wir bieten Ihnen dennoch ein <strong>freiwilliges 30-Tage-R&uuml;ckgaberecht</strong>.
          </p>
        </div>

        <section>
          <h2>{"Widerrufsrecht für EU-Kunden"}</h2>
          <p>{"Wenn Sie Ihren Wohnsitz in der Europäischen Union haben, steht Ihnen das folgende gesetzliche Widerrufsrecht zu:"}</p>
          <p>
            Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gr&uuml;nden diesen Vertrag zu widerrufen.
          </p>
          <p>{"Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat."}</p>
        </section>

        <section>
          <h2>{"Ausübung des Widerrufsrechts"}</h2>
          <p>{"Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. per E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren."}</p>
          <p>
            <strong>Royal Road GmbH</strong> (FussMatt)<br />
            Dübendorfstrasse 4<br />
            8051 Zürich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>{"Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden."}</p>
        </section>

        <section>
          <h2>{"Folgen des Widerrufs"}</h2>
          <p>{"Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschliesslich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist."}</p>
          <p>{"Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart."}</p>
          <p>{"Wir können die Rückzahlung verweigern, bis wir die Waren zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist."}</p>
          <p>{"Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden."}</p>
          <p>
            <strong>{"Sie tragen die unmittelbaren Kosten der Rücksendung der Waren."}</strong>
          </p>
        </section>

        <section>
          <h2>{"Muster-Widerrufsformular"}</h2>
          <p className="text-sm text-gray-500">
            {"(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)"}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm space-y-3">
            <p>{"An: Royal Road GmbH (FussMatt), Dübendorfstrasse 4, 8051 Zürich, info@fussmatt.com"}</p>
            <p>{"Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):"}</p>
            <p>______________________________________________________</p>
            <p>{"Bestellt am (*) / erhalten am (*): ____________________"}</p>
            <p>{"Name des/der Verbraucher(s): ________________________"}</p>
            <p>{"Anschrift des/der Verbraucher(s): ____________________"}</p>
            <p>{"Datum: ______________________________________________"}</p>
            <p>{"Unterschrift (nur bei Mitteilung auf Papier): _________"}</p>
            <p className="text-xs text-gray-400 mt-4">{"(*) Unzutreffendes streichen."}</p>
          </div>
        </section>

        <p className="text-sm text-gray-500 mt-8">{"Stand: März 2026"}</p>
      </div>
    </div>
  );
}
