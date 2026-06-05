import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiFileText } from "react-icons/fi";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { addFormField, deleteFormField, editBasicDetails, editFormField, getFormDetails } from "../../../features/actions/form";

const EditBankFormModal = ({
  isOpen,
  onClose,
  selectedForm,
}) => {
  const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "decimal", label: "Decimal" },
  { value: "email", label: "Email" },
  { value: "mobile", label: "Mobile" },
  { value: "password", label: "Password" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "multiselect", label: "Multi Select" },
  { value: "radio", label: "Radio Button" },
  { value: "checkbox", label: "Checkbox" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
  { value: "time", label: "Time" },
  { value: "file", label: "File Upload" },
  { value: "image", label: "Image Upload" },
  { value: "hidden", label: "Hidden Field" },
];
  const dispatch = useDispatch();
  const [editingFieldId, setEditingFieldId] = useState(null);
const [editingField, setEditingField] = useState({});

  const { basicLoading,fieldLoading,formDetailData} = useSelector(
    (state) => state.form
  );

  const fetchFormDetails = () => {
  if (selectedForm?.id) {
    dispatch(getFormDetails(selectedForm.id));
  }
};
const handleCreateField = () => {
  if (!editingField?.field_name?.trim()) {
    alert("Field name is required");
    return;
  }

  dispatch(
    addFormField({
      id: selectedForm.id,
      payload: editingField,
    })
  )
    .unwrap()
    .then(() => {
      setEditingFieldId(null);
      setEditingField({});
      fetchFormDetails();
    });
};

const handleDelete = (fieldId) => {
  if (
    window.confirm(
      "Are you sure you want to delete this field?"
    )
  ) {
    dispatch(deleteFormField(fieldId))
      .unwrap()
      .then(() => {
        fetchFormDetails();
      });
  }
};

  const handleEdit = (field) => {
  setEditingFieldId(field.id);
  setEditingField({
    field_name: field.field_name,
    field_type: field.field_type,
    is_required: field.is_required,
  });
};

const handleCancel = () => {
  setEditingFieldId(null);
  setEditingField({});
};

const handleChange = (key, value) => {
  setEditingField((prev) => ({
    ...prev,
    [key]: value,
  }));
};

const handleSave = (fieldId) => {
  dispatch(
    editFormField({
      id: fieldId,
      payload: editingField,
    })
  )
    .unwrap()
    .then(() => {
      setEditingFieldId(null);
      fetchFormDetails();
    });
};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (formDetailData && isOpen) {
      reset({
        form_name: formDetailData?.form_name || "",
        loan_type: formDetailData?.loan_type || "",
        status: formDetailData?.status || "draft",
      });
    }
  }, [formDetailData, isOpen, reset]);

  const onSubmit = (data) => {
    dispatch(
      editBasicDetails
      ({
        id: selectedForm?.id,
        payload: data,
      })
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

 useEffect(() => {
  if (isOpen && selectedForm?.id) {
    fetchFormDetails();
  }
}, [isOpen, selectedForm?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FiFileText size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Edit Bank Form
                </h2>

                <p className="text-sm text-gray-300">
                  View and update bank form configuration
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          {/* Form Details */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">
              Form Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Form Name"
                name="form_name"
                register={register}
                required
                errors={errors}
              />

              <Input
                label="Loan Type"
                name="loan_type"
                register={register}
                required
                errors={errors}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  {...register("status")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#79BF28]"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>
                </select>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Fields
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {formDetailData?.fields?.length || 0}
                </p>
              </div>

              <div >    </div>       
                 <button
              disabled={basicLoading}
              type="submit"
              className="flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 font-semibold text-white shadow-lg"
            >
              {basicLoading ? (
                <Spinner />
              ) : (
                "Update Basic Details"
              )}
            </button>

            </div>
          </div>

          {/* Fields Table */}
          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold text-gray-800">
      Dynamic Fields
    </h3>

    <span className="mt-1 inline-block rounded-full bg-[#79BF28]/10 px-3 py-1 text-sm font-medium text-[#79BF28]">
      {formDetailData?.fields?.length || 0} Fields
    </span>
  </div>

<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingFieldId("new");
    setEditingField({
      field_name: "",
      field_type: "text",
      is_required: false,
    });
  }}
  className="relative z-50 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-xl"
>
  + Add Field
</button>
</div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        No.
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Field Name
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Required
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
  Actions
</th>
                    </tr>
                  </thead>

                  <tbody>
                      {editingFieldId === "new" && (
    <tr className="border-t bg-green-50">
      <td className="px-4 py-3 font-medium text-green-600">
        New
      </td>

      <td className="px-4 py-3">
        <input
          value={editingField.field_name || ""}
          onChange={(e) =>
            handleChange("field_name", e.target.value)
          }
          placeholder="Enter field name"
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
        />
      </td>

      <td className="px-4 py-3">
      <select
  value={editingField.field_type}
  onChange={(e) =>
    handleChange("field_type", e.target.value)
  }
  className="rounded-xl border border-gray-300 px-3 py-2"
>
  {fieldTypes.map((type) => (
    <option
      key={type.value}
      value={type.value}
    >
      {type.label}
    </option>
  ))}
</select>
      </td>

      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={editingField.is_required || false}
          onChange={(e) =>
            handleChange(
              "is_required",
              e.target.checked
            )
          }
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCreateField}
            className="rounded-lg bg-green-100 p-2 text-green-600"
          >
            <FiSave />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg bg-red-100 p-2 text-red-600"
          >
            <FiX />
          </button>
        </div>
      </td>
    </tr>
  )}
               {formDetailData?.fields?.map((field, index) => (
  <tr
    key={field.sequence}
    className="border-t border-gray-100 hover:bg-gray-50"
  >
    <td className="px-4 py-3 text-gray-500">
      {field.sequence}
    </td>

    <td className="px-4 py-3">
      {editingFieldId === field.id ? (
        <input
          value={editingField.field_name || ""}
          onChange={(e) =>
            handleChange("field_name", e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
        />
      ) : (
        <span className="font-medium text-gray-700">
          {field.field_name}
        </span>
      )}
    </td>


    <td className="px-4 py-3">
      {editingFieldId === field.id ? (
        <select
          value={editingField.field_type}
          onChange={(e) =>
            handleChange("field_type", e.target.value)
          }
          className="rounded-xl border border-gray-300 px-3 py-2"
        >
          {fieldTypes.map((type) => (
    <option
      key={type.value}
      value={type.value}
    >
      {type.label}
    </option>
  ))}
        </select>
      ) : (
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          {field.field_type}
        </span>
      )}
    </td>

    <td className="px-4 py-3">
      {editingFieldId === field.id ? (
        <input
          type="checkbox"
          checked={editingField.is_required}
          onChange={(e) =>
            handleChange(
              "is_required",
              e.target.checked
            )
          }
        />
      ) : field.is_required ? (
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
          Required
        </span>
      ) : (
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
          Optional
        </span>
      )}
    </td>

    <td className="px-4 py-3">
      {editingFieldId === field.id ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSave(field.id)}
            className="rounded-lg bg-green-100 p-2 text-green-600"
          >
            <FiSave />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg bg-red-100 p-2 text-red-600"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleEdit(field)}
            className="rounded-lg bg-orange-100 p-2 text-orange-600"
          >
            <FiEdit2 />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(field.id)}
            className="rounded-lg bg-red-100 p-2 text-red-600"
          >
            <FiTrash2 />
          </button>
        </div>
      )}
    </td>
  </tr>
))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


      </form>
    </div>
  );
};

export default EditBankFormModal;