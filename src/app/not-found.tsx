import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-black text-gray-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900">{"Seite nicht gefunden"}</h1>
      <p className="mt-3 text-gray-500">{"Die angeforderte Seite existiert nicht oder wurde verschoben."}</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors">
          {"Zur Startseite"}
        </Link>
        <Link href="/produkte" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
          {"Alle Produkte"}
        </Link>
      </div>
    </div>
  );
}
