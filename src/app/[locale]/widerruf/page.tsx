import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = { title: "Widerrufsbelehrung" };

export default async function WiderrufPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Widerrufsbelehrung</h1>
      <div className="prose prose-gray max-w-none space-y-6">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
          <p className="font-semibold text-amber-800">
            Hinweis f&#252;r Kunden in der Schweiz:
          </p>
          <p className="text-amber-700 mt-1">
            In der Schweiz gibt es kein gesetzliches Widerrufsrecht f&#252;r Online-K&#228;ufe.
            Wir gew&#228;hren Ihnen jedoch freiwillig ein <strong>R&#252;ckgaberecht von 30 Tagen</strong>.
            Siehe &#167; 5 unserer AGB.
          </p>
        </div>

        <section>
          <h2>Widerrufsrecht f&#252;r EU-Kunden</h2>
          <p>
            Wenn Sie Ihren Wohnsitz in der Europ&#228;ischen Union haben, steht Ihnen das folgende
            gesetzliche Widerrufsrecht zu:
          </p>
          <p>
            Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gr&#252;nden
            diesen Vertrag zu widerrufen.
          </p>
          <p>
            Die Widerrufsfrist betr&#228;gt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
            benannter Dritter, der nicht der Bef&#246;rderer ist, die letzte Ware in Besitz genommen
            haben bzw. hat.
          </p>
        </section>

        <section>
          <h2>Aus&#252;bung des Widerrufsrechts</h2>
          <p>
            Um Ihr Widerrufsrecht auszu&#252;ben, m&#252;ssen Sie uns mittels einer eindeutigen
            Erkl&#228;rung (z.B. per E-Mail) &#252;ber Ihren Entschluss, diesen Vertrag zu
            widerrufen, informieren.
          </p>
          <p>
            <strong>Royal Road GmbH</strong> (FussMatt)<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich, Schweiz<br />
            E-Mail: info@fussmatt.com
          </p>
          <p>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung &#252;ber die
            Aus&#252;bung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </p>
        </section>

        <section>
          <h2>Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
            erhalten haben, einschliesslich der Lieferkosten (mit Ausnahme der zus&#228;tzlichen
            Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns
            angebotene, g&#252;nstigste Standardlieferung gew&#228;hlt haben), unverz&#252;glich und
            sp&#228;testens binnen vierzehn Tagen ab dem Tag zur&#252;ckzuzahlen, an dem die
            Mitteilung &#252;ber Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
          </p>
          <p>
            F&#252;r diese R&#252;ckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
            urspr&#252;nglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
            ausdr&#252;cklich etwas anderes vereinbart.
          </p>
          <p>
            Wir k&#246;nnen die R&#252;ckzahlung verweigern, bis wir die Waren zur&#252;ckerhalten
            haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zur&#252;ckgesandt
            haben, je nachdem, welches der fr&#252;here Zeitpunkt ist.
          </p>
          <p>
            Sie haben die Waren unverz&#252;glich und in jedem Fall sp&#228;testens binnen vierzehn
            Tagen ab dem Tag, an dem Sie uns &#252;ber den Widerruf dieses Vertrags unterrichten,
            an uns zur&#252;ckzusenden. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der
            Frist von vierzehn Tagen absenden.
          </p>
          <p>
            <strong>Sie tragen die unmittelbaren Kosten der R&#252;cksendung der Waren.</strong>
          </p>
        </section>

        <section>
          <h2>Muster-Widerrufsformular</h2>
          <p className="text-sm text-gray-500">
            (Wenn Sie den Vertrag widerrufen wollen, f&#252;llen Sie bitte dieses Formular aus
            und senden Sie es zur&#252;ck.)
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm space-y-3">
            <p>An: Royal Road GmbH (FussMatt), D&#252;bendorfstrasse 4, 8051 Z&#252;rich, info@fussmatt.com</p>
            <p>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
              &#252;ber den Kauf der folgenden Waren (*):
            </p>
            <p>______________________________________________________</p>
            <p>Bestellt am (*) / erhalten am (*): ____________________</p>
            <p>Name des/der Verbraucher(s): ________________________</p>
            <p>Anschrift des/der Verbraucher(s): ____________________</p>
            <p>Datum: ______________________________________________</p>
            <p>Unterschrift (nur bei Mitteilung auf Papier): _________</p>
            <p className="text-xs text-gray-400 mt-4">(*) Unzutreffendes streichen.</p>
          </div>
        </section>

        <p className="text-sm text-gray-500 mt-8">Stand: M&#228;rz 2026</p>
      </div>
    </div>
  );
}
