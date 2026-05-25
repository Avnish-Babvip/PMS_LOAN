import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import TableSkeleton from "../../../components/TableSkeleton";
import FilterSelect from "../../../components/FilterSelect";
import { getAllPincodes } from "../../../features/actions/location";
import AddDeliveryPincodeModal from "../../../components/Modal/DeliveryPincode/AddDeliveryPincode";
import { EditDeliveryPincodeModal } from "../../../components/Modal/DeliveryPincode/EditDeliveryPincode";

const DeliveryPincode = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pincodeData, locationLoading } = useSelector(
    (state) => state.location,
  );

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const users = pincodeData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const updateParams = ({ page, search, status }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(
        getAllPincodes({
          search: searchQuery,
          page,
          status,
        }),
      );
    }
  }, [openModal, openEditModal, page, searchQuery, status]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Pincodes</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Pincode
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
                <th className="text-left ps-5 px-3 py-3 w-[100px]">Pincode</th>
                <th className="text-left px-3 py-3 w-[100px]">City</th>
                <th className="text-left px-3 py-3 w-[100px]">State</th>
                <th className="text-left px-3 py-3 w-[80px]">Days</th>
                <th className="text-left px-3 py-3 w-[80px]">Courier</th>
                <th className="text-left px-3 py-3 w-[80px]">Deliverable</th>
                <th className="text-center px-3 py-3 w-[50px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {locationLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Status
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
                        No pincode found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new pincode
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
                      {item.pincode || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.city || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.state || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {`${item.min_days}-${item.max_days} days` || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.courier_name || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.is_active ? "active" : "inactive"}
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
        {!locationLoading && hasData && pincodeData?.pagination && (
          <Pagination
            data={pincodeData.pagination}
            page={page}
            label="pincode"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status }}
          />
        )}
      </div>
      <AddDeliveryPincodeModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <EditDeliveryPincodeModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        pincode={selectedUser}
      />
    </>
  );
};

export default DeliveryPincode;
