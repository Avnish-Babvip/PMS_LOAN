import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { Input, SelectWithId, Textarea } from "../../ReusableInputs";
import { deleteImage, editProduct } from "../../../features/actions/product";
import { Spinner } from "../../Loader/Spinner";
import { FiTrash2 } from "react-icons/fi";
import MultiPhotoUpload from "../MultipleUploadPhoto";
import { useEffect, useMemo, useState } from "react";
import { VariationAttributes } from "../../../pages/Product/VariationAttributes";

export const EditProductModal = ({
  isOpen,
  onClose,
  categories = [],
  attributes = [],
  product,
}) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { productLoading } = useSelector((state) => state.product);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const initialPrimaryIndex =
    product?.images?.findIndex((img) => img.is_primary) ?? 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      variations: [],
      images: [],
    },
  });

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
    const formData = new FormData();

    /* =========================
     CATEGORIES (MERGED)
  ========================= */
    const categoryIds = [];

    if (data.parent_category_id) {
      categoryIds.push(data.parent_category_id);
    }
    if (data.subcategory_id) {
      categoryIds.push(data.subcategory_id);
    }

    categoryIds.forEach((id) => {
      formData.append("category_ids[]", id);
    });

    /* =========================
     BASIC FIELDS
  ========================= */
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("type", data.type);
    formData.append("status", data.status);
    formData.append("description", data.description);
    formData.append("featured", data.featured ? 1 : 0);
    formData.append("is_new", data.is_new ? 1 : 0);

    /* =========================
     IMAGES
  ========================= */
    if (data.images?.length) {
      data.images.forEach((img, index) => {
        if (img.file) {
          formData.append("images[]", img.file);
        }
      });
    }

    // ✅ ALWAYS send primary index
    formData.append("primary_image_index", primaryIndex);

    /* =========================
     SIMPLE PRODUCT
  ========================= */
    if (data.type === "simple") {
      formData.append("regular_price", data.regular_price);
      formData.append("sale_price", data.sale_price ?? "");
      formData.append("stock", data.stock);
    }

    /* =========================
     VARIABLE PRODUCT
  ========================= */
    if (data.type === "variable") {
      data.variations.forEach((variation, vIndex) => {
        if (product.variations[vIndex]) {
          formData.append(
            `variations[${vIndex}][id]`,
            product.variations[vIndex].id,
          );
        }

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

    dispatch(editProduct({ id: product.id, payload: formData }))
      .unwrap()
      .then(onClose);
  };

  useEffect(() => {
    if (!product || !isOpen) return;

    // categories
    const parentCategory = product.categories_data?.[0];
    const subCategory = product.categories_data?.[1];

    // images (convert API images to strings)
    const images = product.images?.map((img) => ({
      id: img.id,
      url: `${import.meta.env.VITE_REACT_APP_IMAGE_URL}/${img.image}`,
      file: null,
    }));

    // variations
    const variations =
      product.type === "variable"
        ? product.variations.map((v) => ({
            sku: v.sku,
            regular_price: v.regular_price,
            sale_price: v.sale_price,
            stock: v.stock,
            attributes: v.attributes.map((a) => ({
              attribute_id: a.attribute_id,
              attribute_value_id: a.attribute_value_id,
            })),
          }))
        : [];

    reset({
      name: product.name,
      sku: product.sku,
      description: product.description,
      type: product.type,
      status: product.status,
      featured: product.featured ? 1 : 0,
      is_new: product.is_new ? 1 : 0,

      parent_category_id: parentCategory?.id,
      subcategory_id: subCategory?.id,

      images,

      regular_price: product.regular_price,
      sale_price: product.sale_price,
      stock: product.stock,

      variations,
    });

    setPrimaryIndex(initialPrimaryIndex);
  }, [product, isOpen, reset]);

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
            Edit Product Details
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
                    <h4 className="font-semibold text-gray-800">
                      Variation {vIndex + 1}
                    </h4>

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
                  </div>

                  {/* ATTRIBUTES */}
                  <VariationAttributes
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue} // 👈 ADD THIS
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
            {productLoading ? <Spinner /> : "Update Product"}
          </button>
        </div>
      </div>
    </form>
  );
};
