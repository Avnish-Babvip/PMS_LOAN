const TableSkeleton = ({
  rows = 5,
  columns = [],
  actionColumn = false,
  actionCount = 2,
  actionAlign = "justify-center",
  actionWidth = "w-16",
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-t border-gray-100 animate-pulse">
          {/* DATA COLUMNS */}
          {columns.map((col, colIndex) => (
            <td key={colIndex} className={`px-4 py-4 ${col.align || ""}`}>
              {col.count && col.count > 1 ? (
                /* MULTI ITEMS (chips / tags) */
                <div
                  className={`flex gap-2 ${
                    col.wrap ? "flex-wrap" : "items-center"
                  }`}
                >
                  {Array.from({ length: col.count }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        h-4 rounded-md bg-gray-200
                        ${col.itemWidth || "w-16"}
                      `}
                    />
                  ))}
                </div>
              ) : (
                /* SINGLE COLUMN */
                <div
                  className={`
                    h-4 rounded-md bg-gray-200
                    ${col.width || "w-full"}
                  `}
                />
              )}
            </td>
          ))}

          {/* ACTION COLUMN */}
          {actionColumn && (
            <td className="px-4 py-4">
              <div className={`flex gap-2 ${actionAlign}`}>
                {Array.from({ length: actionCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-8 rounded-lg bg-gray-200
                      ${actionWidth}
                    `}
                  />
                ))}
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
