import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectWithId, Textarea } from "../../ReusableInputs";
import { HiX } from "react-icons/hi";
import { Spinner } from "../../Loader/Spinner";
import { updateHomeSection } from "../../../features/actions/home";

export const EditHomeModal = ({ isOpen, onClose, home, appBanner }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { homeLoading } = useSelector((state) => state.home);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      section: home?.section,
      title: home?.title,
      subtitle: home?.subtitle,
      description: home?.description,
      button_text: home?.button_text,
      button_link: home?.button_link,
      apple_button_text: home?.apple_button_text,
      apple_button_link: home?.apple_button_link,
      playstore_button_text: home?.playstore_button_text,
      playstore_button_link: home?.playstore_button_link,
      status: home?.status,
    },
  });
  const selectedFile = watch("bg_image");
  const selectedFileName = selectedFile?.[0]?.name;

  const bgFileName = home?.bg_image?.split("/").pop();

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      // skip hidden/null fields
      if (value === null || value === undefined || value === "") return;

      if (key === "bg_image") {
        if (value?.[0]) {
          formData.append("bg_image", value[0]);
        }
      } else {
        formData.append(key, value);
      }
    });

    dispatch(updateHomeSection({ payload: formData, id: home?.id }))
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
            Edit {appBanner ? "Banner" : "Section"} Details
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {/* ✅ GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Section"
              name="section"
              disabled
              register={register}
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
              // required
              errors={errors}
            />
            {home?.title !== null && home?.title !== undefined && (
              <Textarea
                label="Title"
                name="title"
                register={register}
                required
                errors={errors}
              />
            )}
            {home?.subtitle !== null && home?.subtitle !== undefined && (
              <Textarea
                label="Sub Title"
                name="subtitle"
                register={register}
                errors={errors}
              />
            )}
            {home?.description !== null && home?.description !== undefined && (
              <Textarea
                label="Description"
                name="description"
                register={register}
                errors={errors}
              />
            )}
            {home?.button_text !== null && home?.button_text !== undefined && (
              <Input
                label="Button Text"
                name="button_text"
                register={register}
                errors={errors}
              />
            )}
            {home?.button_link !== null && home?.button_link !== undefined && (
              <Input
                label="Button Link"
                name="button_link"
                register={register}
                errors={errors}
              />
            )}
            {home?.playstore_button_text !== null &&
              home?.playstore_button_text !== undefined && (
                <Input
                  label="Playstore Button Text"
                  name="playstore_button_text"
                  register={register}
                  errors={errors}
                />
              )}
            {home?.playstore_button_link !== null &&
              home?.playstore_button_link !== undefined && (
                <Input
                  label="Playstore Button Link"
                  name="playstore_button_link"
                  register={register}
                  errors={errors}
                />
              )}
            {home?.apple_button_text !== null &&
              home?.apple_button_text !== undefined && (
                <Input
                  label="Apple Button Text"
                  name="apple_button_text"
                  register={register}
                  errors={errors}
                />
              )}
            {home?.apple_button_link !== null &&
              home?.apple_button_link !== undefined && (
                <Input
                  label="Apple Button Link"
                  name="apple_button_link"
                  register={register}
                  errors={errors}
                />
              )}

            {home?.bg_image !== null && home?.bg_image !== undefined && (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Background Image {appBanner ? "(380X180)" : "(1900x500)"}
                </label>

                <label className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-blue-500 transition">
                  <span className="text-sm text-gray-500 truncate">
                    {selectedFileName || bgFileName || "No file selected"}
                  </span>

                  <span className="ml-4 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Choose File
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    {...register("bg_image")}
                    className="hidden"
                  />
                </label>

                {home?.bg_image && !selectedFileName && (
                  <div className="flex items-center gap-3 mt-1">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL_2}/${home.bg_image}`}
                      className="w-30 h-20 object-contain rounded-md border"
                    />

                    <span className="text-xs text-gray-500">
                      Current file:{" "}
                      <span className="font-medium">{bgFileName}</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={homeLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {homeLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};
