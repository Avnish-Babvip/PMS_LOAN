import React from "react";
import { HiX } from "react-icons/hi";

export const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const {
    name,
    sku,
    type,
    description,
    status,
    featured,
    is_new,
    stock,
    stock_message,
    categories_data = [],
    images = [],
    variations = [],
  } = product;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[900px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
        {/* CLOSE */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 border-b">
          <h2 className="text-center text-xl text-black font-semibold">
            Product Details
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* BASIC INFO */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Name" value={name} />
            <Info label="SKU" value={sku} />
            <Info label="Type" value={type} />
            <Info label="Status" value={status} />
            <Info label="Featured" value={featured ? "Yes" : "No"} />
            <Info label="Is New" value={is_new ? "Yes" : "No"} />
            <Info label="Stock" value={stock} />
            <Info label="Stock Message" value={stock_message} />
          </section>

          {/* DESCRIPTION */}
          <section>
            <h4 className="font-medium text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600 bg-white border rounded-lg p-3">
              {description || "—"}
            </p>
          </section>

          {/* CATEGORIES */}
          <section>
            <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories_data.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </section>

          {/* IMAGES */}
          <section>
            <h4 className="font-medium text-gray-700 mb-2">Images</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`border rounded-lg overflow-hidden ${
                    img.is_primary ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}/${img.image}`}
                    alt="Product"
                    className="w-full h-32 object-contain"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* VARIATIONS */}
          {type === "variable" && (
            <section className="space-y-4">
              <h4 className="font-medium text-gray-700">Variations</h4>

              {variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className="bg-white border rounded-xl p-4 space-y-3"
                >
                  <h5 className="font-semibold text-gray-600 text-sm">
                    Variation {index + 1}
                  </h5>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <Info label="SKU" value={variation.sku} />
                    <Info
                      label="Regular Price"
                      value={variation.regular_price}
                    />
                    <Info label="Sale Price" value={variation.sale_price} />
                    <Info label="Stock" value={variation.stock} />
                    <Info
                      label="Low Stock Alert"
                      value={variation.low_stock_alert}
                    />
                  </div>

                  {/* ATTRIBUTES */}
                  {variation.attributes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variation.attributes.map((attr) => (
                        <span
                          key={attr.id}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700"
                        >
                          Attribute :{" "}
                          <span className="text-gray-800 font-semibold">
                            {attr.attribute_name}
                          </span>{" "}
                          | Value :{" "}
                          <span className="text-gray-800 font-semibold">
                            {attr.attribute_value_name}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- SMALL HELPER ---------- */
const Info = ({ label, value }) =>
  value && (
    <div>
      <p className="text-xs  text-gray-500">{label}</p>
      <p className="text-sm capitalize text-gray-800 font-medium">
        {value ?? "—"}
      </p>
    </div>
  );
