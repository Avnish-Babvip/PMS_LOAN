import {
  HiX,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCalendar,
} from "react-icons/hi";
import {
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiEdit2,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { updateVisitDistance } from "../../../features/actions/case";
import { useDispatch } from "react-redux";

const ViewCaseDocumentModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const {
    owner_name,
    verification_point,
    notes,
    status,
    due_at,
    created_at,
    agent,
    case: caseData,
    visit,
  } = user;

  const dispatch = useDispatch();

  const [isEditingDistance, setIsEditingDistance] = useState(false);
  const [travelDistance, setTravelDistance] = useState(
    visit?.distance_km || "",
  );
  const [reason, setReason] = useState("");

  const handleUpdateDistance = () => {
    dispatch(
      updateVisitDistance({
        id: visit?.case_document_id,
        payload: {
          travel_distance_km: Number(travelDistance),
          reason,
        },
      }),
    )
      .unwrap()
      .then(() => {
        setIsEditingDistance(false);
        setReason("");
        onClose();
      });
  };

  useEffect(() => {
    setTravelDistance(visit?.distance_km || "");
  }, [visit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative flex h-[95vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <HiOutlineDocumentText size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Document Verification Details
                </h2>

                <p className="mt-1 mb-2 text-sm text-gray-300">
                  View case verification information
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-2 capitalize rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                <FiCheckCircle />
                {status?.replace("_", " ")}
              </span>
            </div>

            {/* Verification Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Verification Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <InfoCard
                  icon={<FiUser />}
                  label="Owner Name"
                  value={owner_name}
                />

                <InfoCard
                  icon={<FiFileText />}
                  label="Verification Point"
                  value={verification_point}
                />

                <InfoCard
                  icon={<FiClock />}
                  label="Due Date"
                  value={due_at ? new Date(due_at).toLocaleString() : "-"}
                />

                <InfoCard
                  icon={<FiCheckCircle />}
                  label="Status"
                  value={status?.replace("_", " ")}
                />
              </div>

              {/* Assigned Agent */}
              <div className="mt-6 rounded-2xl border border-gray-100 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79BF28]/10 text-[#79BF28]">
                    <FiUser />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Assigned Agent</p>

                    <h4 className="font-semibold text-gray-800">
                      {agent?.name || "Not Assigned"}
                    </h4>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>

                    <p className="font-medium text-gray-700">
                      {agent?.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Role</p>

                    <p className="font-medium capitalize text-gray-700">
                      {agent?.role?.replace("_", " ") || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-gray-600">Notes</p>

                <div className="rounded-2xl bg-slate-50 p-4 text-gray-700">
                  {notes || "No notes available"}
                </div>
              </div>
            </div>

            {/* Case Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Case Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <InfoCard
                  icon={<HiOutlineUser />}
                  label="Applicant Name"
                  value={caseData?.applicant_name}
                />

                <InfoCard
                  icon={<FiFileText />}
                  label="File ID"
                  value={caseData?.file_id}
                />

                <InfoCard
                  icon={<FiFileText />}
                  label="Subject"
                  value={caseData?.subject}
                />

                <InfoCard
                  icon={<HiOutlineCalendar />}
                  label="Mail Time"
                  value={
                    caseData?.mail_time
                      ? new Date(caseData.mail_time).toLocaleString()
                      : "-"
                  }
                />
              </div>
            </div>

            {/* Visit Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Visit Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  icon={<FiCheckCircle />}
                  label="Visit Status"
                  value={visit?.status}
                />

                <InfoCard
                  icon={<FiClock />}
                  label="Started At"
                  value={
                    visit?.started_at
                      ? new Date(visit.started_at).toLocaleString()
                      : "-"
                  }
                />

                <InfoCard
                  icon={<FiClock />}
                  label="Ended At"
                  value={
                    visit?.ended_at
                      ? new Date(visit.ended_at).toLocaleString()
                      : "-"
                  }
                />

                <InfoCard
                  icon={<HiOutlineCalendar />}
                  label="Duration"
                  value={
                    visit?.duration_seconds != null
                      ? `${visit.duration_seconds} Seconds`
                      : "-"
                  }
                />
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#79BF28]">
                      <FiFileText />
                      <span className="text-sm font-medium text-gray-500">
                        Travel Distance
                      </span>
                    </div>

                    {!isEditingDistance && (
                      <button
                        onClick={() => setIsEditingDistance(true)}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                  </div>

                  {!isEditingDistance ? (
                    <>
                      <p className="text-2xl font-bold text-gray-800">
                        {visit?.distance_km ?? 0} KM
                      </p>

                      {visit?.distance_previous !== null &&
                        visit?.distance_previous !== undefined && (
                          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Previous Distance
                              </span>

                              <span className="font-semibold text-amber-700">
                                {visit.distance_previous} KM
                              </span>
                            </div>
                          </div>
                        )}

                      {visit?.distance_update_reason && (
                        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Update Reason
                          </p>

                          <p className="mt-2 text-sm text-gray-700">
                            {visit.distance_update_reason}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Travel Distance (KM)
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          value={travelDistance}
                          onChange={(e) => setTravelDistance(e.target.value)}
                          placeholder="Enter distance"
                          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-[#79BF28]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Reason
                        </label>

                        <textarea
                          rows={3}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Enter reason for updating distance..."
                          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-[#79BF28]"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingDistance(false);
                            setTravelDistance(visit?.distance_km || "");
                            setReason("");
                          }}
                          className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleUpdateDistance}
                          className="rounded-xl bg-gradient-to-r from-[#79BF28] to-[#5EA51F] px-5 py-2.5 font-medium text-white transition hover:shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <InfoCard
                  icon={<FiClock />}
                  label="Created At"
                  value={
                    visit?.created_at
                      ? new Date(visit.created_at).toLocaleString()
                      : "-"
                  }
                />
              </div>

              {/* Location */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
                  <h4 className="mb-3 font-semibold text-gray-800">
                    Start Location
                  </h4>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Latitude:</span>{" "}
                      {visit?.start_latitude ?? "-"}
                    </p>

                    <p>
                      <span className="font-medium">Longitude:</span>{" "}
                      {visit?.start_longitude ?? "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
                  <h4 className="mb-3 font-semibold text-gray-800">
                    End Location
                  </h4>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Latitude:</span>{" "}
                      {visit?.end_latitude ?? "-"}
                    </p>

                    <p>
                      <span className="font-medium">Longitude:</span>{" "}
                      {visit?.end_longitude ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-6">
                <h4 className="mb-4 font-semibold text-gray-800">
                  Visit Remarks
                </h4>

                {visit?.remarks?.length ? (
                  <div className="space-y-4">
                    {visit.remarks.map((remark) => (
                      <div
                        key={remark.id}
                        className="rounded-2xl border border-gray-100 bg-slate-50 p-4"
                      >
                        <p className="text-gray-700">{remark.remark}</p>

                        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                          <span>By: {remark.created_by_name}</span>

                          <span>
                            {new Date(remark.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-center text-gray-500">
                    No remarks available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-[#79BF28]">
      {icon}
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>

    <p className="font-semibold text-gray-800 capitalize whitespace-normal break-all">
      {value || "-"}
    </p>
  </div>
);

const DocumentCard = ({ title, file }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{title}</p>

        <p className="mt-1 text-sm text-gray-500">
          {file ? "Document available" : "No document uploaded"}
        </p>
      </div>

      {file && (
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#79BF28]/10 text-[#79BF28] transition hover:bg-[#79BF28]/20"
        >
          <FiDownload />
        </a>
      )}
    </div>
  </div>
);

export default ViewCaseDocumentModal;
