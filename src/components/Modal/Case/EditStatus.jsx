import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiCreditCard } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { SelectWithId, Textarea } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import {
  editCase,
  updateCaseDocumentStatus,
  updateCaseStatus,
} from "../../../features/actions/case";
import { useEffect } from "react";

const EditStatusModal = ({ isOpen, onClose, user, status = [], document }) => {
  const dispatch = useDispatch();
  const { caseLoading } = useSelector((state) => state.caseSlice);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (document) {
      dispatch(updateCaseDocumentStatus({ id: user?.id, payload: data }))
        .unwrap()
        .then(() => {
          onClose();
        });
    } else {
      dispatch(updateCaseStatus({ id: user?.uuid, payload: data }))
        .unwrap()
        .then(() => {
          onClose();
        });
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      reset({
        status: document ? user?.qc_status : user?.status || "",
        remarks: user?.qc_remarks || "",
      });
    }
  }, [user, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex h-[95vh] lg:h-[60vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
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
                <h2 className="text-2xl font-bold text-white">Edit Status</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Edit status with remarks
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
              <SelectWithId
                label="Status"
                name="status"
                options={status}
                register={register}
                required
                errors={errors}
              />

              <Textarea
                label="Remarks"
                name="remarks"
                placeholder="Enter your remarks"
                register={register}
                required
                errors={errors}
              />
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
              {caseLoading ? <Spinner /> : "Edit Status"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStatusModal;
