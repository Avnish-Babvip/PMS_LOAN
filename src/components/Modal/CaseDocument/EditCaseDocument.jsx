import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiCreditCard, FiUploadCloud, FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { Input } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { editCaseDocument } from "../../../features/actions/case";
import { useEffect, useState } from "react";
import { getAllAgents } from "../../../features/actions/agent";

const EditCaseDocumentModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { documentLoading } = useSelector((state) => state.caseSlice);
  const { agentData } = useSelector((state) => state.agent);
  const agents = agentData?.data || [];
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(
      editCaseDocument({
        id: user.id,
        payload: data,
      }),
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  useEffect(() => {
    if (user && isOpen) {
      reset({
        document_name: user?.document_name || "",
        owner_name: user?.owner_name || "",
        verification_point: user?.verification_point || "",
        notes: user?.notes || "",
        assigned_agent_id: user?.assigned_agent_id || "",
      });
    }
  }, [user, isOpen, reset]);

  useEffect(() => {
    dispatch(
      getAllAgents({
        per_page: 1000,
        search,
        status: 1,
      }),
    );
  }, [dispatch, search]);

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
                <h2 className="text-2xl font-bold text-white">
                  Edit Case Document Details
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                  Create a new case document record
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
                label="Document Name"
                name="document_name"
                placeholder="Enter document name"
                register={register}
                required
                errors={errors}
              />
              <Input
                label="Owner Name"
                name="owner_name"
                placeholder="Enter owner name"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="Verification Point"
                name="verification_point"
                placeholder="Enter verification point"
                register={register}
                required
                errors={errors}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter notes"
                  {...register("notes", {
                    required: "Notes are required",
                  })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#79BF28]"
                />

                {errors.notes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              <Controller
                name="assigned_agent_id"
                control={control}
                rules={{
                  required: "Assigned agent is required",
                }}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Assigned Agent
                    </label>

                    <Select
                      placeholder="Select Agent"
                      options={agents.map((agent) => ({
                        value: agent.id,
                        label: agent.name,
                      }))}
                      value={
                        agents
                          .map((agent) => ({
                            value: agent.id,
                            label: agent.name,
                          }))
                          .find((option) => option.value === field.value) ||
                        null
                      }
                      onInputChange={(value) => {
                        setSearch(value);
                      }}
                      onChange={(option) => {
                        field.onChange(option?.value);
                      }}
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "52px",
                          borderRadius: "0.75rem", // rounded-xl
                          borderColor: state.isFocused ? "#79BF28" : "#D1D5DB",
                          boxShadow: "none",
                          paddingLeft: "4px",
                          "&:hover": {
                            borderColor: "#79BF28",
                          },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 12px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9CA3AF",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          zIndex: 9999,
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#F0FDF4"
                            : state.isSelected
                              ? "#79BF28"
                              : "#fff",
                          color: state.isSelected ? "#fff" : "#111827",
                          cursor: "pointer",
                        }),
                      }}
                    />

                    {errors.assigned_agent_id && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.assigned_agent_id.message}
                      </p>
                    )}
                  </div>
                )}
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
              disabled={documentLoading}
              type="submit"
              className="flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              {documentLoading ? <Spinner /> : "Update Case Document Details"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCaseDocumentModal;
