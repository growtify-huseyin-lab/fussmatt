import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ratgeber | Auto-Fussmatten Wissen",
  description: "Alles \u00fcber Auto-Fussmatten: 3D vs 5D, TPE-Material, Pflege, Kaufberatung. Expertenwissen von FussMatt.",
};

// TODO: Move to CMS/markdown when content is ready
const GUIDES = [
  {
    slug: "3d-vs-5d-fussmatten-unterschied",
    title: "3D vs 5D Fussmatten: Unterschiede, Vorteile und Empfehlung",
    excerpt: "Was ist der Unterschied zwischen 3D und 5D Auto-Fussmatten? Vergleich von Material, Passform und Schutz.",
    category: "Vergleich",
  },
  {
    slug: "tpe-fussmatten-material-vorteile",
    title: "TPE Fussmatten: Warum TPE das beste Material f\u00fcr Auto-Matten ist",
    excerpt: "TPE vs. Gummi vs. Textil \u2013 warum TPE-Fussmatten die bessere Wahl sind. Vorteile, Haltbarkeit, Umwelt.",
    category: "Material",
  },
  {
    slug: "auto-fussmatten-kaufberatung",
    title: "Auto-Fussmatten Kaufberatung: So finden Sie die perfekte Matte",
    excerpt: "Worauf Sie beim Kauf von Auto-Fussmatten achten sollten. Passform, Material, Preis-Leistung im \u00dcberblick.",
    category: "Kaufberatung",
  },
];

export default async function RatgeberPage({ params }: { params: Promise<{ locale: string }> }) {

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Ratgeber</h1>
      <p className="text-gray-500 mb-10">Expertenwissen rund um Auto-Fussmatten, Materialien und Pflege.</p>

      <div className="space-y-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/ratgeber/${guide.slug}`}
            className="block p-6 bg-white border border-gray-200 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              {guide.category}
            </span>
            <h2 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{guide.excerpt}</p>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-gray-400">
        Weitere Ratgeber-Artikel folgen in K&#252;rze.
      </p>
    </div>
  );
}
