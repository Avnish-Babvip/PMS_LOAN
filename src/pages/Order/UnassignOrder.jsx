import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import { EditOrderStatusModal } from "../../components/Modal/Order/EditOrderStatus";
import { getAllNotAssignOrders } from "../../features/actions/order";
import { ViewUnassignedOrderModal } from "../../components/Modal/Order/ViewUnassignOrder";
import { AssignOrderModal } from "../../components/Modal/Order/AssignOrder";
import { TbTruckDelivery } from "react-icons/tb";

const UnassignOrder = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { unassignedOrderData, orderLoading } = useSelector(
    (state) => state.order,
  );
  const blockedStatuses = ["failed", "delivered", "shipped", "cancelled"];
  const [selectedUser, setSelectedUser] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const from_date = searchParams.get("from_date") || "";
  const to_date = searchParams.get("to_date") || "";

  const users = unassignedOrderData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;
  const updateParams = ({ page, search, from_date, to_date }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    setSearchParams(params);
  };

  const getOrderStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-600 ring-1 ring-red-200";
      case "failed":
        return "bg-red-100 text-red-600 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    }
  };

  const getPaymentMethodStyle = (method) => {
    switch (method?.toLowerCase()) {
      case "online":
        return "bg-purple-100 text-purple-700 ring-1 ring-purple-200";
      case "cod":
        return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
      default:
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    }
  };

  useEffect(() => {
    if (!openEditModal && !openAssignModal) {
      dispatch(
        getAllNotAssignOrders({
          search: searchQuery,
          page,
          from_date,
          to_date,
        }),
      );
    }
  }, [openEditModal, openAssignModal, page, searchQuery, from_date, to_date]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Unassigned Orders</h2>

          <div className="flex items-end gap-4">
            {/* From Date */}
            <div className="flex flex-col">
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col">
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left  ps-5  px-3 py-3 w-[120px]">
                  Order Number
                </th>
                <th className="text-left px-3 py-3 w-[140px]">Customer Name</th>
                <th className="text-left px-3 py-3 w-[95px]">Pay Method</th>
                <th className="text-left px-3 py-3 w-[100px]">Order Status</th>
                <th className="text-left px-3 py-3 w-[110px]">Price</th>
                <th className="text-center px-3 py-3 w-[400px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orderLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                    { width: "w-18 h-4" }, // Email
                    { width: "w-18 h-4" }, // Mobile
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={3}
                  actionWidth="w-12 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={6} className="py-28">
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
                    <td className="ps-5 px-3 py-5  text-gray-700">
                      {item?.order_number || "—"}
                    </td>
                    <td className="px-3 truncate py-5 text-gray-700">
                      {item?.customer?.name || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm capitalize ${getPaymentMethodStyle(
                          item?.payment_method,
                        )}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                        {item?.payment_method || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm capitalize ${getOrderStatusStyle(
                          item?.status,
                        )}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                        {item?.status}
                      </span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      ₹{item?.total || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelectedUser(item);
                          }}
                          className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() => {
                            setOpenAssignModal(true);
                            setSelectedUser({
                              id: item?.id,
                              city: item?.address_snapshot?.shipping?.city,
                              customerId: item?.customer_id,
                            });
                          }}
                          className="p-2 px-3 w-[148px] justify-center flex items-center gap-2 bg-indigo-100 text-indigo-500 rounded-lg hover:bg-indigo-200"
                        >
                          <TbTruckDelivery />
                          {item.status === "failed" ? (
                            <span>Re-Assign Rider</span>
                          ) : (
                            <span>Assign Rider</span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (!blockedStatuses.includes(item?.status)) {
                              setOpenEditModal(true);
                              setSelectedUser({
                                id: item?.id,
                                status: item?.status,
                                customerId: item?.customer?.id,
                              });
                            }
                          }}
                          className={`p-2 px-3 flex items-center gap-2 w-36 rounded-lg 
        ${
          blockedStatuses.includes(item?.status)
            ? "invisible"
            : "bg-orange-100 text-orange-500 hover:bg-orange-200"
        }`}
                        >
                          <FiEdit2 />
                          <span>Change Status</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!orderLoading && hasData && (
          <Pagination
            data={unassignedOrderData}
            page={page}
            label="orders"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery }}
          />
        )}
      </div>
      <EditOrderStatusModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
      <AssignOrderModal
        isOpen={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        id={selectedUser?.id}
        city={selectedUser?.city}
        customerId={selectedUser?.customerId}
      />
      <ViewUnassignedOrderModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        data={selectedUser}
      />
    </>
  );
};

export default UnassignOrder;
