export const dynamic = "force-static";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Versand & Lieferung" };
}

export default async function VersandPage() {

  return <VersandContent />;
}

function VersandContent() {

  const countries = [
    { name: "Schweiz", days: "2-4 Werktage" },
    { name: "Deutschland", days: "3-5 Werktage" },
    { name: "\u00d6sterreich", days: "3-5 Werktage" },
    { name: "Frankreich", days: "4-7 Werktage" },
    { name: "Italien", days: "4-7 Werktage" },
    { name: "Niederlande", days: "3-5 Werktage" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Versand & Lieferung"}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>{"Versandkosten"}</h2>
          <p>{"Wir bieten kostenlosen Versand für alle Bestellungen in folgende Länder:"}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-8">{"Land"}</th>
                  <th className="text-left py-2 pr-8">{"Versandkosten"}</th>
                  <th className="text-left py-2">{"Lieferzeit"}</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.name}>
                    <td className="py-2 pr-8">{c.name}</td>
                    <td className="py-2 pr-8">Kostenlos</td>
                    <td className="py-2">{c.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>{"Versandpartner"}</h2>
          <p>{"Wir versenden mit zuverlässigen Logistikpartnern. Nach dem Versand erhalten Sie eine Sendungsverfolgungsnummer per E-Mail."}</p>
        </section>

        <section>
          <h2>{"Bearbeitungszeit"}</h2>
          <p>{"Bestellungen, die vor 14:00 Uhr eingehen, werden in der Regel am selben Werktag bearbeitet. Die angegebenen Lieferzeiten beginnen ab Versand."}</p>
        </section>

        <section>
          <h2>{"Fragen zum Versand?"}</h2>
          <p>
            {"Kontaktieren Sie uns unter"}{" "}
            <a href="mailto:info@fussmatt.com" className="text-amber-600 hover:text-amber-700">
              info@fussmatt.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
