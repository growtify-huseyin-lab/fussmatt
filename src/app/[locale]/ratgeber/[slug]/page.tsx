import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { JsonLd, breadcrumbSchema, generateHreflangAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

// TODO: Move to CMS/markdown files when content is written
const GUIDE_CONTENT: Record<string, { title: string; content: string; faq: { q: string; a: string }[] }> = {
  "3d-vs-5d-fussmatten-unterschied": {
    title: "3D vs 5D Fussmatten: Unterschiede, Vorteile und Empfehlung",
    content: `<p>Bei der Wahl der richtigen Auto-Fussmatten stehen viele Autofahrer vor der Frage: <strong>3D oder 5D Fussmatten?</strong> Beide Varianten bieten hervorragenden Schutz, unterscheiden sich aber in wichtigen Details.</p>
<h2>Was sind 3D Fussmatten?</h2>
<p>3D Fussmatten werden per Laserscan millimetergenau f\u00fcr jedes Fahrzeugmodell gefertigt. Sie verf\u00fcgen \u00fcber leicht erh\u00f6hte R\u00e4nder (ca. 2-3 cm), die Schmutz und Feuchtigkeit auffangen.</p>
<h2>Was sind 5D Fussmatten?</h2>
<p>5D Premium Fussmatten bieten zus\u00e4tzlich <strong>h\u00f6here R\u00e4nder</strong> (ca. 5-7 cm) und eine nahtlose Konstruktion. Sie sch\u00fctzen nicht nur den Boden, sondern auch die Seiten des Fussraums.</p>
<h2>Vergleichstabelle</h2>
<table><thead><tr><th>Merkmal</th><th>3D</th><th>5D Premium</th></tr></thead>
<tbody>
<tr><td>Randh\u00f6he</td><td>2-3 cm</td><td>5-7 cm</td></tr>
<tr><td>Schutzlevel</td><td>Gut</td><td>Maximum</td></tr>
<tr><td>Material</td><td>TPE</td><td>TPE</td></tr>
<tr><td>Passform</td><td>Millimetergenau</td><td>Millimetergenau</td></tr>
<tr><td>Empfohlen f\u00fcr</td><td>Normaler Gebrauch</td><td>Familien, Outdoor, Winter</td></tr>
</tbody></table>
<h2>Unsere Empfehlung</h2>
<p>F\u00fcr maximalen Schutz empfehlen wir die <strong>5D Premium Fussmatten</strong>, besonders wenn Sie h\u00e4ufig bei schlechtem Wetter fahren oder Kinder/Haustiere transportieren.</p>`,
    faq: [
      { q: "Was ist der Hauptunterschied zwischen 3D und 5D?", a: "Der Hauptunterschied liegt in der Randh\u00f6he: 5D Matten haben 5-7 cm hohe R\u00e4nder vs. 2-3 cm bei 3D." },
      { q: "Sind 5D Fussmatten teurer?", a: "Ja, 5D Premium Matten kosten ca. 20-30% mehr, bieten daf\u00fcr aber deutlich h\u00f6heren Schutz." },
      { q: "Passen 3D und 5D Matten in jedes Auto?", a: "Beide werden fahrzeugspezifisch gefertigt. W\u00e4hlen Sie einfach Ihre Marke und Modell." },
    ],
  },
};

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_CONTENT[slug];
  if (!guide) return { title: "Artikel nicht gefunden" };
  return {
    title: guide.title,
    alternates: { languages: generateHreflangAlternates(`/ratgeber/${slug}`) },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = GUIDE_CONTENT[slug];
  if (!guide) notFound();

  // FAQ Schema
  const faqSchema = guide.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "" },
        { name: "Ratgeber", url: "/ratgeber" },
        { name: guide.title, url: `/ratgeber/${slug}` },
      ], locale as Locale)} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/ratgeber" className="hover:text-amber-600">Ratgeber</Link>
        </nav>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{guide.title}</h1>

        <div
          className="mt-8 prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-a:text-amber-600 prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* FAQ Section */}
        {guide.faq.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">H&#228;ufig gestellte Fragen</h2>
            <div className="space-y-4">
              {guide.faq.map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
