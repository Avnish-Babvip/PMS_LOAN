import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import { updateAdminProfile } from "../../features/actions/authentication";

export default function Profile() {
  return (
    <>
      <div className="min-h-screen py-5 px-4  space-y-10">
        {/* ================= PROFILE FORM ================= */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm  p-8 md:p-12">
          <ProfileForm />
        </div>
      </div>
    </>
  );
}

function ProfileForm() {
  const dispatch = useDispatch();
  const { adminData, isLoading } = useSelector((state) => state.authentication);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    if (!adminData?.admin) return;

    const admin = adminData?.admin;

    reset({
      name: admin?.name || "",
      email: admin?.email || "",
      mobile: admin?.mobile || "",
    });
  }, [adminData, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
    };

    await dispatch(updateAdminProfile(payload)).unwrap();
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Profile Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Name"
            register={register("name", {
              required: "Name is required",
            })}
            error={errors.name}
          />

          <InputField
            label="Email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email}
          />

          <InputField
            label="Mobile"
            register={register("mobile", {
              required: "Mobile is required",
            })}
            error={errors.mobile}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-44 hover:bg-emerald-600 transition shadow-md"
          >
            {isLoading ? <Spinner /> : "Update Profile"}
          </button>
        </div>
      </form>
    </>
  );
}

/* ================= REUSABLE INPUT ================= */
const InputField = ({ label, register, error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <input
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
