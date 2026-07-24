import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { Input, SelectWithId } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { editAgent } from "../../../features/actions/agent";

const EditAgentModal = ({ isOpen, onClose, roles, user }) => {
  const dispatch = useDispatch();

  const { adminUserLoading } = useSelector((state) => state.adminUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      status: 1,
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        role: user?.role || "",
        status: user?.status ? 1 : 0,
      });
    }
  }, [user, isOpen, reset]);

  const onSubmit = (data) => {
    dispatch(
      editAgent({
        id: user?.id,
        payload: data,
      }),
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex h-[95vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                <FiUserPlus size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Edit Agent</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Update agent account information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">
              Agent Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="Username"
                name="username"
                register={register}
                required
                errors={errors}
              />

              <Input
                type="email"
                label="Email Address"
                name="email"
                register={register}
                required
                errors={errors}
              />

              <SelectWithId
                label="Assign Role"
                name="role"
                options={roles}
                register={register}
                required
                errors={errors}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  {...register("status")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#79BF28]"
                >
                  <option value={1}>Active</option>

                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={adminUserLoading}
              type="submit"
              className="flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {adminUserLoading ? <Spinner /> : "Update Agent"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAgentModal;
