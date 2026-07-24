import { HiX } from "react-icons/hi";
import { FiCheckCircle, FiClock, FiFileText, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getVerificationLogs } from "../../../features/actions/case";

const VerificationLogsModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { logsData } = useSelector((state) => state.caseSlice);

  const logs = logsData || [];

  const getActionTitle = (action) => {
    switch (action) {
      case "VISIT_ASSIGNED":
        return "Visit Assigned";

      case "VISIT_STARTED":
        return "Visit Started";

      case "VISIT_COMPLETED":
        return "Visit Completed";

      case "STATUS_CHANGED":
        return "Status Updated";

      case "FILE_UPLOADED":
        return "File Uploaded";

      case "REMARK_ADDED":
        return "Remark Added";

      case "NOTIFICATION_SENT":
        return "Notification Sent";

      default:
        return action
          ?.replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getActionConfig = (action) => {
    switch (action) {
      case "VISIT_STARTED":
        return {
          color: "bg-blue-500",
          icon: <FiClock size={18} />,
        };

      case "VISIT_COMPLETED":
        return {
          color: "bg-green-600",
          icon: <FiCheckCircle size={18} />,
        };

      case "STATUS_CHANGED":
        return {
          color: "bg-orange-500",
          icon: <FiCheckCircle size={18} />,
        };

      case "FILE_UPLOADED":
        return {
          color: "bg-purple-600",
          icon: <FiFileText size={18} />,
        };

      case "REMARK_ADDED":
        return {
          color: "bg-yellow-500",
          icon: <FiUser size={18} />,
        };

      case "NOTIFICATION_SENT":
        return {
          color: "bg-pink-600",
          icon: <FiCheckCircle size={18} />,
        };

      default:
        return {
          color: "bg-[#79BF28]",
          icon: <FiCheckCircle size={18} />,
        };
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      dispatch(getVerificationLogs(id));
    }
  }, [dispatch, id, isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-7 py-5">
          <div>
            <h2 className="text-2xl font-bold text-white">Verification Logs</h2>

            <p className="mt-1 text-sm text-gray-300">
              Timeline of verification activities
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-8">
          {logs.length ? (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gray-200"></div>

              {logs.map((log, index) => {
                const config = getActionConfig(log.action);
                return (
                  <div key={index} className="relative mb-8 flex gap-5">
                    {/* Circle */}
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg ${config.color}`}
                    >
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {getActionTitle(log.action)}
                      </h4>

                      {log.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {log.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiClock />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
              <p className="text-gray-500">No verification logs available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationLogsModal;
