import { HiX, HiTrash } from "react-icons/hi";
import { Spinner } from "../Loader/Spinner";

const DeleteModal = ({
  isOpen,
  onClose,
  isLoading,
  onConfirm,
  title = "Delete Permission",
  message = "Are you sure you want to delete this permission? This action cannot be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-[#262D34] w-full max-w-md rounded-xl p-6 text-white border border-[#232335] shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <HiX size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600/20">
            <HiTrash className="text-red-700" size={26} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-center text-gray-400 text-sm mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition"
          >
            {isLoading ? <Spinner /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
