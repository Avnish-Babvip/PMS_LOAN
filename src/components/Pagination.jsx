const Pagination = ({
  data,
  page,
  onPageChange,
  extraParams = {},
  label = "items",
}) => {
  if (!data || data.last_page <= 1) return null;

  const totalPages = data.total_pages || data.last_page;
  const windowSize = 5;

  const from = (data.current_page - 1) * data.per_page + 1 || data.from;

  const to = Math.min(data.current_page * data.per_page, data.total) || data.to;

  // 🔢 Calculate page window safely
  let startPage = Math.max(1, page - Math.floor(windowSize / 2));
  let endPage = startPage + windowSize - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* INFO */}
      <div>
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{from}</span> –{" "}
          <span className="font-semibold text-gray-800">{to}</span> of{" "}
          <span className="font-semibold text-orange-600">{data.total}</span>{" "}
          {label}
        </p>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Previous */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange({ page: page - 1, ...extraParams })}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
          ${
            page === 1
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
          }`}
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange({ page: p, ...extraParams })}
            className={`min-w-[42px] rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200
            ${
              p === page
                ? "bg-gradient-to-r from-[#EF4444] to-[#89101C] text-white shadow-lg shadow-orange-200"
                : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:-translate-y-0.5 hover:border-orange-300 hover:text-[#EF4444] hover:shadow-md"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange({ page: page + 1, ...extraParams })}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
          ${
            page === totalPages
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
