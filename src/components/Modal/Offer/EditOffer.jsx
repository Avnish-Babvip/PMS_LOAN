import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import { editOffer } from "../../../features/actions/offer";

export const EditOfferModal = ({ isOpen, onClose, offer }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { offerLoading } = useSelector((state) => state.offer);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: offer?.name,
      status: offer?.status,
      discount_value: offer?.discount_value,
      discount_type: offer?.discount_type,
      end_at: offer?.end_at,
      start_at: offer?.start_at,
      min_cart_value: offer?.min_cart_value,
    },
  });

  const discountType = watch("discount_type");

  const onSubmit = (data) => {
    dispatch(
      editOffer({ payload: { ...data, apply_on: "cart" }, id: offer?.id }),
    )
      .unwrap()
      .then(() => {
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
          w-[95%] sm:w-[900px]   /* wider modal */
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
            Edit Offer Details
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {/* ✅ GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Name"
              name="name"
              register={register}
              required
              errors={errors}
            />
            <Input
              type="number"
              label="Min Cart Value"
              name="min_cart_value"
              register={register}
              required
              errors={errors}
            />
            <Input
              type="datetime-local"
              label="Start At"
              name="start_at"
              register={register}
              required
              errors={errors}
            />

            <Input
              type="datetime-local"
              label="End At"
              name="end_at"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Discount Type"
              name="discount_type"
              options={[
                { label: "Flat", value: "flat" },
                { label: "Percentage", value: "percentage" },
              ]}
              register={register}
              required
              errors={errors}
            />
            <Input
              type="number"
              label={`Discount Value (${discountType === "percentage" ? "%" : "₹"})`}
              placeholder={
                discountType === "percentage"
                  ? "Enter percentage (e.g. 10)"
                  : "Enter flat discount (e.g. 200)"
              }
              name="discount_value"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Status"
              name="status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              register={register}
              required
              errors={errors}
            />

            {/* ✅ FULL WIDTH FIELD */}
            {/* <div className="md:col-span-2">
              <Textarea
                label="Remarks"
                name="remarks"
                placeholder="Write remarks ..."
                register={register}
                required
                errors={errors}
              />
            </div> */}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={offerLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {offerLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
