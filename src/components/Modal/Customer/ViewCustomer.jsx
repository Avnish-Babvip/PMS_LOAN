import React, { useEffect } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleCustomer,
  getSingleCustomerAddresses,
} from "../../../features/actions/customer";

export const ViewCustomerModal = ({ isOpen, onClose, id }) => {
  const {
    customerDetails,
    customerAddressDetails,
    customerAddressLoading,
    customerLoading,
  } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const customer = customerDetails || {};
  const addresses = customerAddressDetails?.billing_addresses || [];

  useEffect(() => {
    if (id) {
      dispatch(getSingleCustomer(id));
      dispatch(getSingleCustomerAddresses(id));
    }
  }, [id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[650px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
        {/* CLOSE */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 border-b text-center">
          <h2 className="text-xl font-semibold text-black">Customer Details</h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {customerLoading ? (
            <>
              {/* PROFILE SKELETON */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="mt-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="mt-2 h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* INFO GRID SKELETON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* PROFILE */}
              <div className="flex flex-col items-center">
                <img
                  loading="lazy"
                  src={
                    customer?.profile_image
                      ? `${import.meta.env.VITE_REACT_APP_IMAGE_URL}/${customer.profile_image}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <p className="mt-2 font-semibold text-gray-800">
                  {customer?.name}
                </p>
                <p className="text-sm text-gray-500">@{customer?.username}</p>
              </div>

              {/* CUSTOMER INFO */}
              <section>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Customer Info
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Email" value={customer?.email} />
                  <Info label="Mobile" value={customer?.mobile} />
                  <Info label="Referral Code" value={customer?.referral_code} />
                  <Info label="Status" value={customer?.status} />
                  <Info
                    label="Last Login"
                    value={
                      customer?.last_login_at
                        ? new Date(customer.last_login_at).toLocaleString()
                        : "—"
                    }
                  />
                  <Info
                    label="Joined At"
                    value={
                      customer?.created_at
                        ? new Date(customer.created_at).toLocaleString()
                        : "—"
                    }
                  />
                </div>
              </section>

              {/* ADDRESSES */}
              <section>
                <h4 className="font-semibold text-gray-700 mb-3">Addresses</h4>

                {customerAddressLoading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border bg-white space-y-2 animate-pulse"
                      >
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <p className="text-sm text-gray-500">No addresses found</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-lg border bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">
                              {addr.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.mobile}
                            </p>
                          </div>

                          {addr.is_default_shipping && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                          {addr.address_line_1}, {addr.address_line_2}
                        </p>

                        <p className="text-sm text-gray-600">
                          {addr.city_name}, {addr.state_name},{" "}
                          {addr.country_name} - {addr.pincode}
                        </p>

                        {addr.landmark && (
                          <p className="text-xs text-gray-500 mt-1">
                            Landmark: {addr.landmark}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
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

/* ---------- HELPER ---------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-gray-800 font-medium capitalize">
      {value || "—"}
    </p>
  </div>
);
