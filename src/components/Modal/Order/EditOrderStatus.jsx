import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { SelectWithId } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import {
  customerNotification,
  editOrderStatus,
} from "../../../features/actions/order";

export const EditOrderStatusModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.authentication);
  const loginToken = adminData?.token;
  const { orderLoading } = useSelector((state) => state.order);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: user?.status,
    },
  });

  const statusMessages = {
    placed: {
      title: "Order Placed",
      message: "Your order has been placed",
    },
    confirmed: {
      title: "Order Confirmed",
      message: "Your order has been confirmed",
    },
    shipped: {
      title: "Order Shipped",
      message: "Your order has been shipped successfully",
    },
    failed: {
      title: "Order Failed",
      message: "Your order has been failed successfully",
    },
    cancelled: {
      title: "Order Cancelled",
      message: "Your order has been cancelled",
    },
  };

  const statusFlow = [
    { label: "Pending", value: "pending" },
    { label: "Placed", value: "placed" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Failed", value: "failed" },
    { label: "Shipped", value: "shipped" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const currentIndex = statusFlow.findIndex(
    (status) => status.value === user?.status,
  );

  const statusOptions = statusFlow.slice(currentIndex);

  const onSubmit = (data) => {
    const statusInfo = statusMessages[data.status];

    const payload = {
      customer_ids: [user.customerId],
      title: statusInfo.title,
      message: statusInfo.message,
      type: "order",
      extra: {
        order_id: user.id,
      },
    };

    dispatch(editOrderStatus({ payload: data, id: user?.id }))
      .unwrap()
      .then(() => {
        dispatch(customerNotification({ payload, loginToken }));
        onClose();
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        className="
          bg-[#f9f7f7]
          w-[95%] sm:w-[600px]   /* wider modal */
          max-h-[85vh]
          rounded-xl shadow-xl relative
          flex flex-col
        "
      >
        {/* CLOSE */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8">
          <h2 className="text-center text-black text-xl font-semibold mb-6">
            Edit Order Status
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <SelectWithId
            label="Order Status"
            name="status"
            options={statusOptions}
            register={register}
            required
            errors={errors}
          />
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={orderLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {orderLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
