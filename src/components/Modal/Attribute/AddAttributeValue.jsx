import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { addAttributeValue } from "../../../features/actions/attribute";
import { Spinner } from "../../Loader/Spinner";
import { useParams } from "react-router-dom";

const AddAttributeValueModal = ({ isOpen, onClose, attribute }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { attributeLoading } = useSelector((state) => state.attribute);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attribute_id: id,
    },
  });

  const onSubmit = (data) => {
    dispatch(addAttributeValue(data))
      .unwrap()
      .then(() => {
        onClose();
      });
  };

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
            Add Value : {attribute}
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-2">
          <Input
            label="Value"
            name="value"
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
            disabled={attributeLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {attributeLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddAttributeValueModal;
