import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { addPaymentGateway } from "../../../features/actions/paymentGateway";

const AddPaymentGatewayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { paymentGatewayLoading } = useSelector(
    (state) => state.paymentGateway,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(
      addPaymentGateway({
        ...data,
        is_active: data?.is_active === "true" ? 1 : 0,
      }),
    )
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
            Add Payment Gateway
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {/* ✅ GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Code"
              name="code"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="Name"
              name="name"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="Merchant ID"
              name="merchant_id"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="API Key"
              name="api_key"
              register={register}
              required
              errors={errors}
            />
            <Input
              label="Client ID"
              name="payment_page_client_id"
              register={register}
              required
              errors={errors}
            />

            <Input
              label="Response Key"
              name="response_key"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Environment"
              name="environment"
              options={[
                { label: "Test", value: "test" },
                { label: "Live", value: "live" },
              ]}
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Status"
              name="is_active"
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
              register={register}
              required
              errors={errors}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={paymentGatewayLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {paymentGatewayLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPaymentGatewayModal;
