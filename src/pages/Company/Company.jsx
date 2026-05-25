import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import {
  getCompanyInfo,
  updateCompanyInfo,
} from "../../features/actions/authentication";
import {
  getCities,
  getCountries,
  getStates,
} from "../../features/actions/location";

export default function Company() {
  return (
    <>
      <div className="min-h-screen py-5 px-4  space-y-10">
        {/* ================= Company FORM ================= */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm  p-8 md:p-12">
          <CompanyForm />
        </div>
      </div>
    </>
  );
}

function CompanyForm() {
  const dispatch = useDispatch();
  const { companyData, isCompanyLoading } = useSelector(
    (state) => state.authentication,
  );
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
      country_id: data.country_id,
      state_id: data.state_id,
      city_id: data.city_id,
      company_name: data?.company_name || "",
      brand_name: data?.brand_name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      support_email: data?.support_email || "",
      support_phone: data?.support_phone || "",
      gst_number: data?.gst_number || "",
      pan_number: data?.pan_number || "",
      cin_number: data?.cin_number || "",
      bank_name: data?.bank_name || "",
      account_holder_name: data?.account_holder_name || "",
      account_number: data?.account_number || "",
      ifsc_code: data?.ifsc_code || "",
      terms_conditions: data?.terms_conditions || "",
      invoice_start_from: data?.invoice_start_from || "",
      invoice_prefix: data?.invoice_prefix || "",
      address_line1: data?.address_line1 || "",
      address_line2: data?.address_line2 || "",
      pincode: data?.pincode || "",
    };

    await dispatch(updateCompanyInfo(payload)).unwrap();

    // 🔥 Refresh profile after update
    dispatch(getCompanyInfo());
  };
  /* ================= LOAD COUNTRIES ================= */
  useEffect(() => {
    dispatch(getCountries());
  }, []);

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    const loadProfile = async () => {
      if (!companyData) return;

      const countryId = companyData?.country?.id || "";
      const stateId = companyData?.state?.id || "";
      const cityId = companyData?.city?.id || "";

      // 1️⃣ First reset basic values
      reset({
        company_name: companyData?.company_name || "",
        brand_name: companyData?.brand_name || "",
        email: companyData?.email || "",
        phone: companyData?.phone || "",
        support_email: companyData?.support_email || "",
        support_phone: companyData?.support_phone || "",
        gst_number: companyData?.gst_number || "",
        pan_number: companyData?.pan_number || "",
        cin_number: companyData?.cin_number || "",
        bank_name: companyData?.bank_name || "",
        account_holder_name: companyData?.account_holder_name || "",
        account_number: companyData?.account_number || "",
        ifsc_code: companyData?.ifsc_code || "",
        terms_conditions: companyData?.terms_conditions || "",
        invoice_start_from: companyData?.invoice_start_from || "",
        invoice_prefix: companyData?.invoice_prefix || "",
        address_line1: companyData?.address_line1 || "",
        address_line2: companyData?.address_line2 || "",
        pincode: companyData?.pincode || "",
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
  }, [companyData]);

  useEffect(() => {
    dispatch(getCompanyInfo());
  }, [dispatch]);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Company Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* ADDRESS LINE 1 */}
          <InputField
            label="Address Line 1"
            register={register("address_line1", {
              required: "Address is required",
            })}
            error={errors.address_line1}
          />

          {/* ADDRESS LINE 2 */}
          <InputField
            label="Address Line 2"
            register={register("address_line2")}
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
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* COMPANY NAME */}
          <InputField
            label="Company Name"
            register={register("company_name", {
              required: "Company name is required",
            })}
            error={errors.company_name}
          />

          {/* BRAND NAME */}
          <InputField
            label="Brand Name"
            register={register("brand_name", {
              required: "Brand name is required",
            })}
            error={errors.brand_name}
          />

          {/* EMAIL */}
          <InputField
            label="Email"
            type="email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email}
          />

          {/* PHONE */}
          <InputField
            label="Phone"
            register={register("phone", {
              required: "Phone is required",
            })}
            error={errors.phone}
          />

          {/* SUPPORT EMAIL */}
          <InputField
            label="Support Email"
            type="email"
            register={register("support_email")}
            error={errors.support_email}
          />

          {/* SUPPORT PHONE */}
          <InputField
            label="Support Phone"
            register={register("support_phone")}
            error={errors.support_phone}
          />

          {/* GST */}
          <InputField
            label="GST Number"
            register={register("gst_number")}
            error={errors.gst_number}
          />

          {/* PAN */}
          <InputField
            label="PAN Number"
            register={register("pan_number")}
            error={errors.pan_number}
          />

          {/* CIN */}
          <InputField
            label="CIN Number"
            register={register("cin_number")}
            error={errors.cin_number}
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Company Bank Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Bank Name"
            register={register("bank_name")}
            error={errors.bank_name}
          />

          <InputField
            label="Account Holder Name"
            register={register("account_holder_name")}
            error={errors.account_holder_name}
          />

          <InputField
            label="Account Number"
            register={register("account_number")}
            error={errors.account_number}
          />

          <InputField
            label="IFSC Code"
            register={register("ifsc_code")}
            error={errors.ifsc_code}
          />
        </div>

        {/* <h3 className="text-lg font-semibold text-gray-700 mt-6">
          Invoice Settings
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Invoice Prefix"
            register={register("invoice_prefix")}
            error={errors.invoice_prefix}
          />

          <InputField
            label="Invoice Start From"
            register={register("invoice_start_from")}
            error={errors.invoice_start_from}
          />
        </div> */}

        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Terms & Conditions
          </label>

          <textarea
            {...register("terms_conditions")}
            rows="4"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-emerald-200"
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCompanyLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-44 hover:bg-emerald-600 transition shadow-md"
          >
            {isCompanyLoading ? <Spinner /> : "Update Info"}
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
