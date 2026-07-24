import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiShield, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { editAdminUser } from "../../../features/actions/adminuser";

const EditAdminUserModal = ({ isOpen, onClose, roles, user }) => {
  const dispatch = useDispatch();

  const { adminUserLoading } = useSelector((state) => state.adminUser);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      is_active: 1,
      roles: [],
    },
  });

  const password = watch("password");

  const passwordRules = {
    validate: {
      minLength: (value) =>
        !value || value.length >= 8 || "Password must be at least 8 characters",

      hasUppercase: (value) =>
        !value ||
        /[A-Z]/.test(value) ||
        "Must contain at least one uppercase letter",

      hasSpecialChar: (value) =>
        !value ||
        /[^A-Za-z0-9]/.test(value) ||
        "Must contain at least one special character",
    },
  };

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        is_active: user?.is_active ? 1 : 0,
        roles: user?.roles || [],
      });
    }
  }, [user, isOpen, reset]);

  const onSubmit = (data) => {
    const payload = { ...data };

    // Don't send password fields if they are empty
    if (!payload.password?.trim()) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    dispatch(
      editAdminUser({
        id: user?.id,
        payload,
      }),
    )
      .unwrap()
      .then(() => {
        reset();
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
        <div className="relative shrink-0 overflow-hidden border-b border-gray-100 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                <FiUserPlus size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Edit Admin User
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                  Edit administrator account details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">
              Administrator Information
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
                type="email"
                label="Email Address"
                name="email"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="Mobile Number"
                name="phone"
                register={register}
                required
                rules={{
                  minLength: {
                    value: 10,
                    message: "Mobile number must be 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Mobile number must be 10 digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                }}
                errors={errors}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  {...register("is_active")}
                  className="w-full text-gray-700 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#79BF28]"
                >
                  <option value={1}>Active</option>

                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign Roles
                </label>

                <div className="grid grid-cols-1  sm:grid-cols-2 gap-3">
                  {roles?.map((role) => (
                    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 cursor-pointer hover:border-[#79BF28]">
                      <input
                        type="checkbox"
                        value={role.label}
                        {...register("roles")}
                        className="h-4 w-4 accent-[#79BF28]"
                      />

                      <span className="text-sm capitalize text-gray-700">
                        {role.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              Change Password
            </h3>

            <p className="mt-1 mb-6 text-sm text-gray-500">
              Leave these fields blank if you don't want to change the password.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="New Password"
                type="password"
                name="password"
                register={register}
                rules={passwordRules}
                errors={errors}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                register={register}
                rules={{
                  validate: (value) => {
                    if (!password) return true; // Don't validate if password is empty

                    if (!value) return "Please confirm your password";

                    return value === password || "Passwords do not match";
                  },
                }}
                errors={errors}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <FiShield />
                Password Requirements
              </div>

              <ul className="mt-3 space-y-1 text-sm text-emerald-700">
                <li>• Leave blank to keep the current password.</li>
                <li>• Minimum 8 characters.</li>
                <li>• At least one uppercase letter.</li>
                <li>• At least one special character.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-8 py-5">
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
              {adminUserLoading ? <Spinner /> : "Update Admin User"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAdminUserModal;
