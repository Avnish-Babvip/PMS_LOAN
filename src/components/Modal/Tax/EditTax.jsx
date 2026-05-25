import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import { editTax } from "../../../features/actions/tax";

export const EditTaxModal = ({ isOpen, onClose, tax }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { taxLoading } = useSelector((state) => state.tax);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: tax?.code,
      name: tax?.name,
      value: tax?.value,
      type: tax?.type,
      is_active: tax?.is_active,
    },
  });

  const type = watch("type");

  const onSubmit = (data) => {
    dispatch(
      editTax({
        payload: { ...data, is_active: data.is_active === "true" ? 1 : 0 },
        id: tax?.id,
      }),
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
            Edit Tax Details
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
              label="Code"
              name="code"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Type"
              name="type"
              options={[
                { label: "Fixed", value: "fixed" },
                { label: "Percentage", value: "percentage" },
              ]}
              register={register}
              required
              errors={errors}
            />
            <Input
              label={`Value (${type === "percentage" ? "%" : "₹"})`}
              placeholder={
                type === "percentage"
                  ? "Enter percentage (e.g. 10)"
                  : "Enter fixed (e.g. 200)"
              }
              name="value"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Status"
              name="is_active"
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
              register={register}
              required
              errors={errors}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={taxLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {taxLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
