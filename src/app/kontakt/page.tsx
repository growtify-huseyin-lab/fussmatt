import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Kontakt" };
}

export default async function KontaktPage() {

  return <KontaktContent />;
}

function KontaktContent() {

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{"Kontakt"}</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <p>{"Wir freuen uns auf Ihre Nachricht! Unser Kundenservice steht Ihnen gerne zur Verfügung."}</p>
        </section>

        <section>
          <h2>{"Adresse"}</h2>
          <p>
            <strong>FussMatt</strong><br />
            Royal Road GmbH<br />
            D&#252;bendorfstrasse 4<br />
            8051 Z&#252;rich<br />
            Schweiz
          </p>
        </section>

        <section>
          <h2>{"E-Mail"}</h2>
          <p>
            <a href="mailto:info@fussmatt.com" className="text-amber-600 hover:text-amber-700">
              info@fussmatt.com
            </a>
          </p>
        </section>

        <section>
          <h2>{"Geschäftszeiten"}</h2>
          <p>
            {"Montag – Freitag: 09:00 – 17:00 Uhr"}<br />
            {"Samstag & Sonntag: geschlossen"}
          </p>
          <p>{"E-Mails werden in der Regel innerhalb von 24 Stunden beantwortet."}</p>
        </section>
      </div>
    </div>
  );
}
