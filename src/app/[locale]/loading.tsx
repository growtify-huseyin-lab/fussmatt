export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">Laden...</p>
      </div>
    </div>
  );
}
