import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { addAdminUser } from "../../../features/actions/adminuser";
import { Spinner } from "../../Loader/Spinner";

const AddAdminUserModal = ({ isOpen, onClose, roles }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { adminUserLoading } = useSelector((state) => state.adminUser);
  const {
    register,
    handleSubmit,
    watch,
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
            Add Admin User
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
              label="Username"
              name="username"
              register={register}
              required
              errors={errors}
            />

            <Input
              type="email"
              label="Email"
              name="email"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="Mobile"
              name="mobile"
              register={register}
              required
              rules={{
                minLength: {
                  value: 10,
                  message: "Mobile number must be of 10 digits",
                },
              }}
              errors={errors}
            />

            <Input
              rules={passwordRules}
              label="Password"
              type="password"
              name="password"
              register={register}
              required
              errors={errors}
            />

            <Input
              rules={{
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              label="Confirm Password"
              type="password"
              name="password_confirmation"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Choose Role"
              name="role_id"
              options={roles}
              register={register}
              required
              errors={errors}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={adminUserLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {adminUserLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddAdminUserModal;
