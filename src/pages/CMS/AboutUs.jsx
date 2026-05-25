import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { getAboutUs, updateAboutUs } from "../../features/actions/cms";
import { Spinner } from "../../components/Loader/Spinner";

export default function AboutUs() {
  const dispatch = useDispatch();
  const { aboutUsData, cmsLoading } = useSelector((state) => state.cms);

  const { register, control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      banner_title: "",
      banner_image: null,
      bottom_banner: null,
      status: "active",
      about_content: [{ title: "", description: "", status: "active" }],
      images: [{ image: null, status: "active" }],
    },
  });

  const watchedImages = watch("images");

  // ================= FIELD ARRAYS =================
  const {
    fields: aboutFields,
    append: addAbout,
    remove: removeAbout,
  } = useFieldArray({
    control,
    name: "about_content",
  });

  const { fields: imageFields } = useFieldArray({
    control,
    name: "images",
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    dispatch(getAboutUs());
  }, [dispatch]);

  // ================= SET DEFAULT VALUES =================
  useEffect(() => {
    if (aboutUsData) {
      reset({
        banner_title: aboutUsData.banner_title || "",
        banner_image: null,
        bottom_banner: null,
        status: "active",

        banner_preview: aboutUsData.banner_image,
        bottom_preview: aboutUsData.bottom_banner,

        about_content:
          aboutUsData.about_content?.length > 0
            ? aboutUsData.about_content
            : [{ title: "", description: "", status: "active" }],

        images:
          aboutUsData.images?.length > 0
            ? aboutUsData.images.map((img) => ({
                image: null,
                preview: img.image,
                status: img.status,
                isNew: false, // ✅ EXISTING IMAGE
              }))
            : [{ image: null, status: "active", isNew: true }],
      });
    }
  }, [aboutUsData, reset]);

  // ================= SUBMIT =================
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("section", "About Us");
    formData.append("banner_title", data.banner_title);
    formData.append("status", data.status);

    // ABOUT CONTENT
    data.about_content.forEach((item, i) => {
      formData.append(`about_content[${i}][title]`, item.title);
      formData.append(`about_content[${i}][description]`, item.description);
      formData.append(`about_content[${i}][status]`, item.status);
    });

    // Banner Image
    if (data.banner_image && data.banner_image[0]) {
      formData.append("banner_image", data.banner_image[0]);
    }

    // Bottom Banner
    if (data.bottom_banner && data.bottom_banner[0]) {
      formData.append("bottom_banner", data.bottom_banner[0]);
    }

    // IMAGES ✅ FIXED STRUCTURE
    data.images.forEach((item, i) => {
      if (item.image) {
        formData.append(`images[${i}][image]`, item.image);
      }
      formData.append(`images[${i}][status]`, item.status || "active");
    });

    dispatch(
      updateAboutUs({
        payload: formData,
        id: aboutUsData?.id,
      }),
    );
  };

  // ================= UI =================
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 text-gray-700"
        >
          {/* ================= BANNER ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Banner Settings
            </h3>

            <input
              type="text"
              placeholder="Banner Title"
              {...register("banner_title")}
              className="w-full border border-gray-200 outline-brand-green focus:ring-0 p-3 rounded-lg"
            />

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Top Banner Image (1900 × 450 px)
              </label>

              {/* Preview */}
              {aboutUsData?.banner_image && (
                <img
                  src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${aboutUsData.banner_image}`}
                  className="w-full h-48 object-contain rounded-lg mb-3"
                />
              )}

              {/* Upload */}
              <label className="block border-2 border-dashed bg-white border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-brand-green transition">
                <span className="text-sm text-gray-500">
                  Click to upload banner
                </span>
                <input
                  type="file"
                  accept="image/*"
                  {...register("banner_image")}
                  className="hidden"
                />
              </label>
            </div>

            {/* ================= BOTTOM BANNER ================= */}
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2">
                Bottom Banner Image (760 × 450 px)
              </label>

              {/* Preview */}
              {aboutUsData?.bottom_banner && (
                <img
                  src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${aboutUsData.bottom_banner}`}
                  className="w-full h-48 object-contain rounded-lg mb-4"
                />
              )}

              {/* Upload */}
              <label className="block border-2 border-dashed bg-white border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-green transition">
                <span className="text-sm text-gray-500">
                  Click to upload bottom banner
                </span>
                <input
                  type="file"
                  accept="image/*"
                  {...register("bottom_banner")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ================= ABOUT CONTENT ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                About Sections
              </h3>
              <button
                type="button"
                onClick={() =>
                  addAbout({
                    title: "",
                    description: "",
                    status: "active",
                  })
                }
                className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-6">
              {aboutFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-5 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAbout(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Title"
                    {...register(`about_content.${index}.title`)}
                    className="w-full border border-gray-200 outline-brand-green focus:ring-0 bg-white p-3 rounded-lg mb-3"
                  />

                  <textarea
                    rows={4}
                    placeholder="Description"
                    {...register(`about_content.${index}.description`)}
                    className="w-full border border-gray-200 outline-brand-green focus:ring-0 bg-white p-3 rounded-lg mb-3"
                  />

                  <select
                    {...register(`about_content.${index}.status`)}
                    className="border bg-white border-gray-200 outline-brand-green focus:ring-0 p-2 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* ================= IMAGES ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Images</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {imageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3"
                >
                  {/* Preview */}
                  {watchedImages?.[index]?.preview && (
                    <img
                      src={
                        watchedImages[index].preview.startsWith("blob:")
                          ? watchedImages[index].preview
                          : `${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${watchedImages[index].preview}`
                      }
                      className="w-full h-52 object-contain rounded-lg"
                    />
                  )}

                  {/* Upload Box */}
                  <label className="block border-2 border-dashed bg-white border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-brand-green transition">
                    <span className="text-sm text-gray-500 ">
                      Click to upload image (600 × 600 px)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setValue(`images.${index}.image`, file);
                          setValue(
                            `images.${index}.preview`,
                            URL.createObjectURL(file),
                          );
                        }
                      }}
                    />
                  </label>

                  {/* Status */}
                  <select
                    {...register(`images.${index}.status`)}
                    className="w-full border outline-brand-green focus:ring-0 border-gray-200 bg-white p-2 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* ================= SUBMIT ================= */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-green text-white px-8 w-52 py-3 rounded-lg hover:opacity-90"
            >
              {cmsLoading ? <Spinner /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
