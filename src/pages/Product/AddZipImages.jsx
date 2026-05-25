import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addZipImages } from "../../features/actions/product";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AddZipImages = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [fileName, setFileName] = useState("");

  const { productLoading, bulkZipResult } = useSelector(
    (state) => state.product,
  ); // 👈 change if your key is different

  const handleChooseFile = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const formData = new FormData();
    formData.append("zip_file", file);

    dispatch(addZipImages(formData));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {/* ================= UPLOAD UI ================= */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-brand-green/10 flex items-center justify-center">
              <FiUploadCloud className="text-2xl text-brand-green" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Upload Product Images
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a ZIP file containing product images
          </p>

          <button
            onClick={handleChooseFile}
            disabled={productLoading}
            className="mt-6 w-full bg-brand-green hover:bg-lime-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-60"
          >
            {productLoading ? "Uploading..." : "Choose ZIP File"}
          </button>

          {fileName && (
            <p className="mt-3 text-xs text-gray-500 truncate">{fileName}</p>
          )}

          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            accept=".zip"
            className="hidden"
          />
        </div>

        {/* ================= RESPONSE UI ================= */}
        {bulkZipResult && (
          <div className="mt-8 border-t pt-6 space-y-4">
            {/* STATUS */}
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${
                bulkZipResult.status ? "text-green-600" : "text-red-500"
              }`}
            >
              {bulkZipResult.status ? <FiCheckCircle /> : <FiAlertCircle />}
              {bulkZipResult.status
                ? "Upload Completed"
                : "Upload Completed with Errors"}
            </div>

            {/* COUNTS */}
            <div className="flex gap-6 text-sm">
              <span className="text-green-600 font-medium">
                Uploaded: {bulkZipResult.uploaded_count}
              </span>

              <span className="text-red-500 font-medium">
                Failed: {bulkZipResult.failed_count}
              </span>
            </div>

            {/* FAILED IMAGES */}
            {/* FAILED IMAGES */}
            {bulkZipResult.failed_images?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b bg-red-100">
                  <p className="text-sm font-semibold text-red-700">
                    Failed Images ({bulkZipResult.failed_images.length})
                  </p>
                </div>

                <div className="divide-y">
                  {bulkZipResult.failed_images.map((item, i) => (
                    <div key={i} className="p-4 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.image}
                      </span>
                      <span className="text-xs text-red-500">{item.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ================= END ================= */}
      </div>
    </div>
  );
};

export default AddZipImages;
