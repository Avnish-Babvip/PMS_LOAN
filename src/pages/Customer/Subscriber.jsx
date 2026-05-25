import { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import { getAllSubscribers } from "../../features/actions/customer";

const Subscriber = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscriberData, customerLoading } = useSelector(
    (state) => state.customer,
  );
  const users = subscriberData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const updateParams = ({ page, search }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    setSearchParams(params);
  };

  useEffect(() => {
    dispatch(
      getAllSubscribers({
        search: searchQuery,
        page,
      }),
    );
  }, [page, searchQuery]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Email Subscriber</h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Email</th>
                <th className="text-left px-3 py-3 w-[140px]">IP Address</th>
                <th className="text-left px-3 py-3 w-[120px]">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {customerLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-32 h-4" }, // Name
                    { width: "w-20 h-4" }, // Status
                  ]}
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={3} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No subscriber found
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
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 py-5 text-gray-700 truncate max-w-[260px]">
                      <span title={item.email}>{item.email || "—"}</span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.ip_address || "—"}
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status ? "active" : "inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!customerLoading && hasData && subscriberData && (
          <Pagination
            data={subscriberData}
            page={page}
            label="customers"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery }}
          />
        )}
      </div>
    </>
  );
};

export default Subscriber;
