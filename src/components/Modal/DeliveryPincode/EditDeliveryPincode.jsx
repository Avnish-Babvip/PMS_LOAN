import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import { updatePincode } from "../../../features/actions/location";

export const EditDeliveryPincodeModal = ({ isOpen, onClose, pincode }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { locationLoading } = useSelector((state) => state.location);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pincode: pincode?.pincode,
      city: pincode?.city,
      state: pincode?.state,
      min_days: pincode?.min_days,
      max_days: pincode?.max_days,
      is_deliverable: pincode?.is_deliverable,
      is_active: pincode?.is_active ? 1 : 0,
      courier_name: pincode?.courier_name,
    },
  });

  const isActive = watch("is_active");

  const onSubmit = (data) => {
    dispatch(updatePincode({ payload: data, id: pincode?.id }))
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  useEffect(() => {
    setValue("is_deliverable", isActive);
  }, [isActive, setValue]);

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
            Edit Pincode Details
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {/* ✅ GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Pincode"
              name="pincode"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="City"
              name="city"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="State"
              name="state"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="Min Days"
              name="min_days"
              register={register}
              required
              errors={errors}
            />

            <Input
              label="Max Days"
              name="max_days"
              register={register}
              required
              errors={errors}
            />

            <Input
              label="Courier Name"
              name="courier_name"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Deliverable"
              name="is_active"
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
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
            disabled={locationLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {locationLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
