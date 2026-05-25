import React, { useEffect } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getSingleOrder } from "../../../features/actions/order";

export const ViewOrderModal = ({ isOpen, onClose, id }) => {
  const dispatch = useDispatch();
  const { orderDetails, orderLoading } = useSelector((state) => state.order);

  const billing = orderDetails?.address_snapshot?.billing || {};
  const shipping = orderDetails?.address_snapshot?.shipping || {};
  const estimatedDelivery =
    orderDetails?.address_snapshot?.estimatedDelivery || {};
  const priceSnapshot = orderDetails?.price_snapshot || {};
  const taxCharges = priceSnapshot?.taxes?.taxes_charges || [];
  const cgst = taxCharges.find((t) => t.code === "cgst");
  const sgst = taxCharges.find((t) => t.code === "sgst");
  const igst = taxCharges.find((t) => t.code === "igst");

  const otherCharges = taxCharges.filter(
    (t) => !["cgst", "sgst", "igst"].includes(t.code),
  );
  const discounts = orderDetails?.price_snapshot?.discount?.applied || [];

  const offerDiscount = discounts?.find((d) => d.source === "offer");
  const couponDiscount = discounts?.find((d) => d.source === "coupon");

  const riderAssignments = orderDetails?.rider_assignments || [];
  const paymentTransactions = orderDetails?.payment_transactions || [];
  const refunds = orderDetails?.refunds || [];
  const cancellation = orderDetails?.cancellation || null;

  useEffect(() => {
    if (id) dispatch(getSingleOrder(id));
  }, [id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      {orderLoading ? (
        <div className="bg-[#f9f7f7] w-[95%] sm:w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative animate-pulse">
          {/* HEADER SKELETON */}
          <div className="px-8 pt-8 pb-4 border-b space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded mx-auto"></div>
            <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* BODY SKELETON */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>

                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ITEMS */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div className="space-y-2 pt-4 border-t">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-4 border-t">
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-[#f9f7f7]  w-[95%] sm:w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
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
              Order Details
            </h2>
            <p className="text-center text-gray-500 mt-1">
              #{orderDetails?.order_number}
            </p>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* ORDER DATE */}
            <section>
              <Info
                label="Order Date"
                value={new Date(orderDetails?.created_at).toLocaleString()}
              />
            </section>

            {/* ORDER & PAYMENT STATUS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Order & Payment Status
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Info label="Order Status" value={orderDetails?.status} />

                <Info
                  label="Payment Method"
                  value={orderDetails?.payment_method}
                />

                <Info
                  label="Payment Status"
                  value={orderDetails?.payment_status}
                />
              </div>
            </section>
            {/* CUSTOMER INFO */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Customer Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Name" value={orderDetails?.customer?.name} />
                <Info label="Email" value={orderDetails?.customer?.email} />
                <Info label="Mobile" value={orderDetails?.customer?.mobile} />
                <Info label="Status" value={orderDetails?.customer?.status} />
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
                  value={`${billing.address_line_1}, ${billing.address_line_2}, ${billing.city?.name}, ${billing.state?.name}, ${billing.country?.name}, ${billing.pincode}`}
                />
                <Info
                  label="Shipping Address"
                  value={`${shipping.address_line_1}, ${shipping.address_line_2}, ${shipping.city?.name}, ${shipping.state?.name}, ${shipping.country?.name}, ${shipping.pincode}`}
                />
                <Info
                  label="Estimated Delivery"
                  value={estimatedDelivery?.note}
                />
              </div>
            </section>

            {/* ITEMS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
              <div className="space-y-2">
                {orderDetails?.items?.map((item) => (
                  <div key={item.id} className="border-b pb-2">
                    {/* ITEM NAME & QTY/PRICE */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-600">
                          {item?.name}
                        </p>
                        <p className="text-gray-700 text-sm">
                          Qty: {item?.quantity} | Price: ₹{item?.price}
                        </p>
                      </div>
                      <p className="font-medium text-gray-700">
                        ₹{item?.total}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">
                      SKU: {item?.variation_snapshot?.sku}
                    </p>
                    {/* ITEM ATTRIBUTES */}
                    {item?.variation_snapshot?.attributes?.length > 0 && (
                      <div className="mt-1 text-sm text-gray-500 flex  gap-2">
                        {item?.variation_snapshot?.attributes?.map((attr) => (
                          <p key={attr?.attribute_id} className="capitalize">
                            {attr?.attribute_name}: {attr?.attribute_value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* RIDER ASSIGNMENTS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Rider Assignment
              </h4>

              {riderAssignments.length === 0 ? (
                <p className="text-sm text-gray-500">No Rider Assigned</p>
              ) : (
                <div className="space-y-3 text-gray-600">
                  {riderAssignments.map((rider) => (
                    <div
                      key={rider?.id}
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rider Name</span>
                        <span className="capitalize font-medium text-gray-800">
                          {rider?.rider?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="capitalize font-medium text-gray-800">
                          {rider?.delivery_status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned At</span>
                        <span>
                          {rider?.assigned_at
                            ? new Date(rider?.assigned_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Picked At</span>
                        <span>
                          {rider?.picked_at
                            ? new Date(rider?.picked_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered At</span>
                        <span>
                          {rider?.delivered_at
                            ? new Date(rider?.delivered_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* REFUNDS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Refund Details
              </h4>

              {refunds.length === 0 ? (
                <p className="text-sm text-gray-500">No Refunds</p>
              ) : (
                <div className="space-y-3">
                  {refunds?.map((refund) => (
                    <div
                      key={refund.id}
                      className="border text-gray-600 rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium">₹{refund?.amount}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span
                          className={`capitalize font-medium ${
                            refund?.status === "failed"
                              ? "text-red-600"
                              : refund?.status === "success"
                                ? "text-green-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {refund?.status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Reason</span>
                        <span>{refund?.reason || "—"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested At</span>
                        <span>
                          {refund?.requested_at
                            ? new Date(refund?.requested_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* CANCELLATION DETAILS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Cancellation Details
              </h4>

              {!cancellation ? (
                <p className="text-sm text-gray-500">Order Not Cancelled</p>
              ) : (
                <div className="border text-gray-600 rounded-lg p-3 bg-gray-50 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled By</span>
                    <span className="capitalize">
                      {cancellation?.cancelled_by}
                    </span>
                  </div>

                  <div className="flex justify-between gap-36">
                    <span className="text-gray-600">Reason</span>
                    <span>{cancellation?.reason || "—"}</span>
                  </div>

                  <div className="flex justify-between gap-36">
                    <span className="text-gray-600">Note</span>
                    <span>{cancellation?.note || "—"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled At</span>
                    <span>
                      {cancellation?.cancelled_at
                        ? new Date(cancellation?.cancelled_at).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* PAYMENT TRANSACTIONS */}
            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Payment Transactions
              </h4>

              {paymentTransactions.length === 0 ? (
                <p className="text-sm text-gray-500">No Payment Transactions</p>
              ) : (
                <div className="space-y-3 text-gray-600">
                  {paymentTransactions.map((txn) => (
                    <div
                      key={txn?.id}
                      className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-medium">
                          {txn?.transaction_id}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="capitalize">{txn?.status}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span>₹{txn?.amount}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span>
                          {txn?.created_at
                            ? new Date(txn?.created_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h4 className="font-semibold text-gray-700 mb-3">
                Taxes & Charges
              </h4>

              <div className="space-y-2">
                {cgst && (
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>CGST ({cgst.value}%)</span>
                    <span>₹{cgst?.amount}</span>
                  </div>
                )}

                {sgst && (
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>SGST ({sgst.value}%)</span>
                    <span>₹{sgst?.amount}</span>
                  </div>
                )}

                {igst && (
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>IGST ({igst.value}%)</span>
                    <span>₹{igst?.amount}</span>
                  </div>
                )}

                {otherCharges?.map((charge) => (
                  <div
                    key={charge?.code}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>{charge?.name}</span>
                    <span>₹{charge?.amount}</span>
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
      )}
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
