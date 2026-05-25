import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import {
  editMaintenance,
  getMaintenance,
} from "../../features/actions/maintenance";

export default function MaintenanceMode() {
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
  const { maintenanceData, maintenanceLoading } = useSelector(
    (state) => state.maintenance,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    if (!maintenanceData) return;
    reset({
      message: maintenanceData?.message || "",
      is_active: maintenanceData?.is_active ? 1 : 0,
    });
  }, [maintenanceData, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    const payload = {
      message: data.message,
      is_active: data.is_active,
    };

    await dispatch(editMaintenance(payload)).unwrap();
  };

  useEffect(() => {
    dispatch(getMaintenance());
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Maintenance Settings
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="space-y-4">
          <InputField
            label="Maintenance Message"
            register={register("message")}
            error={errors.message}
          />

          <SelectField
            label="Website Status"
            register={register("is_active")}
            error={errors.is_active}
            options={[
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ]}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={maintenanceLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-50 hover:bg-brand-green transition shadow-md"
          >
            {maintenanceLoading ? <Spinner /> : "Update Settings"}
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
    <textarea
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
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
