export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-full bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse mt-4" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="flex gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-28 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-12 w-full bg-amber-100 rounded-xl animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}
