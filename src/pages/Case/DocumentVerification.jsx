import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import { FiFile } from "react-icons/fi";
import { FaFilePdf, FaFileWord, FaFileExcel } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllBanks } from "../../features/actions/bank";
import EditBankModal from "../../components/Modal/Bank/EditBank";
import { getAllCaseDocuments } from "../../features/actions/case";
import AddCaseDocumentModal from "../../components/Modal/CaseDocument/AddCaseDocument";
import EditCaseDocumentModal from "../../components/Modal/CaseDocument/EditCaseDocument";
import ViewCaseDocumentModal from "../../components/Modal/CaseDocument/ViewCaseDocument";
import VerificationLogsModal from "../../components/Modal/CaseDocument/VerificationLogs";
import EditStatusModal from "../../components/Modal/Case/EditStatus";
import ImageViewer from "../../components/ImageViewer";

const DocumentVerification = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { documentData, documentLoading } = useSelector(
    (state) => state.caseSlice,
  );

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  const getFileType = (url = "") => {
    const ext = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext))
      return "image";

    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "word";
    if (["xls", "xlsx", "csv"].includes(ext)) return "excel";

    return "other";
  };

  const [openReferenceModal, setOpenReferenceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const { permissions } = useSelector(
    (state) => state.authentication.adminData.admin,
  );
  const canCreateDocument = permissions?.includes("create case documents");
  const canEditDocument = permissions?.includes("edit case documents");

  const users = documentData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (!openEditModal && !openModal && !openViewModal) {
      dispatch(getAllCaseDocuments(id));
    }
  }, [openModal, openEditModal, openStatusModal, openViewModal]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            All Document Verification Task
          </h2>

          <div className="flex gap-3">
            {canCreateDocument && (
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
                  Add New Document
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[100px]">
                  Document Name
                </th>
                <th className="text-left  px-3 py-3 w-[80px]">Agent Name</th>

                <th className="text-left  px-3 py-3 w-[100px]">
                  Reference Documents
                </th>
                <th className="text-left  px-3 py-3 w-[100px]">
                  Field Verification Proofs
                </th>
                <th className="text-left px-3 py-3 w-[80px]">Agent Status</th>
                <th className="text-left px-3 py-3 w-[170px]">QC Status</th>
                <th className="text-center px-3 py-3 w-[180px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {documentLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Name
                    { width: "w-20 h-4" }, // Status
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={3}
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
                        No document found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new document
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
                    <td className="ps-5 px-3 py-5 text-gray-700 whitespace-normal break-all">
                      {item.document_name || "—"}
                    </td>
                    <td className=" px-3 py-5 text-gray-700 whitespace-normal break-all">
                      {item?.agent?.name || "Not Assigned"}
                    </td>

                    <td className="px-3 py-5">
                      {item.document_file || item.upload_file ? (
                        <button
                          onClick={() => {
                            setSelectedUser(item);
                            setOpenReferenceModal(true);
                          }}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="relative z-10">View Documents</span>

                          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                      ) : (
                        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                          No Documents Available
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-5">
                      {item.files?.length ? (
                        <button
                          onClick={() => {
                            setSelectedUser(item);

                            const imageList = item.files
                              .filter(
                                (file) =>
                                  getFileType(file.file_url) === "image",
                              )
                              .map((file) => file.file_url);

                            if (!imageList.length) return;

                            setImages(imageList);
                            setCurrentIndex(0);
                            setViewerOpen(true);
                          }}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#79BF28] to-[#5EA51F] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                        >
                          <span className="relative z-10">
                            View Proofs ({item.files.length})
                          </span>

                          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                      ) : (
                        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                          No Proofs Available
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex min-w-[100px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            item.status === "assigned"
                              ? "bg-yellow-100 text-yellow-600"
                              : item.status === "verified"
                                ? "bg-green-100 text-green-600"
                                : "  bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex min-w-[100px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                            item.qc_status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : item.qc_status === "approved"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {(item.qc_status || "Pending")
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
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
                      </div>
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelectedUser(item);
                          }}
                          className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:shadow-sm"
                        >
                          <FiEye className="text-base" />
                        </button>
                        {canEditDocument && (
                          <button
                            onClick={() => {
                              setOpenEditModal(true);
                              setSelectedUser(item);
                            }}
                            className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                          >
                            <FiEdit2 />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setOpenLogModal(true);
                            setSelectedUser(item);
                          }}
                          className="flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 transition-all duration-200 hover:bg-violet-200 hover:shadow-sm"
                        >
                          <FiClock size={16} />
                          Verification Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <EditStatusModal
          isOpen={openStatusModal}
          onClose={() => {
            setOpenStatusModal(false);
          }}
          document={true}
          user={selectedUser}
          status={[
            { label: "Reverify", value: "re_verify" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
        />

        {openReferenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-5">
            <div className="w-full max-w-5xl h-[90vh] lg:h-[70vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Reference Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    View uploaded reference documents.
                  </p>
                </div>

                <button
                  onClick={() => setOpenReferenceModal(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[calc(80vh-88px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Document File",
                      url: selectedUser?.document_file,
                    },
                    {
                      title: "Uploaded File",
                      url: selectedUser?.upload_file,
                    },
                  ].map((file) => {
                    if (!file.url) return null;

                    const type = getFileType(file.url);

                    return (
                      <div
                        key={file.title}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* Preview */}
                        {type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.title}
                            className="h-72 w-full object-contain bg-slate-100 transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-72 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            {type === "pdf" && (
                              <FaFilePdf className="text-8xl text-red-600" />
                            )}

                            {type === "word" && (
                              <FaFileWord className="text-8xl text-blue-600" />
                            )}

                            {type === "excel" && (
                              <FaFileExcel className="text-8xl text-green-600" />
                            )}

                            {type === "other" && (
                              <FiFile className="text-8xl text-gray-500" />
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="space-y-4 p-5">
                          <div>
                            <h4
                              className="truncate font-semibold text-slate-800"
                              title={file.title}
                            >
                              {file.title}
                            </h4>

                            <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
                              {file.url.split(".").pop()}
                            </span>
                          </div>

                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                          >
                            <FiEye size={18} />
                            View Document
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <ImageViewer
          images={images}
          open={viewerOpen}
          currentIndex={currentIndex}
          onClose={() => setViewerOpen(false)}
        />
      </div>

      {canCreateDocument && (
        <AddCaseDocumentModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            navigate(".", {
              replace: true,
              state: null,
            });
          }}
        />
      )}
      {canEditDocument && (
        <EditCaseDocumentModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          user={selectedUser}
        />
      )}
      <ViewCaseDocumentModal
        isOpen={openViewModal}
        onClose={() => setOpenViewModal(false)}
        user={selectedUser}
      />
      <VerificationLogsModal
        isOpen={openLogModal}
        onClose={() => setOpenLogModal(false)}
        id={selectedUser.id}
      />
    </>
  );
};

export default DocumentVerification;
