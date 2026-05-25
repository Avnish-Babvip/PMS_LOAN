import React from "react";
import { HiX } from "react-icons/hi";

export const ViewHomeModal = ({ isOpen, onClose, section }) => {
  if (!isOpen || !section) return null;

  const {
    section: sectionName,
    title,
    subtitle,
    description,
    button_text,
    button_link,
    apple_button_text,
    apple_button_link,
    playstore_button_text,
    playstore_button_link,
    bg_image,
    created_at,
    updated_at,
  } = section;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
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
            Home Section Details
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* BASIC INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Section Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Section" value={sectionName} />
              <Info label="Title" value={title} />
              <Info label="Subtitle" value={subtitle} />
              <Info label="Description" value={description} />
            </div>
          </section>

          {/* BUTTONS */}
          {(button_text || apple_button_text || playstore_button_text) && (
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Button Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Button Text" value={button_text} />
                <Info label="Button Link" value={button_link} />
                <Info label="Apple Button Text" value={apple_button_text} />
                <Info label="Apple Button Link" value={apple_button_link} />
                <Info
                  label="Playstore Button Text"
                  value={playstore_button_text}
                />
                <Info
                  label="Playstore Button Link"
                  value={playstore_button_link}
                />
              </div>
            </section>
          )}

          {/* IMAGE */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Background Image
            </h4>

            {bg_image ? (
              <img
                src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${bg_image}`}
                className="w-full max-h-[250px] object-contain rounded-lg border"
              />
            ) : (
              <p className="text-sm text-gray-500">No Image</p>
            )}
          </section>

          {/* META */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Meta Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info
                label="Created At"
                value={
                  created_at ? new Date(created_at).toLocaleString() : null
                }
              />
              <Info
                label="Updated At"
                value={
                  updated_at ? new Date(updated_at).toLocaleString() : null
                }
              />
            </div>
          </section>
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

/* ---------- HELPER ---------- */

const Info = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-medium break-words capitalize">
        {value}
      </p>
    </div>
  );
};
