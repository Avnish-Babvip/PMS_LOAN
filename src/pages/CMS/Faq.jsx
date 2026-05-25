import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";
import { HiTrash } from "react-icons/hi";
import { getFaqData, updateFaq } from "../../features/actions/cms";

export default function FaqSettings() {
  return (
    <div className="min-h-screen py-5 px-4 space-y-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <FaqForm />
      </div>
    </div>
  );
}

function FaqForm() {
  const dispatch = useDispatch();
  const { faqData, cmsLoading } = useSelector((state) => state.cms);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const data = faqData?.data || {};

  const {
    fields: faqs,
    append: addFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq_items",
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(getFaqData());
  }, []);

  useEffect(() => {
    if (!data) return;

    reset({
      banner_title: data?.banner_title || "",
      faq_items: data?.faq_items || [],
    });
  }, [data, reset]);

  /* ================= ENSURE ONE FAQ ================= */

  useEffect(() => {
    if (faqs.length === 0) {
      addFaq({ question: "", answer: "", status: "active" });
    }
  }, [faqs]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (form) => {
    const formData = new FormData();

    formData.append("banner_title", form.banner_title || "");
    formData.append("status", "active");

    if (form.banner_bg_image?.[0]) {
      formData.append("banner_bg_image", form.banner_bg_image[0]);
    }

    (form.faq_items || []).forEach((item, index) => {
      formData.append(`faq_items[${index}][question]`, item.question || "");
      formData.append(`faq_items[${index}][answer]`, item.answer || "");
      formData.append(`faq_items[${index}][status]`, item.status || "active");
    });

    await dispatch(
      updateFaq({
        payload: formData,
        id: data?.id,
      }),
    ).unwrap();

    dispatch(getFaqData());
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-8">FAQ Settings</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 text-gray-700"
      >
        {/* BANNER */}
        <div className="grid md:grid-cols-2 gap-8">
          <InputField
            label="Banner Title"
            register={register("banner_title")}
          />

          <LogoUpload
            label="Banner Background (1500 × 450 px)"
            register={register("banner_bg_image")}
            defaultImage={data?.banner_bg_image}
          />
        </div>

        {/* FAQ ITEMS */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">FAQ Items</h3>
          <button
            type="button"
            onClick={() =>
              addFaq({ question: "", answer: "", status: "active" })
            }
            className="text-sm bg-brand-green text-white px-3 py-1 rounded"
          >
            + Add
          </button>
        </div>

        {faqs.map((item, index) => (
          <div
            key={item.id}
            className="relative border border-gray-200 p-4 rounded-xl mb-4"
          >
            {/* REMOVE */}
            <button
              type="button"
              onClick={() => removeFaq(index)}
              disabled={faqs.length === 1}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-40"
            >
              <HiTrash size={14} />
            </button>

            <InputField
              label="Question"
              register={register(`faq_items.${index}.question`, {
                required: "Question required",
              })}
              error={errors?.faq_items?.[index]?.question}
            />

            <TextAreaField
              label="Answer"
              register={register(`faq_items.${index}.answer`, {
                required: "Answer required",
              })}
              error={errors?.faq_items?.[index]?.answer}
            />

            <SelectField
              label="Status"
              register={register(`faq_items.${index}.status`)}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>
        ))}

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={cmsLoading}
            className="px-8 py-3 bg-brand-green text-white font-semibold rounded-xl w-52 hover:bg-brand-green transition shadow-md"
          >
            {cmsLoading ? <Spinner /> : "Update FAQ"}
          </button>
        </div>
      </form>
    </>
  );
}

/* ================= REUSABLE INPUT ================= */

const InputField = ({ label, register, type = "text", error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <input
      type={type}
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
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

/* ================= IMAGE UPLOAD ================= */

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
        <div className="w-full  border border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

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
