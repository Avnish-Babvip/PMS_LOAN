import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { Input, Textarea } from "../../ReusableInputs";
import { editRole } from "../../../features/actions/role";
import { Spinner } from "../../Loader/Spinner";

export const EditRoleModal = ({ isOpen, onClose, role }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { roleLoading } = useSelector((state) => state.role);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: role?.name,
      description: role?.description,
    },
  });

  const onSubmit = (data) => {
    dispatch(editRole({ payload: data, id: role?.id }))
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
            Edit Role Details
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <Input
            label="Name"
            name="name"
            register={register}
            required
            errors={errors}
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="Write description ..."
            register={register}
            required
            errors={errors}
          />
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={roleLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {roleLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
