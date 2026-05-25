import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { Input, Select } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { editCommission } from "../../../features/actions/commission";

export const EditCommissionModal = ({ isOpen, onClose, commission }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { commissionLoading } = useSelector((state) => state.commission);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: commission?.type,
      value: commission?.value,
      is_active: commission?.is_active ? "Yes" : "No",
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      is_active: data.is_active === "Yes",
    };
    dispatch(editCommission({ payload: payload, id: commission?.id }))
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
            Edit Commission Value
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-2">
          <Input
            disabled
            label="Type"
            name="type"
            register={register}
            required
            errors={errors}
          />
          <Input
            label="Value"
            name="value"
            register={register}
            required
            errors={errors}
          />

          <Select
            options={["Yes", "No"]}
            label="Active"
            name="is_active"
            register={register}
            required
            errors={errors}
          />
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={commissionLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {commissionLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
