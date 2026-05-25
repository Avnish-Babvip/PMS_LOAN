import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import {
  getAllCommissions,
  getReferralCommission,
} from "../../features/actions/commission";
import { EditCommissionModal } from "../../components/Modal/Commission/EditCommission";
import { EditReferralCommissionModal } from "../../components/Modal/Commission/EditReferralCommission";

const Commission = () => {
  const dispatch = useDispatch();
  const { commissionData, commissionLoading, referralLoading, referralData } =
    useSelector((state) => state.commission);
  const data = commissionData || [];
  const hasData = Array.isArray(data) && data.length > 0;
  const data2 = referralData || [];
  const hasData2 = Array.isArray(data2) && data2.length > 0;

  const [selected, setSelected] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (!openEditModal) {
      dispatch(getAllCommissions());
    }
  }, [openEditModal]);

  useEffect(() => {
    if (!openEditModal) {
      dispatch(getReferralCommission());
    }
  }, [openEditModal]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Delivery Commission</h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Type</th>
                <th className="text-left px-3 py-3 w-[160px]">Value</th>
                <th className="text-left px-3 py-3 w-[160px]">Status</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {commissionLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={2}
                  columns={[
                    { width: "w-32 h-4" },
                    { width: "w-32 h-4" },
                    { width: "w-32 h-4" },
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={4} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No commission found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 capitalize py-5 text-gray-700">
                      {item.type || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.value || "—"}
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item?.is_active
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
                            setSelected(item);
                          }}
                          className="p-2 px-3 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
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
      <div className="bg-white rounded-xl my-10 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Referral Commission</h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Type</th>
                <th className="text-left px-3 py-3 w-[160px]">Value</th>
                <th className="text-left px-3 py-3 w-[160px]">Status</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {referralLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={1}
                  columns={[
                    { width: "w-32 h-4" },
                    { width: "w-32 h-4" },
                    { width: "w-32 h-4" },
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData2 ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={4} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No referral commission found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                data2
                  ?.filter((item) => item.type === "fixed")
                  ?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="ps-5 px-3 capitalize py-5 text-gray-700">
                        {item.type || "—"}
                      </td>
                      <td className="ps-5 px-3 py-5 text-gray-700">
                        {item.value || "—"}
                      </td>
                      <td className="px-3 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            item?.is_active
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
                              setSelected(item);
                            }}
                            className="p-2 px-3 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
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

      <EditCommissionModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        commission={selected}
      />
      <EditReferralCommissionModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        commission={selected}
      />
    </>
  );
};

export default Commission;
