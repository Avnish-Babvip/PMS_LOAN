import React from "react";
import { HiX } from "react-icons/hi";

export const ViewAssignOrder = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[700px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
        {/* CLOSE */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 border-b">
          <h2 className="text-center text-xl text-gray-800 font-semibold">
            Assign Order Details
          </h2>
          <p className="text-center text-gray-500 mt-1">
            #{data?.order?.order_number}
          </p>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Rider Info */}
          <Section title="Rider Info">
            <Info label="Rider Name" value={data?.rider?.admin?.name} />
            <Info label="Rider ID" value={data?.rider_id} />
          </Section>

          {/* Delivery Info */}
          <Section title="Delivery Status">
            <Info label="Delivery Status" value={data?.delivery_status} />
            <Info label="Failure Reason" value={data?.failure_reason} />
          </Section>

          {/* Timeline */}
          <Section title="Timeline">
            <Info label="Assigned At" value={formatDate(data?.assigned_at)} />
            <Info label="Picked At" value={formatDate(data?.picked_at)} />
            <Info label="Delivered At" value={formatDate(data?.delivered_at)} />
            <Info label="Failed At" value={formatDate(data?.failed_at)} />
          </Section>

          {/* Order Summary */}
          <Section title="Order Summary">
            <Info label="Order Status" value={data?.order?.status} />
            <Info label="Total Amount" value={`₹${data?.order?.total}`} />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-4 border-t">
          <button
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

/* ---------- SECTION ---------- */
const Section = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

/* ---------- INFO ---------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-gray-800 font-medium capitalize">
      {value || "—"}
    </p>
  </div>
);
