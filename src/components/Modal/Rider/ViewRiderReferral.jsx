import React from "react";
import { HiX } from "react-icons/hi";

export const ViewRiderReferralModal = ({ isOpen, onClose, referral }) => {
  if (!isOpen || !referral) return null;

  const {
    rider_id,
    name,
    email,
    referral_code,
    total_used,
    total_earned,
    wallet_balance,
    status,
  } = referral;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[700px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
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
            Rider Referral Details
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* BASIC INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Rider Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Rider ID" value={rider_id} />
              <Info label="Name" value={name} />
              <Info label="Email" value={email} />
              <Info label="Status" value={status} />
            </div>
          </section>

          {/* REFERRAL INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Referral Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Referral Code" value={referral_code} />
              <Info label="Total Used" value={total_used} />
              <Info
                label="Total Earned"
                value={total_earned ? `₹${total_earned}` : "₹0"}
              />
              <Info label="Wallet Balance" value={`₹${wallet_balance}`} />
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
      {value ?? "—"}
    </p>
  </div>
);
