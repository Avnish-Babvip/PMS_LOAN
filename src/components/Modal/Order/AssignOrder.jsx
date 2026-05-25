import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import {
  assignOrder,
  customerNotification,
} from "../../../features/actions/order";
import { getAllRiders } from "../../../features/actions/rider";
import Select from "react-select"; // searchable dropdown

export const AssignOrderModal = ({ isOpen, onClose, id, customerId }) => {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { orderLoading } = useSelector((state) => state.order);
  const { adminData } = useSelector((state) => state.authentication);
  const loginToken = adminData?.token;
  const { riderData } = useSelector((state) => state.rider); // assuming you store fetched riders here
  const [options, setOptions] = useState([]);
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load riders when modal opens
  useEffect(() => {
    if (id) {
      dispatch(
        getAllRiders({
          per_page: 1000,
        }),
      );
    }
  }, [id, dispatch]);
  // Transform riders into react-select options
  useEffect(() => {
    if (riderData?.data) {
      const opts = riderData.data.map((r) => ({
        value: r?.admin?.id,
        label: `${r?.admin?.name} (${r?.admin?.email || "No Email"})`,
      }));
      setOptions(opts);
    }
  }, [riderData]);

  const onSubmit = (data) => {
    const payload = {
      customer_ids: [customerId],
      title: "Order Shipped",
      message: "Your order has been shipped successfully",
      type: "order",
      extra: {
        order_id: id,
      },
    };

    dispatch(assignOrder({ rider_id: data.rider_id, order_id: id }))
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
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[650px] max-h-[90vh] rounded-xl shadow-xl relative overflow-y-auto">
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
          <h2 className="text-center text-black text-xl font-semibold mb-2">
            Assign New Rider
          </h2>

          {/* <p className="text-center text-sm text-gray-500">
            City:{" "}
            <span className="font-medium text-gray-700">{city?.name}</span>
          </p> */}
        </div>

        {/* BODY */}
        <div className="px-8 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Rider Name
          </label>

          <Select
            options={options}
            isSearchable
            placeholder="Type rider name"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: "12px",
                minHeight: "46px",
                borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#2563eb" },
              }),

              menu: (base) => ({
                ...base,
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "6px",
              }),

              menuList: (base) => ({
                ...base,
                paddingTop: "6px",
                paddingBottom: "6px",
              }),

              option: (base, state) => ({
                ...base,
                padding: "12px 16px", // 👈 better spacing
                fontSize: "14px",
                color: "#111827",
                backgroundColor: state.isFocused
                  ? "#f3f4f6"
                  : state.isSelected
                    ? "#e5e7eb"
                    : "#ffffff",
                cursor: "pointer",
              }),

              singleValue: (base) => ({
                ...base,
                color: "#111827",
              }),

              placeholder: (base) => ({
                ...base,
                color: "#6b7280",
              }),
            }}
            onChange={(selected) =>
              setValue("rider_id", selected?.value, { shouldValidate: true })
            }
          />

          {errors.rider_id && (
            <p className="text-red-500 text-sm mt-1">Rider is required</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={orderLoading}
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white transition"
          >
            {orderLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
