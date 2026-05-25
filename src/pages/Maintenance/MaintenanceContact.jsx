import { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import { getMaintenanceContact } from "../../features/actions/maintenance";

const MaintenanceContact = () => {
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { contactData, maintenanceLoading } = useSelector(
    (state) => state.maintenance,
  );
  const users = contactData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const page = Number(searchParams.get("page")) || 1;

  const updateParams = ({ page }) => {
    const params = {};
    if (page) params.page = page;
    setSearchParams(params);
  };

  useEffect(() => {
    dispatch(
      getMaintenanceContact({
        page,
      }),
    );
  }, [page]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">
            All Maintenance Contacts
          </h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Name</th>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Email</th>
                <th className="text-left px-3 py-3 w-[140px]">Phone</th>
                <th className="text-left px-3 py-3 w-[140px]">Message</th>
                <th className="text-left px-3 py-3 w-[120px]">Contacted At</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {maintenanceLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Username
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-56 h-4" }, // Email
                    { width: "w-20 h-4" }, // Status
                  ]}
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={5} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No contact found
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
                      {item.name || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.mobile || "—"}
                    </td>
                    <td
                      className="truncate cursor-pointer px-3 py-5 text-gray-700"
                      title={item.message}
                    >
                      {item.message || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {formatDate(item.created_at) || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!maintenanceLoading && hasData && contactData && (
          <Pagination
            data={contactData}
            page={page}
            label="customers"
            onPageChange={updateParams}
          />
        )}
      </div>
    </>
  );
};

export default MaintenanceContact;
