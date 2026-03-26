export default function ProdukteLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="mt-2 h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="h-10 bg-gray-100 rounded-xl mb-4 animate-pulse" />
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </aside>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
