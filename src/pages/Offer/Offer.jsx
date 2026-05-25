import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllOffers } from "../../features/actions/offer";
import { EditOfferModal } from "../../components/Modal/Offer/EditOffer";
import AddOfferModal from "../../components/Modal/Offer/AddOffer";

const Offer = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { offerData, offerLoading } = useSelector((state) => state.offer);

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";

  const users = offerData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const updateParams = ({ page, search, status, type }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    if (type !== undefined && type !== "") params.type = type;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(
        getAllOffers({
          search: searchQuery,
          page,
          status,
          type,
        }),
      );
    }
  }, [openModal, openEditModal, page, searchQuery, status, type]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Offers</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Offer
            </button>

            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  page: 1,
                  type,
                  search: searchQuery,
                })
              }
            />

            <FilterSelect
              label="Type"
              value={type} // ← number or ""
              options={[
                { label: "Flat", value: "flat" },
                { label: "Percentage", value: "percentage" },
              ]}
              onChange={(val) =>
                updateParams({
                  type: val, // ← still value (1 / 2)
                  page: 1,
                  status,
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
                <th className="text-left ps-5 px-3 py-3 w-[100px]">Name</th>
                <th className="text-left px-3 py-3 w-[120px]">
                  Discount Value
                </th>
                <th className="text-left px-3 py-3 w-[100px]">
                  Min Cart Value
                </th>
                <th className="text-left px-3 py-3 w-[80px]">Start Time</th>
                <th className="text-left px-3 py-3 w-[80px]">End Time</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                <th className="text-center px-3 py-3 w-[50px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {offerLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                    { width: "w-24 h-4" }, // Email
                    { width: "w-36 h-4" }, // Mobile
                    { width: "w-36 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={1}
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
                        No offer found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new offer
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
                    <td className="ps-5 px-3 py-5 text-brand-green">
                      {item.name || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.discount_value
                        ? item.discount_type === "percentage"
                          ? `${item.discount_value}%`
                          : `₹${item.discount_value}`
                        : "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.min_cart_value || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700">
                      {item.start_at ? (
                        <>
                          <div>{item.start_at.split(" ")[0]}</div>
                          <div className="text-sm text-gray-500">
                            {item.start_at.split(" ")[1]}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-5 text-gray-700">
                      {item.end_at ? (
                        <>
                          <div>{item.end_at.split(" ")[0]}</div>
                          <div className="text-sm text-gray-500">
                            {item.end_at.split(" ")[1]}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
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
                            setOpenEditModal(true);
                            setSelectedUser(item);
                          }}
                          className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          <FiEdit2 />
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
        {!offerLoading && hasData && offerData?.pagination && (
          <Pagination
            data={offerData.pagination}
            page={page}
            label="offer"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status, type }}
          />
        )}
      </div>
      <AddOfferModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Offer Code"));
        }}
      />
      <EditOfferModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        offer={selectedUser}
      />
    </>
  );
};

export default Offer;
