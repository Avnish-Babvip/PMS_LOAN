import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { EditCustomerStatusModal } from "../../components/Modal/Customer/EditCustomerStatus";
import { getAllCustomers } from "../../features/actions/customer";
import { ViewCustomerModal } from "../../components/Modal/Customer/ViewCustomer";

const Customer = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { customerData, customerLoading } = useSelector(
    (state) => state.customer,
  );
  const users = customerData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const [selectedUser, setSelectedUser] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const updateParams = ({ page, search, status }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal) {
      dispatch(
        getAllCustomers({
          search: searchQuery,
          page,
          status,
        }),
      );
    }
  }, [openEditModal, page, searchQuery, status]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Customers</h2>

          <div className="flex gap-3">
            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  page: 1,
                  search: searchQuery,
                })
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[160px]">Username</th>
                <th className="text-left px-3 py-3 w-[260px]">Email</th>
                <th className="text-left px-3 py-3 w-[140px]">Mobile</th>
                <th className="text-left px-3 py-3 w-[140px]">
                  Rider Referral Code
                </th>
                <th className="text-left px-3 py-3 w-[120px]">Status</th>
                <th className="text-center px-3 py-3 w-[150px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {customerLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Username
                    { width: "w-56 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-32 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={7} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No customers found
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
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.username || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700 truncate max-w-[260px]">
                      <span title={item.email}>{item.email || "—"}</span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.mobile || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.used_rider_code || "—"}
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
                            : item.status === "pending"
                              ? "bg-purple-100 text-purple-500"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status || "inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelectedUser({
                              id: item?.id,
                            });
                          }}
                          className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedUser({
                              id: item?.id,
                              status: item?.status,
                            });
                          }}
                          className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          <FiEdit2 />
                          <span>Change Status</span>
                        </button>
                        {/* <button className="p-2 px-3  bg-red-100 text-red-500 rounded-lg hover:bg-red-200">
                          <FiTrash2 />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!customerLoading && hasData && customerData?.meta && (
          <Pagination
            data={customerData.meta}
            page={page}
            label="customers"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status }}
          />
        )}
      </div>

      <EditCustomerStatusModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />

      <ViewCustomerModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        id={selectedUser.id}
      />
    </>
  );
};

export default Customer;
