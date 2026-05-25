import { useFieldArray, useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId, Textarea } from "../../ReusableInputs";
import { addProduct } from "../../../features/actions/product";
import { Spinner } from "../../Loader/Spinner";
import { FiTrash2 } from "react-icons/fi";
import MultiPhotoUpload from "../MultipleUploadPhoto";
import { useMemo, useState } from "react";
import { VariationAttributes } from "../../../pages/Product/VariationAttributes";

const AddProductModal = ({
  isOpen,
  onClose,
  categories = [],
  attributes = [],
}) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { productLoading } = useSelector((state) => state.product);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    control,
  } = useForm();

  const [primaryIndex, setPrimaryIndex] = useState(0);

  const selectedCategoryId = watch("parent_category_id");

  const parentCategoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const subCategoryOptions = useMemo(() => {
    const parent = categories.find((c) => c.id === Number(selectedCategoryId));

    if (!parent?.children_recursivee?.length) return [];

    return parent.children_recursivee.map((child) => ({
      value: child.id,
      label: child.name,
    }));
  }, [selectedCategoryId, categories]);

  const handleAddVariation = () => {
    append({
      sku: "",
      regular_price: "",
      sale_price: "",
      stock: "",
      low_stock_alert: "",
      attributes: [
        {
          attribute_id: "",
          attribute_value_id: "",
        },
      ],
    });
  };

  const images = watch("images");
  const productType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const onSubmit = (data) => {
    // 🚨 Validate variations
    if (
      data.type === "variable" &&
      (!data.variations || data.variations.length === 0)
    ) {
      setError("variations", {
        type: "manual",
        message: "At least one variation is required.",
      });
      return;
    }

    const formData = new FormData();

    // Parent category always exists
    formData.append("category_ids[0]", data.parent_category_id);

    // Subcategory only if selected
    if (data.subcategory_id) {
      formData.append("category_ids[1]", data.subcategory_id);
    }

    if (data.images?.length) {
      data.images.forEach((img, index) => {
        if (img.file) {
          formData.append("images[]", img.file);
        }
      });
    }

    // 🔹 BASIC PRODUCT FIELDS
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("type", data.type); // simple | variable
    formData.append("status", data.status);
    formData.append("description", data.description);
    formData.append("featured", data.featured ? 1 : 0);
    formData.append("is_new", data.is_new ? 1 : 0);
    formData.append("primary_image_index", data.primary_image_index ?? 0);

    // 🔹 SIMPLE PRODUCT
    if (data.type === "simple") {
      formData.append("regular_price", data.regular_price);
      formData.append("sale_price", data.sale_price ?? "");
      formData.append("stock", data.stock);
      formData.append("low_stock_alert", data.low_stock_alert);
    }

    // 🔹 VARIABLE PRODUCT
    if (data.type === "variable") {
      data.variations.forEach((variation, vIndex) => {
        formData.append(`variations[${vIndex}][sku]`, variation.sku);
        formData.append(
          `variations[${vIndex}][regular_price]`,
          variation.regular_price,
        );
        formData.append(
          `variations[${vIndex}][sale_price]`,
          variation.sale_price ?? "",
        );
        formData.append(`variations[${vIndex}][stock]`, variation.stock);
        formData.append(
          `variations[${vIndex}][low_stock_alert]`,
          variation.low_stock_alert,
        );

        variation.attributes.forEach((attr, aIndex) => {
          formData.append(
            `variations[${vIndex}][attributes][${aIndex}][attribute_id]`,
            attr.attribute_id,
          );
          formData.append(
            `variations[${vIndex}][attributes][${aIndex}][attribute_value_id]`,
            attr.attribute_value_id,
          );
        });
      });
    }

    // 🔍 Debug (IMPORTANT)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(addProduct(formData)).unwrap().then(onClose);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div className="bg-[#f9f7f7] w-[95%] sm:w-[1000px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative">
        {/* CLOSE */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <HiX size={26} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-center text-xl text-black font-semibold">
            Add New Product
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-6">
          {/* BASIC INFO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              {" "}
              <MultiPhotoUpload
                label="Product Images"
                value={images}
                primaryIndex={primaryIndex}
                onPrimaryChange={setPrimaryIndex}
                onDeleteApiImage={(imageId) => dispatch(deleteImage(imageId))}
                onChange={(files) => {
                  setValue("images", files, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </div>

            <Input
              label="Product Name"
              name="name"
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Category"
              name="parent_category_id"
              options={parentCategoryOptions}
              register={register}
              required
              errors={errors}
            />

            {subCategoryOptions.length > 0 && (
              <SelectWithId
                label="Sub Category"
                name="subcategory_id"
                options={subCategoryOptions}
                register={register}
                required
                errors={errors}
              />
            )}

            <SelectWithId
              label="Product Type"
              name="type"
              options={[
                { value: "simple", label: "Simple" },
                { value: "variable", label: "Variable" },
              ]}
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Status"
              name="status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              register={register}
              required
              errors={errors}
            />

            <SelectWithId
              label="Featured"
              name="featured"
              options={[
                { value: 0, label: "No" },
                { value: 1, label: "Yes" },
              ]}
              register={register}
            />

            <SelectWithId
              label="Is New"
              name="is_new"
              options={[
                { value: 0, label: "No" },
                { value: 1, label: "Yes" },
              ]}
              register={register}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                name="description"
                register={register}
                required
                errors={errors}
              />
            </div>

            {/* SIMPLE PRODUCT FIELDS */}
            {productType === "simple" && (
              <div className="bg-white md:col-span-2 border rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-black text-lg">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="SKU"
                    name="sku"
                    register={register}
                    required
                    errors={errors}
                  />
                  <Input
                    label="Regular Price"
                    name="regular_price"
                    register={register}
                    required
                    errors={errors}
                  />

                  <Input
                    label="Sale Price"
                    name="sale_price"
                    register={register}
                    errors={errors}
                  />

                  <Input
                    label="Stock"
                    name="stock"
                    register={register}
                    required
                    errors={errors}
                  />

                  <Input
                    label="Low Stock Alert"
                    name="low_stock_alert"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
            )}
          </div>
          {/* VARIATIONS */}
          {productType === "variable" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-black text-lg">Variations</h3>

              {fields.map((field, vIndex) => (
                <div
                  key={field.id}
                  className="bg-white border rounded-xl p-4 space-y-5"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Variation {vIndex + 1}</h4>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(vIndex)}
                        className="text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>

                  {/* VARIATION BASIC FIELDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="SKU"
                      name={`variations.${vIndex}.sku`}
                      register={register}
                      required
                      errors={errors}
                    />

                    <Input
                      label="Regular Price"
                      name={`variations.${vIndex}.regular_price`}
                      register={register}
                      required
                      errors={errors}
                    />

                    <Input
                      label="Sale Price"
                      name={`variations.${vIndex}.sale_price`}
                      register={register}
                      errors={errors}
                    />

                    <Input
                      label="Stock"
                      name={`variations.${vIndex}.stock`}
                      register={register}
                      required
                      errors={errors}
                    />

                    <Input
                      label="Low Stock Alert"
                      name={`variations.${vIndex}.low_stock_alert`}
                      register={register}
                      errors={errors}
                    />
                  </div>

                  {/* ATTRIBUTES */}
                  <VariationAttributes
                    control={control}
                    register={register}
                    watch={watch}
                    errors={errors}
                    attributes={attributes}
                    vIndex={vIndex}
                  />
                </div>
              ))}

              {/* ADD VARIATION */}
              <button
                type="button"
                onClick={handleAddVariation}
                className="text-blue-700 font-medium"
              >
                + Add Variation
              </button>

              {errors.variations && (
                <p className="text-sm text-red-500 ">
                  {errors.variations.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t">
          <button
            type="submit"
            disabled={productLoading}
            className="w-full py-2.5 rounded-lg font-semibold bg-blue-700 text-white"
          >
            {productLoading ? <Spinner /> : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProductModal;
