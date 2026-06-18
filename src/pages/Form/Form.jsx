import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import AddAdminUserModal from "../../components/Modal/AdminUser/AddAdminUser";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllForms, uploadFormSheet } from "../../features/actions/form";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiUploadCloud } from "react-icons/fi";
import { Spinner } from "../../components/Loader/Spinner";
import { Input } from "../../components/ReusableInputs";
import EditBankFormModal from "../../components/Modal/Form/EditBankForm";

const Form = () => {
  const { bank } = useParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formData, formLoading } = useSelector((state) => state.form);
  const { bankData } = useSelector((state) => state.bank);
  const bankId = bankData?.data.find((item) => item.bank_name === bank)?.id;

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const loan_type = searchParams.get("loan_type") || "";

  const users = formData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const updateParams = ({ page, search, status, loan_type }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    if (loan_type !== undefined && loan_type !== "")
      params.loan_type = loan_type;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(
        getAllForms({
          search: searchQuery,
          page,
          status,
          loan_type,
          id: bankId,
        }),
      );
    }
  }, [openModal, openEditModal, page, searchQuery, status, loan_type]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="font-semibold text-gray-800">All Forms</h2>

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
                Upload Form Sheet
              </span>

              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>

            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  page: 1,
                  loan_type,
                  search: searchQuery,
                })
              }
            />

            {/* Search filter for loan_type */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search Loan Type..."
                value={loan_type}
                onChange={(e) =>
                  updateParams({
                    loan_type: e.target.value,
                    page: 1,
                    status,
                    search: searchQuery,
                  })
                }
                className="w-72 rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-[#79BF28] focus:ring-2 focus:ring-[#79BF28]/20"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[150px]">
                  Form Name
                </th>
                <th className="text-left px-3 py-3 w-[100px]">Loan Type</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                <th className="text-left px-3 py-3 w-[80px]">
                  Uploaded File Name
                </th>
                <th className="text-center px-3 py-3 w-[155px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {formLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-24 h-4" }, // Role
                    { width: "w-20 h-4" }, // Status
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-32 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={5} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No bank forms found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new bank form
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
                      {item.form_name || "—"}
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.loan_type || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "published"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.file_name || "—"}
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
        {!formLoading && hasData && formData?.meta?.pagination && (
          <Pagination
            data={formData?.meta?.pagination}
            page={page}
            label="admin users"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status, loan_type }}
          />
        )}
      </div>
      <UploadFormSheetModal
        isOpen={openModal}
        bankId={bankId}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <EditBankFormModal
        isOpen={openEditModal}
        selectedForm={selectedUser}
        onClose={() => {
          setOpenEditModal(false);
        }}
      />
    </>
  );
};

export default Form;

const UploadFormSheetModal = ({ isOpen, onClose, bankId }) => {
  const dispatch = useDispatch();

  const { formLoading } = useSelector((state) => state.form);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedFile = watch("file");

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("form_name", data.form_name);
    formData.append("loan_type", data.loan_type);
    formData.append("file", data.file[0]);

    dispatch(
      uploadFormSheet({
        bankId,
        payload: formData,
      }),
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FiUploadCloud size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Upload Form Sheet
                </h2>

                <p className="text-sm text-gray-300">
                  Upload bank form excel sheet
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white transition hover:opacity-80"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <Input
              label="Form Name"
              name="form_name"
              register={register}
              required
              errors={errors}
            />

            <Input
              label="Loan Type"
              name="loan_type"
              register={register}
              required
              errors={errors}
            />

            {/* Upload Box */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Sheet
              </label>

              <label className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white px-6 py-12 transition-all duration-300 hover:border-[#79BF28] hover:bg-[#f7fdf0]">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  {...register("file", {
                    required: "Sheet is required",
                  })}
                  className="hidden"
                />

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#79BF28]/10 text-[#79BF28] transition-all duration-300 group-hover:scale-110">
                  <FiUploadCloud size={36} />
                </div>

                <h4 className="text-lg font-semibold text-gray-800">
                  Upload Form Sheet
                </h4>

                <p className="mt-2 text-center text-sm text-gray-500">
                  Drag & drop your file here or
                  <span className="ml-1 font-semibold text-[#79BF28]">
                    browse files
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Supported formats: XLSX, XLS, CSV
                </p>
              </label>

              {selectedFile?.[0] && (
                <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-700">
                    📄 {selectedFile[0].name}
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    File selected successfully
                  </p>
                </div>
              )}

              {errors.file && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={formLoading}
              type="submit"
              className="flex min-w-[170px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {formLoading ? <Spinner /> : "Upload Sheet"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
