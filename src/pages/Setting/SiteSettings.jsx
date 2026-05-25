import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import { HiTrash } from "react-icons/hi";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../../features/actions/home";

export default function SiteSettings() {
  return (
    <div className="min-h-screen py-5 px-4 space-y-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <SiteSettingsForm />
      </div>
    </div>
  );
}

function SiteSettingsForm() {
  const dispatch = useDispatch();
  const { siteSettingData, homeLoading } = useSelector((state) => state.home);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const siteSettings = siteSettingData?.data || {};
  const {
    fields: phones,
    append: addPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phone_numbers" });

  const {
    fields: emails,
    append: addEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: "emails" });

  const {
    fields: addresses,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray({ control, name: "addresses" });

  const {
    fields: socials,
    append: addSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "social_links" });

  const {
    fields: banners,
    append: addBanner,
    remove: removeBanner,
  } = useFieldArray({ control, name: "common_banner_title" });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(getSiteSettings());
  }, []);

  useEffect(() => {
    if (!siteSettings) return;

    reset({
      footer_description: siteSettings?.footer_description || "",
      subscribe_title: siteSettings?.subscribe_title || "",
      subscribe_description: siteSettings?.subscribe_description || "",

      phone_numbers: siteSettings?.phone_numbers || [],
      emails: siteSettings?.emails || [],
      addresses: siteSettings?.addresses || [],
      social_links: siteSettings?.social_links || [],

      // ✅ NEW
      common_title: siteSettings?.common_title || "",
      common_description: siteSettings?.common_description || "",
      common_banner_title: siteSettings?.common_banner_title || [],
      common_banner_image: siteSettings?.common_banner_image || [],
    });
  }, [siteSettings, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    // logos
    if (data.header_logo?.[0]) {
      formData.append("header_logo", data.header_logo[0]);
    }

    if (data.footer_logo?.[0]) {
      formData.append("footer_logo", data.footer_logo[0]);
    }

    // simple fields
    formData.append("footer_description", data.footer_description || "");
    formData.append("subscribe_title", data.subscribe_title || "");
    formData.append("subscribe_description", data.subscribe_description || "");

    // arrays
    // SOCIAL LINKS
    (data.social_links || []).forEach((item, index) => {
      formData.append(`social_links[${index}][name]`, item.name || "");
      formData.append(`social_links[${index}][url]`, item.url || "");
      formData.append(`social_links[${index}][status]`, item.status || "");
    });

    // PHONE NUMBERS
    (data.phone_numbers || []).forEach((item, index) => {
      formData.append(`phone_numbers[${index}][number]`, item.number || "");
      formData.append(`phone_numbers[${index}][status]`, item.status || "");
    });

    // EMAILS
    (data.emails || []).forEach((item, index) => {
      formData.append(`emails[${index}][email]`, item.email || "");
    });

    // ADDRESSES
    (data.addresses || []).forEach((item, index) => {
      formData.append(`addresses[${index}][address]`, item.address || "");
      formData.append(`addresses[${index}][status]`, item.status || "");
    });

    // COMMON SECTION
    formData.append("common_title", data.common_title || "");
    formData.append("common_description", data.common_description || "");

    // COMMON BANNERS
    (data.common_banner_title || []).forEach((title, index) => {
      formData.append(`common_banner_title[${index}]`, title || "");

      const file = data.common_banner_image?.[index]?.[0];

      if (file instanceof File) {
        formData.append(`common_banner_image[${index}]`, file);
      }
    });

    await dispatch(
      updateSiteSettings({
        payload: formData,
        id: siteSettings?.id,
      }),
    ).unwrap();

    dispatch(getSiteSettings());
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">Site Settings</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 text-gray-700"
      >
        {/* LOGOS */}
        <div className="grid md:grid-cols-2 gap-8">
          <LogoUpload
            label="Header Logo (62 X 52)"
            register={register("header_logo")}
            defaultImage={siteSettings?.header_logo}
          />

          <LogoUpload
            label="Footer Logo (120 X 100)"
            register={register("footer_logo")}
            defaultImage={siteSettings?.footer_logo}
          />
        </div>

        {/* FOOTER DESCRIPTION */}
        <TextAreaField
          label="Footer Description"
          register={register("footer_description", {
            required: "Footer description required",
          })}
          error={errors.footer_description}
        />

        {/* SUBSCRIBE SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Subscribe Title"
            register={register("subscribe_title")}
          />

          <TextAreaField
            label="Subscribe Description"
            register={register("subscribe_description")}
          />
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            Social Links (Only Facebook, Instagram, X and Youtube)
          </h3>
          <button
            type="button"
            onClick={() => addSocial({ name: "", url: "", status: "1" })}
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {socials.map((item, index) => (
            <div
              key={item.id}
              className="relative border border-gray-200 p-4 rounded-xl"
            >
              {/* REMOVE */}
              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                title="Remove Social Link"
              >
                <HiTrash size={14} />
              </button>

              <InputField
                label="Name"
                register={register(`social_links.${index}.name`)}
              />

              <InputField
                label="URL"
                register={register(`social_links.${index}.url`)}
              />

              <SelectField
                label="Status"
                register={register(`social_links.${index}.status`)}
                options={[
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ]}
              />
            </div>
          ))}
        </div>

        {/* PHONE NUMBERS */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Phone Numbers</h3>
          <button
            type="button"
            onClick={() => addPhone({ number: "", status: "1" })}
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {phones.map((item, index) => (
          <div
            key={item.id}
            className="relative grid md:grid-cols-2 gap-4 mb-4"
          >
            <button
              type="button"
              onClick={() => removePhone(index)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
              title="Remove Phone"
            >
              <HiTrash size={14} />
            </button>
            <InputField
              label="Phone Number"
              register={register(`phone_numbers.${index}.number`)}
            />

            <SelectField
              label="Status"
              register={register(`phone_numbers.${index}.status`)}
              options={[
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
            />
          </div>
        ))}

        {/* EMAILS */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Emails</h3>
          <button
            type="button"
            onClick={() => addEmail({ email: "" })}
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {emails.map((item, index) => (
          <div key={item.id} className="relative mb-4">
            <button
              type="button"
              onClick={() => removeEmail(index)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
              title="Remove Email"
            >
              <HiTrash size={14} />
            </button>

            <InputField
              label={`Email ${index + 1}`}
              register={register(`emails.${index}.email`)}
            />
          </div>
        ))}

        {/* ADDRESSES */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Addresses</h3>
          <button
            type="button"
            onClick={() => addAddress({ address: "", status: "1" })}
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {addresses.map((item, index) => (
          <div
            key={item.id}
            className="relative grid md:grid-cols-2 gap-4 mb-4"
          >
            <button
              type="button"
              onClick={() => removeAddress(index)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
              title="Remove Address"
            >
              <HiTrash size={14} />
            </button>

            <InputField
              label="Address"
              register={register(`addresses.${index}.address`)}
            />

            <SelectField
              label="Status"
              register={register(`addresses.${index}.status`)}
              options={[
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
            />
          </div>
        ))}

        {/* COMMON SECTION */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Common Section</h3>

          <InputField
            label="Common Title"
            register={register("common_title")}
          />

          <TextAreaField
            label="Common Description"
            register={register("common_description")}
          />
        </div>

        {/* COMMON BANNERS */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Common Banners</h3>
          <button
            type="button"
            onClick={() => addBanner("")}
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {banners.map((item, index) => (
          <div
            key={item.id}
            className="grid md:grid-cols-2 gap-4 mb-4  border border-gray-200 p-4 rounded-xl"
          >
            {/* TITLE */}
            <InputField
              disabled={true}
              label="Banner Title"
              register={register(`common_banner_title.${index}`)}
            />

            {/* IMAGE UPLOAD */}
            <BannerUpload
              label="Banner Image"
              index={index}
              remove={removeBanner}
              register={register(`common_banner_image.${index}`)}
              defaultImage={siteSettings?.common_banner_image?.[index]}
            />
          </div>
        ))}

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={homeLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-52 hover:bg-brand-green transition shadow-md"
          >
            {homeLoading ? <Spinner /> : "Update Settings"}
          </button>
        </div>
      </form>
    </>
  );
}

/* ================= REUSABLE INPUT ================= */

const InputField = ({ disabled, label, register, type = "text", error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>

    <input
      disabled={disabled}
      type={type}
      {...register}
      className={`w-full px-4 py-3 rounded-xl border outline-none transition
      ${
        disabled
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-80"
          : "bg-white text-gray-700 border-gray-200 focus:ring-2 focus:ring-brand-green"
      }
    `}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const TextAreaField = ({ label, register, error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <textarea
      {...register}
      rows={3}
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
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const LogoUpload = ({ label, register, defaultImage }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (defaultImage) {
      setPreview(
        `${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${defaultImage}`,
      );
    }
  }, [defaultImage]);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold mb-3 block">{label}</label>

      <div className="flex items-center gap-6">
        {/* Preview */}
        <div className=" border border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xs text-gray-400">No Logo</span>
          )}
        </div>

        {/* Upload */}
        <label className="cursor-pointer bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          Change Logo
          <input
            type="file"
            className="hidden"
            {...register}
            onChange={(e) => {
              register.onChange(e); // ✅ keep RHF working
              handlePreview(e); // ✅ preview
            }}
          />
        </label>
      </div>
    </div>
  );
};

const BannerUpload = ({ label, register, defaultImage, index, remove }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (defaultImage) {
      setPreview(
        `${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${defaultImage}`,
      );
    }
  }, [defaultImage]);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative space-y-3">
      {/* REMOVE BUTTON */}
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
      >
        <HiTrash size={14} />
      </button>

      <label className="text-sm font-semibold block">{label}(1900x250)</label>

      <div className="flex gap-4 items-center w-full">
        {/* PREVIEW */}
        <div className=" h-24 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="banner" className="w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        {/* UPLOAD */}
        <label className="cursor-pointer bg-brand-green text-white px-4 py-2 rounded-lg text-sm">
          Upload
          <input
            type="file"
            className="hidden"
            {...register}
            onChange={(e) => {
              register.onChange(e);
              handlePreview(e);
            }}
          />
        </label>
      </div>
    </div>
  );
};
