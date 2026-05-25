import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { SelectWithId, Textarea } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import { editRiderKycStatus } from "../../../features/actions/rider";

export const EditRiderKycStatusModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { riderLoading } = useSelector((state) => state.rider);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kyc_status: user?.kyc_status,
    },
  });
  const selectedStatus = watch("kyc_status");

  const onSubmit = (data) => {
    dispatch(editRiderKycStatus({ payload: data, id: user?.id }))
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
            Edit Rider Kyc Status
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto space-y-3 px-8 pb-6">
          <SelectWithId
            label="Status"
            name="kyc_status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
            register={register}
            required
            errors={errors}
          />
           {selectedStatus === "rejected" && (
  <Textarea
    label="Reason"
    name="rejection_reason"
    placeholder="Write Reason Here ..."
    register={register}
    required
    errors={errors}
  />
)}
        </div>
        

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={riderLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {riderLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
