import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiAlertCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { getAllKycDocument } from "../../features/actions/customer";
import { EditCustomerKycStatusModal } from "../../components/Modal/Customer/EditCustomerKycStatusModal";

const CustomerKyc = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { kycData, customerLoading } = useSelector((state) => state.customer);
  const users = kycData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const [selectedUser, setSelectedUser] = useState({});
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
        getAllKycDocument({
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
          <h2 className="font-semibold text-gray-800">
            All Customers Kyc Document
          </h2>

          <div className="flex gap-3">
            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
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
                <th className="text-left px-3 py-3 w-[140px]">Document Type</th>
                <th className="text-left px-3 py-3 w-[180px]">
                  Document Number
                </th>
                <th className="text-left px-3 py-3 w-[220px]">Documents</th>
                <th className="text-left px-3 py-3 w-[120px]">Status</th>
                <th className="text-center px-3 py-3 w-[160px]">Action</th>
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
                    { width: "w-32 h-4" }, // Email
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
                    {/* Name */}
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>

                    {/* Document Type */}
                    <td className="px-3 py-5 capitalize text-gray-700">
                      {item.document_type}
                    </td>

                    {/* Document Number */}
                    <td className="px-3 py-5 text-gray-700">
                      {item.document_number}
                    </td>

                    {/* Documents */}
                    <td className="px-3 py-5">
                      <div className="flex gap-3 items-center">
                        {/* Front Image (Always Show) */}
                        {item.document_front && (
                          <a
                            href={item.document_front}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={item.document_front}
                              alt="Front"
                              className="w-14 h-10 object-cover rounded border hover:scale-105 transition"
                            />
                          </a>
                        )}

                        {/* Back Image (Only Aadhaar) */}
                        {item.document_type === "aadhaar" &&
                          item.document_back && (
                            <a
                              href={item.document_back}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={item.document_back}
                                alt="Back"
                                className="w-14 h-10 object-cover rounded border hover:scale-105 transition"
                              />
                            </a>
                          )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </span>

                        {/* Show Reason Icon Only If Rejected */}
                        {item.status === "rejected" && item.reject_reason && (
                          <div className="relative group flex items-center">
                            <FiAlertCircle className="text-red-500 text-sm cursor-pointer" />

                            {/* Tooltip ABOVE */}
                            <div
                              className="absolute bottom-7 left-1/2 -translate-x-1/2 
                    w-64 p-3 bg-gray-900 text-white text-xs rounded-lg 
                    shadow-xl opacity-0 group-hover:opacity-100 
                    transition duration-200 z-50 pointer-events-none"
                            >
                              <p className="font-semibold mb-1">
                                Reject Reason
                              </p>
                              <p className="leading-relaxed break-words">
                                {item.reject_reason}
                              </p>

                              {/* Arrow */}
                              <div
                                className="absolute top-full left-1/2 -translate-x-1/2 
                      w-3 h-3 bg-gray-900 rotate-45"
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          disabled={
                            item.status === "approved" ||
                            item.status === "rejected"
                          }
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedUser({
                              id: item?.id,
                              status: item?.status,
                            });
                          }}
                          className={`p-2 px-3 flex items-center gap-2 rounded-lg transition
      ${
        item.status === "approved" || item.status === "rejected"
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
        {!customerLoading && hasData && kycData?.meta && (
          <Pagination
            data={kycData}
            page={page}
            label="customers"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status }}
          />
        )}
      </div>

      <EditCustomerKycStatusModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
    </>
  );
};

export default CustomerKyc;
