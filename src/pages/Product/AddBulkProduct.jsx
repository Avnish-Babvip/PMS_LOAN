import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBulkProduct } from "../../features/actions/product";

const AddBulkProduct = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const { bulkData, productLoading } = useSelector((state) => state.product);

  const handleChooseFile = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    dispatch(addBulkProduct(formData));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="font-semibold text-gray-800">Add Bulk Product</h2>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleChooseFile}
            disabled={productLoading}
            className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {productLoading ? "Uploading..." : "Upload CSV / Excel"}
          </button>

          {fileName && (
            <span className="text-sm text-gray-500">{fileName}</span>
          )}
        </div>
      </div>

      {/* HIDDEN INPUT */}
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        accept=".csv, .xlsx, .xls"
        className="hidden"
      />

      {/* ================= RESPONSE UI ================= */}
      {/* ================= RESPONSE UI ================= */}
      {bulkData && (
        <div className="p-6 space-y-6">
          {/* RESULT BANNER */}
          <div className="rounded-xl border p-4 flex flex-wrap gap-4 items-center justify-between bg-gray-50">
            <div className="text-sm font-semibold text-gray-700">
              Bulk Upload Result
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                Uploaded: {bulkData.uploaded_count}
              </span>

              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600">
                Failed: {bulkData.failed_count}
              </span>
            </div>
          </div>

          {/* FAILED ROWS */}
          {bulkData.failed_rows?.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-red-50 border-b font-semibold text-red-600 text-sm">
                Failed Records
              </div>

              <div className="max-h-[350px] overflow-y-auto divide-y">
                {bulkData.failed_rows.map((row, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 transition">
                    {/* ROW HEADER */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">
                        {row.product_name}
                      </p>

                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 text-gray-700">
                        Row {row.row}
                      </span>
                    </div>

                    {/* ERRORS */}
                    <div className="flex flex-wrap gap-2">
                      {row.errors.map((err, index) => (
                        <span
                          key={index}
                          className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md"
                        >
                          {err}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {bulkData.failed_count === 0 && (
            <div className="p-4 rounded-xl bg-green-50 text-green-700 font-medium text-sm">
              🎉 All products uploaded successfully.
            </div>
          )}
        </div>
      )}
      {/* ================= END ================= */}

      {/* ================= END ================= */}
    </div>
  );
};

export default AddBulkProduct;
