import { useEffect, useRef, useState } from "react";
import { TbTrash, TbUpload } from "react-icons/tb";

const PhotoUploadField = ({ label = "Photo", value, onChange, error }) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // ✅ clear file input
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-gray-700 text-sm font-medium">{label}</label>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl border border-gray-300 bg-gray-100 overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:border-blue-500 text-gray-700">
              <TbUpload size={16} />
              {preview ? "Change Photo" : "Upload Photo"}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(file);
              }}
            />
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <TbTrash size={14} />
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhotoUploadField;
