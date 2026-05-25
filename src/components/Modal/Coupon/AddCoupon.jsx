import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId } from "../../ReusableInputs";
import { Spinner } from "../../Loader/Spinner";
import { addCoupon } from "../../../features/actions/coupon";

const AddCouponModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { couponLoading } = useSelector((state) => state.coupon);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(addCoupon(data))
      .unwrap()
      .then(() => {
        onClose();
      });
  };
  const discountType = watch("discount_type");

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
            Add Coupon
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
              type="number"
              label="Min Cart Value"
              name="min_cart_value"
              register={register}
              required
              errors={errors}
            />
            <Input
              type="number"
              label="Max Discount Value"
              name="max_discount"
              register={register}
              required
              errors={errors}
            />
            <Input
              type="number"
              label="Usage Limit"
              name="usage_limit"
              register={register}
              required
              errors={errors}
            />
            <Input
              type="datetime-local"
              label="Start At"
              name="start_at"
              register={register}
              required
              errors={errors}
            />

            <Input
              type="datetime-local"
              label="End At"
              name="end_at"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Discount Type"
              name="discount_type"
              options={[
                { label: "Flat", value: "flat" },
                { label: "Percentage", value: "percentage" },
              ]}
              register={register}
              required
              errors={errors}
            />
            <Input
              type="number"
              label={`Discount Value (${discountType === "percentage" ? "%" : "₹"})`}
              placeholder={
                discountType === "percentage"
                  ? "Enter percentage (e.g. 10)"
                  : "Enter flat discount (e.g. 200)"
              }
              name="discount_value"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Status"
              name="status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              register={register}
              required
              errors={errors}
            />

            {/* ✅ FULL WIDTH FIELD */}
            {/* <div className="md:col-span-2">
              <Textarea
                label="Remarks"
                name="remarks"
                placeholder="Write remarks ..."
                register={register}
                required
                errors={errors}
              />
            </div> */}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={couponLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {couponLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCouponModal;
