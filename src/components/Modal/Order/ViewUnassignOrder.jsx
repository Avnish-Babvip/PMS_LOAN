import React from "react";
import { HiX } from "react-icons/hi";

export const ViewUnassignedOrderModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const billing = data?.address_snapshot?.billing || {};
  const shipping = data?.address_snapshot?.shipping || {};
  const estimatedDelivery = data?.address_snapshot?.estimatedDelivery || {};

  const priceSnapshot = data?.price_snapshot || {};
  const taxCharges = priceSnapshot?.taxes?.taxes_charges || [];
  const cgst = taxCharges.find((t) => t.code === "cgst");
  const sgst = taxCharges.find((t) => t.code === "sgst");
  const igst = taxCharges.find((t) => t.code === "igst");

  const otherCharges = taxCharges.filter(
    (t) => !["cgst", "sgst", "igst"].includes(t.code),
  );
  const discounts = data?.price_snapshot?.discount?.applied || [];

  const offerDiscount = discounts?.find((d) => d.source === "offer");
  const couponDiscount = discounts?.find((d) => d.source === "coupon");

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
          <h2 className="text-center text-xl text-gray-800 font-semibold">
            Unassigned Order Details
          </h2>
          <p className="text-center text-gray-500 mt-1">
            #{data?.order_number}
          </p>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* ORDER DATE */}
          <section>
            <Info label="Order Date" value={formatDate(data?.created_at)} />
          </section>

          {/* ORDER & PAYMENT STATUS */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Order & Payment Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label="Order Status" value={data?.status} />

              <Info label="Payment Method" value={data?.payment_method} />

              <Info label="Payment Status" value={data?.payment_status} />
            </div>
          </section>

          {/* CUSTOMER INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">Customer Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Name" value={data?.customer?.name} />
              <Info label="Mobile" value={data?.customer?.mobile} />
            </div>
          </section>

          {/* ADDRESS INFO */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Billing & Shipping
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info
                label="Billing Address"
                value={`${billing.address_line_1 || ""}, ${billing.address_line_2 || ""}, ${billing.city?.name || ""}, ${billing.state?.name || ""}, ${billing.country?.name || ""}, ${billing.pincode || ""}`}
              />
              <Info
                label="Shipping Address"
                value={`${shipping.address_line_1 || ""}, ${shipping.address_line_2 || ""}, ${shipping.city?.name || ""}, ${shipping.state?.name || ""}, ${shipping.country?.name || ""}, ${shipping.pincode || ""}`}
              />
              <Info
                label="Estimated Delivery"
                value={estimatedDelivery?.note}
              />
            </div>
          </section>

          {/* ORDER ITEMS */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
            <div className="space-y-2">
              {data?.items?.map((item) => (
                <div key={item.id} className="border-b pb-2">
                  {/* ITEM NAME & QTY/PRICE */}
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-600">
                        {item?.product?.name}
                      </p>
                      <p className="text-gray-700 text-sm">
                        Qty: {item?.quantity} | Price: ₹{item?.price}
                      </p>
                    </div>
                  </div>

                  {/* ITEM ATTRIBUTES */}
                  {item?.variation_snapshot?.attributes?.length > 0 && (
                    <div className="mt-1 text-sm text-gray-500 flex  gap-2">
                      {item?.variation_snapshot?.attributes?.map((attr) => (
                        <p key={attr?.attribute_id} className="capitalize">
                          {attr?.attribute_value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-semibold text-gray-700 mb-3">
              Taxes & Charges
            </h4>

            <div className="space-y-2">
              {cgst && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>CGST ({cgst.value}%)</span>
                  <span>₹{cgst.amount}</span>
                </div>
              )}

              {sgst && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>SGST ({sgst.value}%)</span>
                  <span>₹{sgst.amount}</span>
                </div>
              )}

              {igst && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>IGST ({igst.value}%)</span>
                  <span>₹{igst.amount}</span>
                </div>
              )}

              {otherCharges.map((charge) => (
                <div
                  key={charge.code}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{charge.name}</span>
                  <span>₹{charge.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DISCOUNTS */}

          {offerDiscount?.offer_details?.map((offer) => (
            <div
              key={offer.id}
              className="flex justify-between text-green-600 text-sm"
            >
              <span>Offer Applied ({offer.name})</span>
              <span>-₹{offer.discount_value}</span>
            </div>
          ))}

          {couponDiscount && (
            <div className="flex justify-between text-green-600">
              <span className="text-sm">
                Coupon Applied ({couponDiscount.code})
              </span>
              <span className="font-medium">
                -₹{couponDiscount.discount_amount}
              </span>
            </div>
          )}

          {/* PAYMENT & TOTALS */}
          <section className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-800">
              <span>Subtotal</span>
              <span>₹{priceSnapshot?.subtotal}</span>
            </div>

            <div className="flex justify-between text-sm text-green-600">
              <span>Total Discount</span>
              <span>-₹{priceSnapshot?.discount?.total}</span>
            </div>

            <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
              <span>Grand Total</span>
              <span>₹{priceSnapshot?.grand_total}</span>
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
