import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import {
  getRiderProfile,
  getRiderReferralCode,
  submitKyc,
  updateRiderProfile,
} from "../../features/actions/rider/user";
import { Spinner } from "../../components/Loader/Spinner";
import {
  getCities,
  getCountries,
  getStates,
} from "../../features/actions/location";

export default function RiderProfile() {
  const { profileData } = useSelector((state) => state.rider_user);
  const kyc = profileData?.rider_profile?.kyc;

  return (
    <>
      <div className="min-h-screen py-5 px-4  space-y-10">
        {/* ================= PROFILE FORM ================= */}

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm  p-8 md:p-12">
          <ProfileForm />
        </div>

        {/* ================= KYC SECTION ================= */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            KYC Information
          </h2>

          {/* No KYC → Show Form */}
          {!kyc && <KycUploadSection />}

          {/* Approved / Pending → Only Show Status */}
          {kyc && kyc.kyc_status !== "rejected" && <KycStatusCard kyc={kyc} />}

          {/* Rejected → Show Status + Form */}
          {kyc && kyc.kyc_status === "rejected" && (
            <>
              <KycStatusCard kyc={kyc} />
              <div className="mt-6 border-t pt-6">
                <KycUploadSection />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ProfileForm() {
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.rider_user);
  const { profileLoading } = useSelector((state) => state.rider_user);
  const { countryData, stateData, cityData } = useSelector(
    (state) => state.location,
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    const payload = {
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2,
      country_id: data.country_id,
      state_id: data.state_id,
      city_id: data.city_id,
      pincode: data.pincode,
      vehicle_type: data.vehicle_type,
      vehicle_number: data.vehicle_number,
      license_number: data.license_number,
    };

    await dispatch(updateRiderProfile(payload)).unwrap();

    // 🔥 Refresh profile after update
    dispatch(getRiderProfile());
  };
  /* ================= LOAD COUNTRIES ================= */
  useEffect(() => {
    dispatch(getCountries());
  }, []);

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileData) return;

      const rider = profileData?.rider_profile;

      const countryId = rider?.country?.id || "";
      const stateId = rider?.state?.id || "";
      const cityId = rider?.city?.id || "";

      // 1️⃣ First reset basic values
      reset({
        address_line_1: rider?.address_line_1 || "",
        address_line_2: rider?.address_line_2 || "",
        pincode: rider?.pincode || "",
        vehicle_type: rider?.vehicle_type || "",
        vehicle_number: rider?.vehicle_number || "",
        license_number: rider?.license_number || "",
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
      });

      // 2️⃣ Then load states
      if (countryId) {
        await dispatch(getStates(countryId)).unwrap();
      }

      // 3️⃣ Then load cities
      if (stateId) {
        await dispatch(getCities(stateId)).unwrap();
      }

      // 4️⃣ Set values again after dropdown data loaded
      setValue("country_id", countryId);
      setValue("state_id", stateId);
      setValue("city_id", cityId);
    };

    loadProfile();
  }, [profileData]);

  useEffect(() => {
    dispatch(getRiderProfile());
    // dispatch(getCustomerKycStatus());
  }, [dispatch]);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Rider Profile Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* ADDRESS LINE 1 */}
          <InputField
            label="Address Line 1"
            register={register("address_line_1", {
              required: "Address is required",
            })}
            error={errors.address_line_1}
          />

          {/* ADDRESS LINE 2 */}
          <InputField
            label="Address Line 2"
            register={register("address_line_2")}
          />

          {/* COUNTRY */}
          <SelectField
            label="Country"
            register={register("country_id", {
              required: "Country is required",
            })}
            error={errors.country_id}
            onChange={(e) => {
              const value = e.target.value;

              setValue("country_id", value);
              setValue("state_id", "");
              setValue("city_id", "");

              dispatch(getStates(value));
            }}
            options={countryData}
          />

          {/* STATE */}
          <SelectField
            label="State"
            register={register("state_id", {
              required: "State is required",
            })}
            error={errors.state_id}
            disabled={!watch("country_id")}
            onChange={(e) => {
              const value = e.target.value;

              setValue("state_id", value);
              setValue("city_id", "");

              dispatch(getCities(value));
            }}
            options={stateData}
          />

          {/* CITY */}
          <SelectField
            label="City"
            register={register("city_id", {
              required: "City is required",
            })}
            error={errors.city_id}
            disabled={!watch("state_id")}
            options={cityData}
          />

          {/* PINCODE */}
          <InputField
            label="Pincode"
            register={register("pincode", {
              required: "Pincode is required",
            })}
            error={errors.pincode}
          />

          {/* VEHICLE TYPE */}
          <InputField
            label="Vehicle Type"
            register={register("vehicle_type", {
              required: "Vehicle type is required",
            })}
            error={errors.vehicle_type}
          />

          {/* VEHICLE NUMBER */}
          <InputField
            label="Vehicle Number"
            register={register("vehicle_number", {
              required: "Vehicle number is required",
            })}
            error={errors.vehicle_number}
          />

          {/* LICENSE NUMBER */}
          <InputField
            label="License Number"
            register={register("license_number", {
              required: "License number is required",
            })}
            error={errors.license_number}
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={profileLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-44 hover:bg-emerald-600 transition shadow-md"
          >
            {profileLoading ? <Spinner /> : "Update Profile"}
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
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

/* ================= REUSABLE SELECT ================= */
const SelectField = ({
  label,
  register,
  options = [],
  error,
  onChange,
  disabled,
}) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <select
      {...register}
      disabled={disabled}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
    >
      <option value="">Select {label}</option>
      {options?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

function KycUploadSection() {
  const dispatch = useDispatch();
  const { kycLoading } = useSelector((state) => state.rider_user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("aadhaar_number", data.aadhaar_number);
    formData.append("pan_number", data.pan_number);
    formData.append("aadhaar_front", data.aadhaar_front[0]);
    formData.append("aadhaar_back", data.aadhaar_back[0]);
    formData.append("pan_image", data.pan_image[0]);

    await dispatch(submitKyc(formData)).unwrap();

    // Refresh profile after submit
    dispatch(getRiderProfile());

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 text-gray-700
    "
    >
      {/* ================= AADHAAR NUMBER ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>

        <input
          {...register("aadhaar_number", {
            required: "Aadhaar number required",
            minLength: { value: 12, message: "Invalid Aadhaar number" },
          })}
          placeholder="Enter Aadhaar number"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green"
        />

        {errors.aadhaar_number && (
          <p className="text-red-500 text-xs mt-1">
            {errors.aadhaar_number.message}
          </p>
        )}
      </div>

      {/* ================= PAN NUMBER ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PAN Number <span className="text-red-500">*</span>
        </label>

        <input
          {...register("pan_number", {
            required: "PAN number required",
          })}
          placeholder="Enter PAN number"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green"
        />

        {errors.pan_number && (
          <p className="text-red-500 text-xs mt-1">
            {errors.pan_number.message}
          </p>
        )}
      </div>

      {/* ================= AADHAAR FRONT ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Aadhaar Front <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          accept="image/*"
          {...register("aadhaar_front", {
            required: "Aadhaar front image required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lime-100 file:text-brand-green"
        />

        {errors.aadhaar_front && (
          <p className="text-red-500 text-xs mt-1">
            {errors.aadhaar_front.message}
          </p>
        )}
      </div>

      {/* ================= AADHAAR BACK ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Aadhaar Back <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          accept="image/*"
          {...register("aadhaar_back", {
            required: "Aadhaar back image required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lime-100 file:text-brand-green"
        />

        {errors.aadhaar_back && (
          <p className="text-red-500 text-xs mt-1">
            {errors.aadhaar_back.message}
          </p>
        )}
      </div>

      {/* ================= PAN IMAGE ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload PAN Image <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          accept="image/*"
          {...register("pan_image", {
            required: "PAN image required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-lime-100 file:text-brand-green"
        />

        {errors.pan_image && (
          <p className="text-red-500 text-xs mt-1">
            {errors.pan_image.message}
          </p>
        )}
      </div>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        disabled={kycLoading}
        className="w-full py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
      >
        {kycLoading ? <Spinner /> : "Submit KYC"}
      </button>
    </form>
  );
}

function KycStatusCard({ kyc }) {
  const status = kyc?.kyc_status;

  const getStatusStyle = () => {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "rejected") return "bg-red-100 text-red-600";
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Verification Status</p>

        <span
          className={`px-4 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle()}`}
        >
          {status}
        </span>
      </div>

      {status === "rejected" && (
        <p className="text-sm text-red-600 mt-3">
          Reason: {kyc?.rejection_reason || "Please resubmit your document."}
        </p>
      )}
    </div>
  );
}
