import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiFileText, FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllBanks } from "../../features/actions/bank";
import EditBankModal from "../../components/Modal/Bank/EditBank";
import { exportCases, getAllCases } from "../../features/actions/case";
import AddCaseModal from "../../components/Modal/Case/AddCase";
import EditCaseModal from "../../components/Modal/Case/EditCase";
import { getAllForms } from "../../features/actions/form";
import ExportCasesModal from "../../components/Modal/Case/ExportCases";
import EditStatusModal from "../../components/Modal/Case/EditStatus";

const Case = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { caseData, caseLoading, exportLoading } = useSelector(
    (state) => state.caseSlice,
  );
  const { bankData } = useSelector((state) => state.bank);
  const { formData } = useSelector((state) => state.form);
  const { permissions } = useSelector(
    (state) => state.authentication.adminData.admin,
  );
  const canCreateCase = permissions?.includes("create cases");
  const canEditCase = permissions?.includes("edit cases");
  const canViewCaseDocument = permissions?.includes("view case documents");
  const canSubmitCase = permissions?.includes("submit case forms");
  const canShowActions = canEditCase || canViewCaseDocument || canSubmitCase;

  const banks = Array.isArray(bankData?.data)
    ? bankData?.data?.map((r) => ({
        label: r.bank_name,
        value: r.id,
      }))
    : [];

  const bankForms = Array.isArray(formData?.data)
    ? formData.data.map((item) => ({
        label: item.form_name,
        value: item.id,
      }))
    : [];

  const [selectedUser, setSelectedUser] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const bank_id = searchParams.get("bank_id") || "";
  const form_id = searchParams.get("form_id") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const users = caseData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const updateParams = ({
    page,
    search,
    status,
    bank_id,
    form_id,
    start_date,
    end_date,
  }) => {
    const params = {};

    if (page) params.page = page;
    if (search) params.search = search;
    if (status) params.status = status;
    if (bank_id) params.bank_id = bank_id;
    if (form_id) params.form_id = form_id;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal && !openStatusModal) {
      dispatch(
        getAllCases({
          page,
          status,
          bank_id,
          search,
          form_id,
          start_date,
          end_date,
        }),
      );
    }
  }, [
    openModal,
    openEditModal,
    openStatusModal,
    page,
    status,
    search,
    form_id,
    bank_id,
    start_date,
    end_date,
  ]);

  useEffect(() => {
    dispatch(getAllBanks({ per_page: 100, status: 1 }));
  }, []);

  useEffect(() => {
    if (bank_id) {
      dispatch(
        getAllForms({
          per_page: 100,
          id: bank_id,
          status: "published",
        }),
      );
    }
  }, [dispatch, bank_id]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-10 px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Cases</h2>

          <div className="flex flex-wrap items-end gap-3">
            {canCreateCase && (
              <button
                onClick={() => setOpenModal(true)}
                className="mt-5 group h-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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
            )}

            <div className="mt-5">
              <FilterSelect
                label="Bank"
                value={bank_id}
                options={banks}
                onChange={(val) =>
                  updateParams({
                    bank_id: val,
                    form_id: "",
                    page: 1,
                    status,
                    search,
                    start_date,
                    end_date,
                  })
                }
              />
            </div>

            {bank_id && (
              <div className="mt-5">
                <FilterSelect
                  label="Bank Form"
                  value={form_id}
                  options={bankForms}
                  onChange={(val) =>
                    updateParams({
                      bank_id,
                      form_id: val,
                      page: 1,
                      status,
                      search,
                      start_date,
                      end_date,
                    })
                  }
                />
              </div>
            )}

            <div className="mt-5">
              <FilterSelect
                label="Status"
                value={status || "All"}
                options={[
                  { label: "In Progress", value: "in_progress" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
                onChange={(val) =>
                  updateParams({
                    status: val,
                    page: 1,
                    bank_id,
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-500">
                Start Date
              </label>

              <input
                type="date"
                value={start_date}
                onChange={(e) =>
                  updateParams({
                    page: 1,
                    status,
                    bank_id,
                    form_id,
                    search,
                    start_date: e.target.value,
                    end_date,
                  })
                }
                className="h-[46px] w-[160px] rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#79BF28] focus:ring-2 focus:ring-[#79BF28]/20"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-500">
                End Date
              </label>

              <input
                type="date"
                min={start_date}
                value={end_date}
                onChange={(e) =>
                  updateParams({
                    page: 1,
                    status,
                    bank_id,
                    form_id,
                    search,
                    start_date,
                    end_date: e.target.value,
                  })
                }
                className="h-[46px] w-[160px] rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#79BF28] focus:ring-2 focus:ring-[#79BF28]/20"
              />
            </div>

            <button
              onClick={() => setOpenExportModal(true)}
              className="h-12 mt-5 group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FiDownload
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
                Export Cases
              </span>

              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[100px]">File ID</th>
                <th className="text-left  px-3 py-3 w-[120px]">
                  Applicant Name
                </th>
                <th className="text-left  px-3 py-3 w-[150px]">Bank Name</th>
                <th className="text-left  px-3 py-3 w-[150px]">
                  Bank Form Name
                </th>
                <th className="text-left  px-3 py-3 w-[150px]">Subject</th>
                <th className="text-left px-3 py-3 w-[180px]">Status</th>
                {canShowActions && (
                  <th className="text-center px-3 py-3 w-[380px]">Action</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {caseLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-22 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn={canShowActions}
                  actionCount={3}
                  actionWidth="w-30 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={canShowActions ? 7 : 6} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">No case found</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new case
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                users.map((item) => {
                  const isUpdated = item.updated_at !== item.created_at;
                  const rowClass =
                    item.status === "approved"
                      ? "border-green-100 bg-green-50 hover:bg-green-100"
                      : item.status === "rejected"
                        ? "border-red-100 bg-red-50 hover:bg-red-100"
                        : isUpdated
                          ? "border-yellow-100 bg-yellow-50 hover:bg-yellow-100"
                          : "border-gray-100 hover:bg-gray-50";
                  return (
                    <tr
                      key={item.id}
                      className={`border-b transition ${rowClass}`}
                    >
                      <td className="ps-5 px-3 py-5 text-gray-700 whitespace-normal break-all">
                        {item.file_id || "—"}
                      </td>
                      <td className=" px-3 py-5 text-gray-700 whitespace-normal break-all">
                        {item.applicant_name || "—"}
                      </td>
                      <td className=" px-3 py-5 text-gray-700 whitespace-normal break-all">
                        {item.bank_name || "—"}
                      </td>
                      <td className=" px-3 py-5 text-gray-700 whitespace-normal break-all">
                        {item.bank_form_name || "—"}
                      </td>
                      <td className="px-3 py-5 text-gray-700">
                        <div className="group relative max-w-[200px]">
                          <p className="whitespace-normal break-all">
                            {item.subject || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-2 py-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex w-24 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                              item.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : item.status === "rejected"
                                  ? "bg-red-100 text-red-600 "
                                  : " bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {item.status.replace("_", " ")}
                          </span>

                          {canEditCase && (
                            <button
                              onClick={() => {
                                setOpenStatusModal(true);
                                setSelectedUser(item);
                              }}
                              title="Update Status"
                              className="group relative flex h-8 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95"
                            >
                              <FiEdit2
                                size={17}
                                className="transition-transform duration-300 group-hover:rotate-12"
                              />

                              {/* Shine Effect */}
                              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </button>
                          )}
                        </div>
                      </td>

                      {canShowActions && (
                        <td className="px-3 py-5 ">
                          <div className="flex justify-center gap-3">
                            {canViewCaseDocument &&
                              (item.documents.length > 0 ? (
                                <Link
                                  to={`verification-task/${item.uuid}`}
                                  className="group relative flex w-40 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                                >
                                  <FiEye className="text-base transition-transform duration-300 group-hover:scale-110" />
                                  View Documents
                                  {/* Shine Effect */}
                                  <span className="absolute inset-0 -translate-x-full rounded-xl bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                </Link>
                              ) : (
                                <Link
                                  to={`verification-task/${item.uuid}`}
                                  state={{ openModal: true }}
                                  className="group flex w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-cyan-600 hover:to-teal-700 hover:shadow-xl active:scale-95"
                                >
                                  <FiEye className="text-base transition-transform duration-300 group-hover:scale-110" />
                                  Add Document
                                </Link>
                              ))}

                            {/* Edit */}
                            {canEditCase && (
                              <button
                                onClick={() => {
                                  setOpenEditModal(true);
                                  setSelectedUser(item);
                                }}
                                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl active:scale-95"
                              >
                                <FiEdit2 className="text-base transition-transform duration-300 group-hover:rotate-12" />
                                Edit Details
                              </button>
                            )}

                            {/* Submit Form */}
                            {canSubmitCase && (
                              <Link
                                to={`form/${item.uuid}`}
                                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl active:scale-95"
                              >
                                <FiFileText className="text-base transition-transform duration-300 group-hover:scale-110" />
                                Submit Form
                                {/* Shine Effect */}
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                              </Link>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!caseLoading && hasData && caseData?.meta?.pagination && (
          <Pagination
            data={caseData?.meta?.pagination}
            page={page}
            label="cases"
            onPageChange={updateParams}
            extraParams={{ status }}
          />
        )}
      </div>
      {canEditCase && (
        <EditStatusModal
          isOpen={openStatusModal}
          onClose={() => {
            setOpenStatusModal(false);
          }}
          user={selectedUser}
          status={[
            { label: "In Progress", value: "in_progress" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
      )}
      {canCreateCase && (
        <AddCaseModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            dispatch(setActiveSubTab("All Banks"));
            navigate(".", {
              replace: true,
              state: null,
            });
          }}
        />
      )}
      {canEditCase && (
        <EditCaseModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          user={selectedUser}
        />
      )}
      <ExportCasesModal
        isOpen={openExportModal}
        onClose={() => setOpenExportModal(false)}
        banks={banks}
        bankForms={bankForms}
        exportLoading={exportLoading}
        onExport={(filters) => {
          dispatch(exportCases(filters));
          setOpenExportModal(false);
        }}
      />
    </>
  );
};

export default Case;
