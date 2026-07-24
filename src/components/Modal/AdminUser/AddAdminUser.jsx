import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiShield, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { addAdminUser } from "../../../features/actions/adminuser";
import { Spinner } from "../../Loader/Spinner";
import { useEffect } from "react";

const AddAdminUserModal = ({ isOpen, onClose, roles }) => {
  const dispatch = useDispatch();

  const { adminUserLoading } = useSelector((state) => state.adminUser);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const passwordRules = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    validate: {
      hasUppercase: (value) =>
        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",

      hasSpecialChar: (value) =>
        /[^A-Za-z0-9]/.test(value) ||
        "Must contain at least one special character",
    },
  };

  const onSubmit = (data) => {
    dispatch(addAdminUser(data))
      .unwrap()
      .then(() => {
        reset();
        onClose();
      });
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        autoComplete="off"
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
                <h2 className="text-2xl font-bold text-white">
                  Add Admin User
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                  Create a new administrator account
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

              <Input
                label="Password"
                type="password"
                name="password"
                register={register}
                required
                rules={passwordRules}
                errors={errors}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                register={register}
                required
                rules={{
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                errors={errors}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign Roles
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles?.map((role) => (
                    <label
                      key={role.id}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 cursor-pointer hover:border-[#79BF28]"
                    >
                      <input
                        type="checkbox"
                        value={role.label}
                        {...register("roles")}
                        className="mt-1 h-4 w-4 flex-shrink-0 accent-[#79BF28]"
                      />

                      <span className="min-w-0 break-words text-sm text-gray-700 capitalize">
                        {role.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Password Info */}
          <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="mb-3 flex items-center gap-3">
              <FiShield className="text-emerald-600" />

              <h4 className="font-semibold text-emerald-800">
                Password Requirements
              </h4>
            </div>

            <ul className="space-y-2 text-sm text-emerald-700">
              <li>• Minimum 8 characters</li>
              <li>• At least one uppercase letter</li>
              <li>• At least one special character</li>
            </ul>
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
              {adminUserLoading ? <Spinner /> : "Create Admin User"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAdminUserModal;
