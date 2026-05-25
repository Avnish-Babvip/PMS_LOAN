import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";

import { useState } from "react";
import { getContactUs, updateContactUs } from "../../features/actions/cms";

export default function ContactUs() {
  return (
    <div className="min-h-screen py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <ContactUsForm />
      </div>
    </div>
  );
}

function ContactUsForm() {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  const [selected, setSelected] = useState(null);

  const { contactUsData, cmsLoading } = useSelector((state) => state.cms);

  const {
    register,
    reset,
    control,
    getValues, // ✅ add this
    formState: { errors },
  } = useForm({
    defaultValues: {
      policies: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "policies",
  });

  const data = contactUsData || [];

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    dispatch(getContactUs());
  }, []);

  useEffect(() => {
    if (!data || initialized) return;
    reset({
      policies: data?.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
      })),
    });

    setInitialized(true);
  }, [data]);

  const handleSingleUpdate = async (item) => {
    const payload = {
      title: item.title,
      description: item.description,
      status: item.status,
    };

    await dispatch(updateContactUs({ payload, id: item?.id })).unwrap();

    dispatch(getContactUs());
  };
  return (
    <>
      <div className="flex items-center justify-between">
        {" "}
        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Contact Us Settings
        </h2>
      </div>

      <form className="space-y-8 text-gray-700">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 p-4 rounded-xl space-y-4"
          >
            {/* Title */}
            <InputField
              label="Title"
              register={register(`policies.${index}.title`, {
                required: "Title required",
              })}
              error={errors?.policies?.[index]?.title}
            />
            <TextAreaField
              label="Description"
              register={register(`policies.${index}.description`, {
                required: "Description required",
              })}
              error={errors?.policies?.[index]?.description}
            />

            {/* STATUS */}
            <SelectField
              label="Status"
              register={register(`policies.${index}.status`)}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            <div className="flex justify-end gap-4">
              {" "}
              <button
                type="button"
                onClick={() => {
                  const item = getValues(`policies.${index}`);
                  handleSingleUpdate(item);
                  setSelected(item?.id);
                }}
                className="bg-brand-green text-white w-40 px-4 py-2 rounded-lg"
              >
                {cmsLoading && item.category_id === selected ? (
                  <Spinner />
                ) : (
                  "Update Section"
                )}
              </button>
            </div>
          </div>
        ))}

        {/* SUBMIT */}
      </form>
    </>
  );
}

const TextAreaField = ({ label, register, error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <textarea
      {...register}
      rows={4}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

const SelectField = ({ label, register, options }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <select
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, register, error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <input
      type="text"
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);
