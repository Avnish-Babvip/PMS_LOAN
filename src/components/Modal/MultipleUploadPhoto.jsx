import { useRef, useState } from "react";
import { TbUpload } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "./Delete";

const MultiPhotoUpload = ({
  label = "Photos",
  value = [],
  onChange,
  primaryIndex = 0,
  onPrimaryChange,
  onDeleteApiImage, // 🔥 new prop
  error,
}) => {
  const inputRef = useRef(null);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  /* ================= ADD IMAGES ================= */
  const handleAdd = (files) => {
    const newFiles = Array.from(files || []);
    if (!newFiles.length) return;

    const formatted = newFiles.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
      file,
    }));

    onChange([...(value || []), ...formatted]);
    inputRef.current.value = "";
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const img = value[deleteIndex];

    try {
      setIsDeleting(true);

      // 🔥 Call API if needed
      if (img.id) {
        await onDeleteApiImage?.(img.id);
      }

      const updated = [...value];
      updated.splice(deleteIndex, 1);
      onChange(updated);

      // Fix primary index
      if (deleteIndex === primaryIndex) {
        onPrimaryChange(0);
      } else if (deleteIndex < primaryIndex) {
        onPrimaryChange(primaryIndex - 1);
      }
    } finally {
      setIsDeleting(false);
      setDeleteIndex(null);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <label className="text-gray-700 text-sm font-medium pe-2">
          {label}
        </label>

        {/* UPLOAD BUTTON */}
        <label className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 text-sm bg-white border rounded-lg cursor-pointer hover:border-blue-500">
          <TbUpload size={16} />
          Upload Images
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => handleAdd(e.target.files)}
          />
        </label>

        {/* PREVIEW GRID */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {value.map((img, index) => (
              <div
                key={index}
                className={`relative group rounded-lg overflow-hidden border ${
                  index === primaryIndex ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <img
                  src={img.url}
                  alt="Preview"
                  className="w-full h-28 object-cover"
                />

                {/* 🔥 HOVER DELETE OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 important
                    setDeleteIndex(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <FiTrash2 size={16} />
                </button>

                {/* PRIMARY BADGE */}
                {index === primaryIndex && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                    Primary
                  </span>
                )}

                {/* SET PRIMARY BUTTON */}
                <button
                  type="button"
                  onClick={() => onPrimaryChange(index)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2
                           text-xs bg-white px-2 py-1 rounded shadow
                           opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white text-black transition"
                >
                  Set Primary
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <DeleteModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
      />
    </>
  );
};

export default MultiPhotoUpload;
