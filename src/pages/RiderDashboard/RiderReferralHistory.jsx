import { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import TableSkeleton from "../../components/TableSkeleton";
import Pagination from "../../components/Pagination";
import { getRiderReferralHistory } from "../../features/actions/rider/user";

const RiderReferralHistory = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { referralHistoryData, profileLoading } = useSelector(
    (state) => state.rider_user,
  );
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const from_date = searchParams.get("from_date") || "";
  const to_date = searchParams.get("to_date") || "";

  const users = referralHistoryData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;
  const updateParams = ({ page, search, to_date, from_date }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    setSearchParams(params);
  };

  useEffect(() => {
    dispatch(
      getRiderReferralHistory({
        search: searchQuery,
        page,
        to_date,
        from_date,
      }),
    );
  }, [page, searchQuery, to_date, from_date]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Your Referral History</h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
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
                  Referred Customer Name
                </th>
                <th className="text-left px-3 py-3 w-[120px]">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {profileLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                  ]}
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={2} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No reffered user found
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
                      {item?.customer_name || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700">
                      ₹{item?.reward_amount || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!profileLoading && hasData && (
          <Pagination
            data={referralHistoryData}
            page={page}
            label="orders"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, to_date, from_date }}
          />
        )}
      </div>
    </>
  );
};

export default RiderReferralHistory;
