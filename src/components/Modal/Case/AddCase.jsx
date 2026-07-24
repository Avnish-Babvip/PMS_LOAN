import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiCreditCard } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { addCase } from "../../../features/actions/case";
import { getAllBanks } from "../../../features/actions/bank";
import { getAllForms } from "../../../features/actions/form";
import { useEffect } from "react";

const AddCaseModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { bankData } = useSelector((state) => state.bank);
  const { formData } = useSelector((state) => state.form);
  const { caseLoading } = useSelector((state) => state.caseSlice);
  const banks = bankData?.data || [];
  const forms = formData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank_id: "",
      bank_form_id: "",
    },
  });

  const bankId = watch("bank_id");
  const selectedBank = watch("bank_id");
  const selectedForm = watch("bank_form_id");

  const onSubmit = (data) => {
    dispatch(addCase(data))
      .unwrap()
      .then(() => {
        reset({
          applicant_name: "",
          file_id: "",
          subject: "",
          mail_time: "",
          bank_id: selectedBank,
          bank_form_id: selectedForm,
        });

        // onClose(); // Remove this if you want the modal to stay open
        onClose();
      });
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        applicant_name: "",
        file_id: "",
        subject: "",
        mail_time: "",
        bank_id: selectedBank,
        bank_form_id: selectedForm,
      });
      dispatch(getAllBanks({ per_page: 1000, status: 1 }));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (bankId) {
      dispatch(
        getAllForms({
          per_page: 100,
          id: bankId,
          status: "published",
        }),
      );
    }
  }, [dispatch, bankId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex h-[95vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                <FiCreditCard size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Add Case</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Create a new case record
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <Input
                label="Applicant Name"
                name="applicant_name"
                placeholder="Enter applicant name"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="File ID"
                name="file_id"
                placeholder="Enter file ID"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="Subject"
                name="subject"
                placeholder="Enter subject"
                register={register}
                required
                errors={errors}
              />

              <div>
                <label className="text-gray-700 text-sm font-medium">
                  Mail Time <span className="text-red-600">*</span>
                </label>

                <input
                  type="datetime-local"
                  {...register("mail_time", {
                    required: "Mail Time is required",
                  })}
                  onKeyDown={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  onClick={(e) => e.target.showPicker?.()}
                  className="mt-1 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                  style={{
                    caretColor: "transparent",
                    userSelect: "none",
                  }}
                />

                {errors.mail_time && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.mail_time.message}
                  </p>
                )}
              </div>

              {/* Bank */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bank <span className="text-red-600"> *</span>
                </label>

                <select
                  {...register("bank_id", {
                    required: "Bank is required",
                  })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-[#79BF28]"
                >
                  <option value="">Select Bank</option>

                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank_name}
                    </option>
                  ))}
                </select>

                {errors.bank_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bank_id.message}
                  </p>
                )}
              </div>

              {/* Form */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Form <span className="text-red-600"> *</span>
                </label>

                <select
                  {...register("bank_form_id", {
                    required: "Form is required",
                  })}
                  disabled={!bankId}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-[#79BF28] disabled:bg-gray-100"
                >
                  <option value="">
                    {bankId ? "Select Form" : "Select Bank First"}
                  </option>

                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.form_name}
                    </option>
                  ))}
                </select>

                {errors.bank_form_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bank_form_id.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={caseLoading}
              type="submit"
              className="flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              {caseLoading ? <Spinner /> : "Create Case"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCaseModal;
