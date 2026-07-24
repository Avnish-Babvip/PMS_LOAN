import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import { changePassword } from "../../features/actions/authentication";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  return (
    <div className="min-h-screen py-5 px-4 space-y-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <Form />
      </div>
      <div className="max-w-5xl mx-auto mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-amber-800">
          Password Requirements
        </h3>

        <ul className="mb-0 space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Must be at least <strong>8 characters</strong> long.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Must contain at least <strong>one uppercase letter (A-Z)</strong>.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Must contain at least <strong>one lowercase letter (a-z)</strong>.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Must contain at least <strong>one number (0-9)</strong>.
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Must contain at least <strong>one special character</strong> (e.g.
              ! @ # $ % & *).
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>
              Spaces are <strong>not allowed</strong>.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Form() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.authentication);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("new_password");

  const onSubmit = (data) => {
    dispatch(changePassword(data))
      .unwrap()
      .then(() => {
        reset();
        navigate("/");
      });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">Change Password</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* CURRENT PASSWORD */}
          <PasswordInput
            required
            label="Current Password"
            show={showPassword.current}
            toggle={() =>
              setShowPassword((prev) => ({
                ...prev,
                current: !prev.current,
              }))
            }
            register={register("current_password", {
              required: "Current Password is required",
            })}
            error={errors.current_password}
          />
          <div></div>
          {/* NEW PASSWORD */}
          <PasswordInput
            label="New Password"
            required
            show={showPassword.new}
            toggle={() =>
              setShowPassword((prev) => ({
                ...prev,
                new: !prev.new,
              }))
            }
            register={register("new_password", {
              required: "New Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={errors.new_password}
          />

          {/* CONFIRM PASSWORD */}
          <PasswordInput
            required
            label="Confirm New Password"
            show={showPassword.confirm}
            toggle={() =>
              setShowPassword((prev) => ({
                ...prev,
                confirm: !prev.confirm,
              }))
            }
            register={register("confirm_password", {
              required: "Confirm password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            error={errors.confirm_password}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white font-semibold rounded-xl w-50 hover:bg-emerald-600 transition shadow-md flex justify-center"
          >
            {isLoading ? <Spinner /> : "Update Password"}
          </button>
        </div>
      </form>
    </>
  );
}

/* ================= PASSWORD INPUT ================= */

const PasswordInput = ({ label, register, error, show, toggle, required }) => {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">
        {label} {required && <span className="text-red-600"> *</span>}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            if (/\s/.test(pastedText)) {
              e.preventDefault();
            }
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none pr-12"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};
