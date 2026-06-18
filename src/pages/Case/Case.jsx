import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllBanks } from "../../features/actions/bank";
import EditBankModal from "../../components/Modal/Bank/EditBank";
import { getAllCases } from "../../features/actions/case";
import AddCaseModal from "../../components/Modal/Case/AddCase";
import EditCaseModal from "../../components/Modal/Case/EditCase";

const Case = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { caseData, caseLoading } = useSelector((state) => state.caseSlice);

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";
  const users = caseData?.data || [];
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
        getAllCases({
          page,
          status,
        }),
      );
    }
  }, [openModal, openEditModal, page, status]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="font-semibold text-gray-800">All Cases</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Case
              </span>

              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>

            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Draft", value: "Draft" },
                { label: "Pending Assignment", value: "pending_assignment" },
                { label: "In Progress", value: "in_progress" },
                { label: "QC Review", value: "qc_review" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
                { label: "Completed", value: "completed" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  page: 1,
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
                <th className="text-left ps-5 px-3 py-3 w-[150px]">File ID</th>
                <th className="text-left ps-5 px-3 py-3 w-[150px]">
                  Applicant Name
                </th>
                <th className="text-left ps-5 px-3 py-3 w-[150px]">
                  Bank Name
                </th>
                <th className="text-left ps-5 px-3 py-3 w-[150px]">Subject</th>
                <th className="text-left px-3 py-3 w-[180px]">Status</th>
                <th className="text-center px-3 py-3 w-[225px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {caseLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={3}
                  actionWidth="w-12 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={3} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No admin users found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new admin user
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
                      {item.file_id || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.applicant_name || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.bank_name || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.subject || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "draft"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.status}
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

                        <Link
                          to={`form/${item.bank_name}`}
                          className="p-2 px-3 flex items-center gap-2  bg-blue-100 text-blue-500 rounded-lg hover:bg-blue-200"
                        >
                          <FiEdit2 /> Submit Form
                        </Link>
                        <Link
                          to={`document-verification/${item.bank_name}`}
                          className="p-2 px-3 flex items-center gap-2  bg-blue-100 text-blue-500 rounded-lg hover:bg-blue-200"
                        >
                          <FiEdit2 /> View Verification Task
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!caseLoading && hasData && caseData?.meta?.pagination && (
          <Pagination
            data={caseData?.meta?.pagination}
            page={page}
            label="admin users"
            onPageChange={updateParams}
            extraParams={{ status }}
          />
        )}
      </div>
      <AddCaseModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Banks"));
        }}
      />
      <EditCaseModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
    </>
  );
};

export default Case;
