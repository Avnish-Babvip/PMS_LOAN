import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import {
  getOrderSettings,
  updateOrderSettings,
} from "../../features/actions/order";

export default function Setting() {
  return (
    <>
      <div className="min-h-screen py-5 px-4  space-y-10">
        {/* ================= PROFILE FORM ================= */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm  p-8 md:p-12">
          <SettingForm />
        </div>
      </div>
    </>
  );
}

function SettingForm() {
  const dispatch = useDispatch();
  const { settingData, orderLoading } = useSelector((state) => state.order);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    if (!settingData) return;

    reset({
      order_received_email: settingData?.order_received_email || "",
      min_order_value: settingData?.min_order_value || "",
      cod_enabled: settingData?.cod_enabled || "",
    });
  }, [settingData, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    const payload = {
      order_received_email: data.order_received_email,
      min_order_value: data.min_order_value,
      cod_enabled: data.cod_enabled,
    };

    await dispatch(updateOrderSettings(payload)).unwrap();
  };

  useEffect(() => {
    dispatch(getOrderSettings());
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">Order Settings</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Order Received Mail"
            register={register("order_received_email", {
              required: "Order Received Mail is required",
            })}
            error={errors.order_received_email}
          />

          <InputField
            label="Minimum order value"
            register={register("min_order_value", {
              required: "Minimum order value is required",
            })}
            error={errors.min_order_value}
          />

          <SelectField
            label="Cash on delivery"
            register={register("cod_enabled", {
              required: "Cash on delivery is required",
            })}
            error={errors.cod_enabled}
            options={[
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ]}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={orderLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-50 hover:bg-brand-green transition shadow-md"
          >
            {orderLoading ? <Spinner /> : "Update Settings"}
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

const SelectField = ({ label, register, options = [], error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <select
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    >
      <option value="">Select {label}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
