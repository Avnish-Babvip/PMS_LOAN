import React from "react";
import { HiX } from "react-icons/hi";

export const ViewRiderModal = ({ isOpen, onClose, rider }) => {
  if (!isOpen || !rider) return null;

  const {
    admin = {},
    address = {},
    location = {},
    profile_status,
    vehicle_type,
    vehicle_number,
    license_number,
  } = rider;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
        {/* CLOSE BUTTON */}
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
            Rider Details
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* BASIC INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Name" value={admin.name} />
              <Info label="Email" value={admin.email} />
              <Info label="Username" value={admin.username} />
              <Info label="Mobile" value={admin.mobile} />
              <Info label="Status" value={admin.status} />
              <Info label="Profile Status" value={profile_status} />
            </div>
          </section>

          {/* ADDRESS INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Address Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Address Line 1" value={address.address_line_1} />
              <Info label="Address Line 2" value={address.address_line_2} />
              <Info label="Pincode" value={address.pincode} />
              <Info label="City" value={location.city} />
              <Info label="State" value={location.state} />
              <Info label="Country" value={location.country} />
            </div>
          </section>

          {/* VEHICLE INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Vehicle Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Vehicle Type" value={vehicle_type} />
              <Info label="Vehicle Number" value={vehicle_number} />
              <Info label="License Number" value={license_number} />
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
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-gray-800 font-medium capitalize">
      {value || "—"}
    </p>
  </div>
);
