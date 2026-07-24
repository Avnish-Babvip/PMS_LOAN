import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCases,
  getDynamicForm,
  submitForm,
} from "../../features/actions/case";
import { Spinner } from "../../components/Loader/Spinner";

const SubmitForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, formLoading } = useSelector((state) => state.caseSlice);
  const fields = formData?.fields || [];
  const defaultValues =
    formData?.form_data && Object.keys(formData.form_data).length > 0
      ? formData.form_data
      : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldUnregister: true,
  });

  const renderField = (field) => {
    switch (field.field_type) {
      case "boolean":
        return (
          <input
            type="text"
            inputMode="numeric"
            maxLength={1}
            {...register(field.field_key)}
            placeholder="Enter 0 or 1"
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ];

              if (
                !allowedKeys.includes(e.key) &&
                e.key !== "0" &&
                e.key !== "1"
              ) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (text !== "0" && text !== "1") {
                e.preventDefault();
              }
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#79BF28] focus:ring-2 focus:ring-[#79BF28]/20"
          />
        );

      case "text":
      default:
        return (
          <input
            type="text"
            {...register(field.field_key)}
            placeholder={`Enter ${field.field_name}`}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#79BF28]"
          />
        );
    }
  };

  const onSubmit = (data) => {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // Handle file inputs
      if (value instanceof FileList && value.length > 0) {
        form.append(key, value[0]);
      } else {
        form.append(key, value ?? "");
      }
    });

    dispatch(
      submitForm({
        id,
        payload: form,
      }),
    )
      .unwrap()
      .then(() => {
        navigate(`/admin/case`);
      });
  };

  useEffect(() => {
    reset({});
    dispatch(getDynamicForm(id));
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({});
    }
  }, [defaultValues, reset]);

  return (
    <form key={id} onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
      {/* Form Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-50 to-white p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {formData?.applicant_name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">{formData?.subject}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl bg-[#79BF28]/10 px-4 py-2">
              <p className="text-xs font-medium text-gray-500">File ID</p>

              <p className="font-semibold text-[#79BF28]">
                {formData?.file_id}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-2">
              <p className="text-xs font-medium text-gray-500">Status</p>

              <p className="font-semibold capitalize text-blue-600">
                {formData?.status}
              </p>
            </div>
          </div>
        </div>

        {/* Fields */}
        {fields.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fields?.map((field) => (
                <div
                  key={field.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#79BF28]/40 hover:shadow-md"
                >
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    {field.field_name}

                    {/* {field.is_required && (
                      <span className="ml-1 text-red-500">*</span>
                    )} */}
                  </label>

                  {renderField(field)}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
              <button
                disabled={formLoading}
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {formLoading ? <Spinner /> : "Submit Form"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-slate-50 py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6M9 8h6m-9 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              No Form Available
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              There is currently no form configured for this case. Please
              contact the administrator or try again later.
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default SubmitForm;
