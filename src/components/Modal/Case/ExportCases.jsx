import { HiX } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import FilterSelect from "../../FilterSelect";
import { getAllForms } from "../../../features/actions/form";
import { useDispatch } from "react-redux";

const ExportCasesModal = ({
  isOpen,
  onClose,
  banks,
  bankForms,
  exportLoading,
  onExport,
}) => {
  const [bankId, setBankId] = useState("");
  const [formId, setFormId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({
    bankId: "",
    formId: "",
  });

  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Export Cases</h2>

            <p className="mt-1 text-sm text-gray-300">
              Select the export filters.{" "}
              <span className="font-semibold text-red-300">
                Bank and Bank Form are required.
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#79BF28]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#79BF28]"
              />
            </div>

            <FilterSelect
              label="Bank"
              value={bankId}
              options={banks}
              placeholder="Select Bank"
              showAllOption={false}
              error={errors.bankId}
              onChange={(v) => {
                setBankId(v);
                setFormId("");

                setErrors((prev) => ({
                  ...prev,
                  bankId: "",
                  formId: "",
                }));

                if (v) {
                  dispatch(getAllForms({ id: v })); // Fetch forms for selected bank
                }
              }}
            />

            <FilterSelect
              label="Bank Form"
              value={formId}
              options={bankId ? bankForms : []}
              placeholder={bankId ? "Select Bank Form" : "Select Bank First"}
              showAllOption={false}
              disabled={!bankId}
              error={errors.formId}
              onChange={(v) => {
                setFormId(v);

                setErrors((prev) => ({
                  ...prev,
                  formId: "",
                }));
              }}
            />
            <FilterSelect
              label="Status"
              value={status}
              options={[
                { label: "Draft", value: "Draft" },
                {
                  label: "Pending Assignment",
                  value: "pending_assignment",
                },
                {
                  label: "In Progress",
                  value: "in_progress",
                },
                {
                  label: "QC Review",
                  value: "qc_review",
                },
                {
                  label: "Approved",
                  value: "approved",
                },
                {
                  label: "Rejected",
                  value: "rejected",
                },
                {
                  label: "Completed",
                  value: "completed",
                },
              ]}
              onChange={setStatus}
            />

            <div></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-300 bg-gray-50 px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={exportLoading}
            onClick={() => {
              const newErrors = {
                bankId: "",
                formId: "",
              };

              if (!bankId) {
                newErrors.bankId = "Bank is required";
              }

              if (!formId) {
                newErrors.formId = "Bank Form is required";
              }

              setErrors(newErrors);

              if (newErrors.bankId || newErrors.formId) return;

              onExport({
                bank_id: bankId,
                form_id: formId,
                status,
                start_date: startDate,
                end_date: endDate,
              });
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 py-3 font-semibold text-white hover:shadow-lg disabled:opacity-70"
          >
            <FiDownload />

            {exportLoading ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportCasesModal;
