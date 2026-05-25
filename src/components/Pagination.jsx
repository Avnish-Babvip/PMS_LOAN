const Pagination = ({
  data,
  page,
  onPageChange,
  extraParams = {},
  label = "items",
}) => {
  if (!data || data.last_page <= 1) return null;

  const totalPages = data.last_page;
  const windowSize = 5;

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 pt-3 pb-5">
      {/* INFO */}
      <p className="text-sm text-gray-400">
        Showing {data.from}–{data.to} of {data.total} {label}
      </p>

      {/* PAGINATION */}
      <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden bg-white">
        {/* PREVIOUS */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange({ page: page - 1, ...extraParams })}
          className={`px-4 py-2 text-sm border-r border-gray-300 transition
            ${
              page === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          Previous
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange({ page: p, ...extraParams })}
            className={`px-4 py-2 text-sm border-r border-gray-300 transition
              ${
                p === page
                  ? "bg-orange-500 text-white font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {p}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange({ page: page + 1, ...extraParams })}
          className={`px-4 py-2 text-sm transition
            ${
              page === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
