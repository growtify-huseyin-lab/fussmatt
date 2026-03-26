"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  /** Extra query params to preserve (e.g. kategorie, suche) */
  queryParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, queryParams = {} }: PaginationProps) {

  if (totalPages <= 1) return null;

  function buildUrl(page: number): string {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (page > 1) params.set("seite", String(page));
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  // Show max 7 page buttons with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <a href={buildUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          &larr; Zur&uuml;ck
        </a>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          &larr; Zur&uuml;ck
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-2 py-2 text-sm text-gray-400">&hellip;</span>
        ) : p === currentPage ? (
          <span key={p} className="px-3.5 py-2 text-sm font-bold text-white bg-amber-500 rounded-lg shadow-sm">
            {p}
          </span>
        ) : (
          <a key={p} href={buildUrl(p)}
            className="px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors">
            {p}
          </a>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <a href={buildUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Weiter &rarr;
        </a>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          Weiter &rarr;
        </span>
      )}
    </nav>
  );
}
