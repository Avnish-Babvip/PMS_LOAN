import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { addCategory } from "../../../features/actions/category";
import { Spinner } from "../../Loader/Spinner";
import PhotoUploadField from "../UploadPhoto";

const AddCategoryModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { categoryLoading } = useSelector((state) => state.category);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parent_id: id || null,
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("status", data.status);
    if (data.image) {
      formData.append("image", data.image);
    }
    if (id) {
      formData.append("parent_id", id);
    }

    dispatch(addCategory(formData))
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  const image = watch("image");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        className="
          bg-[#f9f7f7]
          w-[95%] sm:w-[900px]   /* wider modal */
          max-h-[85vh]
          rounded-xl shadow-xl relative
          flex flex-col
        "
      >
        {/* CLOSE */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8">
          <h2 className="text-center text-black text-xl font-semibold mb-6">
            Add New {id && "Sub"} Category
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-2">
          <PhotoUploadField
            label="Image"
            value={image}
            onChange={(file) =>
              setValue("image", file, { shouldValidate: true })
            }
            error={errors.image?.message}
          />
          <Input
            label={`${id ? "Sub" : ""} Category Name`}
            name="name"
            register={register}
            required
            errors={errors}
          />
          <SelectWithId
            label="Choose Status"
            name="status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            register={register}
            required
            errors={errors}
          />
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={categoryLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {categoryLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCategoryModal;
