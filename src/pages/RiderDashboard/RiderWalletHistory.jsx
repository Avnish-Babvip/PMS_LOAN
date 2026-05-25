import { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import Pagination from "../../components/Pagination";
import { getRiderWalletHistory } from "../../features/actions/rider/wallet";

const RiderWalletHistory = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletHistoryData, walletLoading } = useSelector(
    (state) => state.rider_wallet,
  );
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const from_date = searchParams.get("from_date") || "";
  const to_date = searchParams.get("to_date") || "";

  const users = walletHistoryData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;
  const updateParams = ({ page, search, type, to_date, from_date }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (type !== undefined && type !== "") params.type = type;
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    setSearchParams(params);
  };

  const getPaymentMethodStyle = (method) => {
    switch (method?.toLowerCase()) {
      case "credit":
        return "bg-lime-100 text-lime-700 ring-1 ring-lime-200";
      case "debit":
        return "bg-red-100 text-red-700 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    }
  };

  useEffect(() => {
    dispatch(
      getRiderWalletHistory({
        search: searchQuery,
        page,
        type,
        to_date,
        from_date,
      }),
    );
  }, [page, searchQuery, type, to_date, from_date]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">
            Your Wallet Transaction History
          </h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Type */}
            <div className="flex flex-col w-full md:w-48">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Type
              </label>
              <FilterSelect
                value={type || ""}
                options={[
                  { label: "Credit", value: "credit" },
                  { label: "Debit", value: "debit" },
                ]}
                onChange={(val) =>
                  updateParams({
                    type: val,
                    from_date,
                    to_date,
                    page: 1,
                    search: searchQuery,
                  })
                }
              />
            </div>

            {/* From Date */}
            <div className="flex flex-col w-full md:w-48">
              <label className="text-xs font-medium text-gray-500 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={from_date}
                onChange={(e) =>
                  updateParams({
                    page: 1,
                    type,
                    search: searchQuery,
                    from_date: e.target.value,
                    to_date,
                  })
                }
                className="h-[42px] border border-gray-300 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col w-full md:w-48">
              <label className="text-xs font-medium text-gray-500 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={to_date}
                min={from_date}
                onChange={(e) =>
                  updateParams({
                    page: 1,
                    search: searchQuery,
                    type,
                    from_date,
                    to_date: e.target.value,
                  })
                }
                className="h-[42px] border border-gray-300 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left  ps-5  px-3 py-3 w-[160px]">
                  Order Number
                </th>
                <th className="text-left px-3 py-3 w-[120px]">Description</th>
                <th className="text-left px-3 py-3 w-[120px]">Type</th>
                <th className="text-left px-3 py-3 w-[120px]">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {walletLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                  ]}
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={4} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No orders found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                users.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item?.order_number || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700">
                      {item?.description || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm capitalize ${getPaymentMethodStyle(
                          item?.type,
                        )}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                        {item?.type || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      ₹{item?.amount || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!walletLoading && hasData && (
          <Pagination
            data={walletHistoryData}
            page={page}
            label="orders"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, type, to_date, from_date }}
          />
        )}
      </div>
    </>
  );
};

export default RiderWalletHistory;
