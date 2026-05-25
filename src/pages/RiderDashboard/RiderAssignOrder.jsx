import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import Pagination from "../../components/Pagination";
import {
  getAssignedOrders,
  markedDelivered,
  markedFailed,
  markedPicked,
} from "../../features/actions/rider/order";
import { ViewAssignedOrderModal } from "../../components/Modal/RiderDashboard/ViewAssignedOrder";
import { Spinner } from "../../components/Loader/Spinner";
import { FailedAssignedOrderModal } from "../../components/Modal/RiderDashboard/FailedAssignedOrder";
import { customerNotification } from "../../features/actions/order";

const RiderAssignOrder = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    orderData,
    orderLoading,
    pickedLoading,
    deliveredLoading,
    failedLoading,
  } = useSelector((state) => state.rider_order);
  const [selected, setSelected] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const payment_status = searchParams.get("payment_status") || "";
  const payment_method = searchParams.get("payment_method") || "";
  const { adminData } = useSelector((state) => state.authentication);
  const loginToken = adminData?.token;
  const users = orderData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;
  const updateParams = ({
    page,
    search,
    status,
    payment_status,
    payment_method,
  }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    if (payment_status !== undefined && payment_status !== "")
      params.payment_status = payment_status;
    if (payment_method !== undefined && payment_method !== "")
      params.payment_method = payment_method;
    setSearchParams(params);
  };

  const getOrderStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200";
      case "picked":
        return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
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
    dispatch(
      getAssignedOrders({
        search: searchQuery,
        page,
        status,
        payment_status,
        payment_method,
      }),
    );
  }, [page, searchQuery, status, payment_status, payment_method]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Your Assigned Orders</h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Type */}
            <div className="flex flex-col w-full md:w-64">
              <FilterSelect
                label="Payment Method"
                value={payment_method || "All"}
                options={[
                  { label: "Online", value: "online" },
                  { label: "Cod", value: "cod" },
                ]}
                onChange={(val) =>
                  updateParams({
                    payment_method: val,
                    payment_status,
                    status,
                    page: 1,
                    search: searchQuery,
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full md:w-64">
              <FilterSelect
                label="Payment Status"
                value={payment_status || "All"}
                options={[
                  { label: "Paid", value: "paid" },
                  { label: "Pending", value: "pending" },
                  { label: "Failed", value: "failed" },
                ]}
                onChange={(val) =>
                  updateParams({
                    payment_status: val,
                    payment_method,
                    status,
                    page: 1,
                    search: searchQuery,
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full md:w-64">
              <FilterSelect
                label="Delivery Status"
                value={status || "All"}
                options={[
                  { label: "Assigned", value: "assigned" },
                  { label: "Picked", value: "picked" },
                  { label: "Delivered", value: "delivered" },
                  { label: "Failed", value: "failed" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
                onChange={(val) =>
                  updateParams({
                    status: val,
                    payment_status,
                    payment_method,
                    page: 1,
                    search: searchQuery,
                  })
                }
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
                <th className="text-left px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[120px]">
                  Payment Method
                </th>
                <th className="text-left px-3 py-3 w-[120px]">
                  Delivery Status
                </th>
                <th className="text-left px-3 py-3 w-[120px]">Price</th>
                <th className="text-center px-3 py-3 w-[350px]">Action</th>
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
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={4}
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
                    key={item?.admin?.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item?.order_number || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700">
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
                          item?.latest_assignment?.delivery_status,
                        )}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                        {item?.latest_assignment?.delivery_status}
                      </span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      ₹{item?.total || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        {/* VIEW */}
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelected(item);
                          }}
                          className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <FiEye />
                        </button>

                        {/* MARKED PICKED */}
                        <button
                          disabled={pickedLoading}
                          onClick={() => {
                            if (
                              item?.status === "cancelled" ||
                              item?.status === "delivered"
                            )
                              return;

                            setSelected(item);
                            dispatch(markedPicked(item?.id))
                              .unwrap()
                              .then(() => {
                                dispatch(
                                  getAssignedOrders({
                                    search: searchQuery,
                                    page,
                                    status,
                                    payment_status,
                                    payment_method,
                                  }),
                                );

                                dispatch(
                                  customerNotification({
                                    payload: {
                                      customer_ids: [item?.customer?.id],
                                      title: "Order Picked",
                                      message:
                                        "Your order has been picked successfully",
                                      type: "order",
                                      extra: { order_id: item?.id },
                                    },
                                    loginToken,
                                  }),
                                );
                              });
                          }}
                          className={`p-2 px-3 flex items-center justify-center gap-2 w-32 rounded-lg
      ${
        item?.status === "cancelled" || item?.status === "delivered"
          ? "invisible"
          : "bg-purple-100 text-purple-500 hover:bg-purple-200"
      }`}
                        >
                          {pickedLoading && item?.id === selected?.id ? (
                            <Spinner />
                          ) : (
                            <span>Marked Picked</span>
                          )}
                        </button>

                        {/* MARKED DELIVERED */}
                        <button
                          disabled={deliveredLoading}
                          onClick={() => {
                            if (
                              item?.status === "cancelled" ||
                              item?.status === "delivered"
                            )
                              return;

                            setSelected(item);
                            dispatch(markedDelivered(item?.id))
                              .unwrap()
                              .then(() => {
                                dispatch(
                                  getAssignedOrders({
                                    search: searchQuery,
                                    page,
                                    status,
                                    payment_status,
                                    payment_method,
                                  }),
                                );

                                dispatch(
                                  customerNotification({
                                    payload: {
                                      customer_ids: [item?.customer?.id],
                                      title: "Order Delivered",
                                      message:
                                        "Your order has been delivered successfully",
                                      type: "order",
                                      extra: { order_id: item?.id },
                                    },
                                    loginToken,
                                  }),
                                );
                              });
                          }}
                          className={`p-2 px-3 flex items-center justify-center gap-2 w-36 rounded-lg
      ${
        item?.status === "cancelled" || item?.status === "delivered"
          ? "invisible"
          : "bg-orange-100 text-orange-500 hover:bg-orange-200"
      }`}
                        >
                          {deliveredLoading && item?.id === selected?.id ? (
                            <Spinner />
                          ) : (
                            <span>Marked Delivered</span>
                          )}
                        </button>

                        {/* MARKED FAILED */}
                        <button
                          disabled={failedLoading}
                          onClick={() => {
                            if (
                              item?.status === "failed" ||
                              item?.status === "cancelled" ||
                              item?.status === "delivered"
                            )
                              return;

                            setSelected(item);
                            setOpenEditModal(true);
                          }}
                          className={`p-2 px-3 flex items-center justify-center gap-2 w-32 rounded-lg
      ${
        item?.status === "failed" ||
        item?.status === "cancelled" ||
        item?.status === "delivered"
          ? "invisible"
          : "bg-red-100 text-red-500 hover:bg-red-200"
      }`}
                        >
                          {failedLoading && item?.id === selected?.id ? (
                            <Spinner />
                          ) : (
                            <span>Marked Failed</span>
                          )}
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
            data={orderData}
            page={page}
            label="orders"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status }}
          />
        )}
      </div>
      <FailedAssignedOrderModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSubmit={(data) => {
          try {
            setOpenEditModal(false);
            dispatch(
              markedFailed({
                id: selected.id,
                reason: data.reason,
              }),
            )
              .unwrap()
              .then(() => {
                dispatch(
                  getAssignedOrders({
                    search: searchQuery,
                    page,
                    status,
                    payment_status,
                    payment_method,
                  }),
                );
                dispatch(
                  customerNotification({
                    payload: {
                      customer_ids: [selected?.customer_id],
                      title: "Order Failed",
                      message: "Your order has been cancelled by rider.",
                      type: "order",
                      extra: {
                        order_id: selected?.id,
                      },
                    },
                    loginToken,
                  }),
                );
              });
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <ViewAssignedOrderModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        order={selected}
      />
    </>
  );
};

export default RiderAssignOrder;
