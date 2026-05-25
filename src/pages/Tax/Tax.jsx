import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableSkeleton from "../../components/TableSkeleton";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllTaxes } from "../../features/actions/tax";
import { EditTaxModal } from "../../components/Modal/Tax/EditTax";
import AddTaxModal from "../../components/Modal/Tax/AddTax";

const Tax = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { taxData, taxLoading } = useSelector((state) => state.tax);

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const users = taxData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(getAllTaxes());
    }
  }, [openModal, openEditModal]);

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
          <h2 className="font-semibold text-gray-800">All Taxes</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Tax
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[100px]">Name</th>
                <th className="text-left ps-5 px-3 py-3 w-[100px]">Code</th>
                <th className="text-left px-3 py-3 w-[120px]">Type</th>
                <th className="text-left px-3 py-3 w-[100px]">Value</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                <th className="text-center px-3 py-3 w-[50px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {taxLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Username
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
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

                      <p className="text-gray-600 font-medium">No tax found</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new tax
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
                    <td className="ps-5 px-3 py-5 text-gray-700 ">
                      {item.name || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-brand-green">
                      {item.name || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.type || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.type
                        ? item.type === "percentage"
                          ? `${item.value}%`
                          : `₹${item.value}`
                        : "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
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
      </div>
      <AddTaxModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Tax Code"));
        }}
      />
      <EditTaxModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        tax={selectedUser}
      />
    </>
  );
};

export default Tax;
