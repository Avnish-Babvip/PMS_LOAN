import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import { EditOrderStatusModal } from "../../components/Modal/Order/EditOrderStatus";
import {
  getAllOrders,
  multipleOrderPrint,
  singleOrderPrint,
} from "../../features/actions/order";
import FilterSelect from "../../components/FilterSelect";
import { ViewOrderModal } from "../../components/Modal/Order/ViewOrder";
import { FaReceipt } from "react-icons/fa";
import { Spinner } from "../../components/Loader/Spinner";

const Order = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orderData, orderLoading, printLoading, multiplePrintLoading } =
    useSelector((state) => state.order);
  const [selectedUser, setSelectedUser] = useState({});
  console.log(selectedUser);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const payment_status = searchParams.get("payment_status") || "";
  const payment_method = searchParams.get("payment_method") || "";
  const period = searchParams.get("period") || "";
  const from_date = searchParams.get("from_date") || "";
  const to_date = searchParams.get("to_date") || "";

  const users = orderData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;
  const updateParams = ({
    page,
    search,
    status,
    payment_status,
    payment_method,
    period,
    from_date,
    to_date,
  }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    if (payment_status !== undefined && payment_status !== "")
      params.payment_status = payment_status;
    if (payment_method !== undefined && payment_method !== "")
      params.payment_method = payment_method;
    if (period !== undefined && period !== "") params.period = period;
    if (to_date !== undefined && to_date !== "") params.to_date = to_date;
    if (from_date !== undefined && from_date !== "")
      params.from_date = from_date;
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

  const [selectedOrders, setSelectedOrders] = useState([]);
  const toggleOrderSelection = (id) => {
    const order = users.find((o) => o.id === id);
    if (!isSelectableOrder(order?.status)) return;

    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    const selectableOrders = users
      .filter((item) => isSelectableOrder(item.status))
      .map((item) => item.id);

    if (selectedOrders.length === selectableOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(selectableOrders);
    }
  };

  const isSelectableOrder = (status) =>
    status === "confirmed" || status === "shipped";

  const handleMultiplePrint = () => {
    dispatch(multipleOrderPrint({ order_ids: selectedOrders }))
      .unwrap()
      .then((res) => {
        const blob = new Blob([res], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `orders_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSelectedOrders([]);
      });
  };

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(
        getAllOrders({
          search: searchQuery,
          page,
          status,
          payment_status,
          payment_method,
          period,
          from_date,
          to_date,
        }),
      );
    }
  }, [
    openModal,
    openEditModal,
    page,
    searchQuery,
    status,
    payment_status,
    payment_method,
    period,
    from_date,
    to_date,
  ]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-800">All Orders</h2>

            {selectedOrders.length > 0 && (
              <button
                onClick={handleMultiplePrint}
                className="flex items-center gap-2 bg-purple-100 text-purple-600 px-3 py-1.5 rounded-lg"
              >
                <FaReceipt />
                Print {selectedOrders.length} orders
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
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
                  from_date,
                  to_date,
                  period,
                })
              }
            />

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
                  from_date,
                  to_date,
                  period,
                })
              }
            />

            <FilterSelect
              label="Order Status"
              value={status || "All"}
              options={[
                { label: "Placed", value: "placed" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Failed", value: "failed" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  payment_status,
                  payment_method,
                  page: 1,
                  search: searchQuery,
                  from_date,
                  to_date,
                  period,
                })
              }
            />

            <FilterSelect
              label="Period"
              value={period || "All"}
              options={[
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              onChange={(val) =>
                updateParams({
                  period: val,
                  status,
                  payment_status,
                  payment_method,
                  page: 1,
                  search: searchQuery,
                  from_date,
                  to_date,
                })
              }
            />

            {/* From Date */}
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={from_date}
                onChange={(e) =>
                  updateParams({
                    period,
                    status,
                    payment_status,
                    payment_method,
                    page: 1,
                    search: searchQuery,
                    from_date: e.target.value,
                    to_date,
                  })
                }
                className="border border-gray-300  rounded-xl
        shadow-sm  px-3 py-2 text-sm text-gray-800 focus:outline-none"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={to_date}
                min={from_date}
                onChange={(e) =>
                  updateParams({
                    period,
                    status,
                    payment_status,
                    payment_method,
                    page: 1,
                    search: searchQuery,
                    from_date,
                    to_date: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      users.filter((i) => isSelectableOrder(i.status)).length >
                        0 &&
                      selectedOrders.length ===
                        users.filter((i) => isSelectableOrder(i.status)).length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left   px-3 py-3 w-[120px]">
                  Order Number
                </th>
                <th className="text-left px-3 py-3 w-[120px]">Customer Name</th>
                <th className="text-left px-3 py-3 w-[95px]">Pay Method</th>
                <th className="text-left px-3 py-3 w-[100px]">Order Status</th>
                <th className="text-left px-3 py-3 w-[100px]">Rider Name</th>
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
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-20 h-4" }, // Status
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={2}
                  actionWidth="w-12 h-8"
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
                      <input
                        type="checkbox"
                        disabled={!isSelectableOrder(item.status)}
                        checked={selectedOrders.includes(item.id)}
                        onChange={() => toggleOrderSelection(item.id)}
                        className={
                          !isSelectableOrder(item.status)
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }
                      />
                    </td>
                    <td className=" px-3 py-5 text-gray-700">
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

                    <td className="px-3 text-gray-800 py-5">
                      {item.assignment?.rider?.admin?.name || "NA"}
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      ₹{item?.total || "—"}
                    </td>

                    <td className="px-3 py-5 ">
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
                            setSelectedUser(item);
                            dispatch(singleOrderPrint(item?.id))
                              .unwrap()
                              .then((res) => {
                                const file = new Blob([res], {
                                  type: "application/pdf",
                                });
                                const fileURL = URL.createObjectURL(file);
                                window.open(fileURL, "_blank");
                              });
                          }}
                          className={`p-2 flex justify-center items-center gap-2 w-28 bg-purple-100 text-purple-500 rounded-lg hover:bg-purple-200 ${
                            item?.status === "confirmed" ||
                            item?.status === "shipped"
                              ? ""
                              : "invisible pointer-events-none"
                          }`}
                        >
                          {printLoading && selectedUser?.id === item?.id ? (
                            <Spinner />
                          ) : (
                            <>
                              {" "}
                              <FaReceipt />
                              <span>Print Order</span>
                            </>
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
            extraParams={{
              search: searchQuery,
              status,
              payment_method,
              payment_status,
              period,
              from_date,
              to_date,
            }}
          />
        )}
      </div>
      <EditOrderStatusModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
      <ViewOrderModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        id={selectedUser.id}
      />
    </>
  );
};

export default Order;
