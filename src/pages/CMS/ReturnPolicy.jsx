import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Spinner } from "../../components/Loader/Spinner";

import { useState } from "react";
import { instance } from "../../services/axiosInterceptor";
import {
  getReturnPolicy,
  updateReturnPolicy,
} from "../../features/actions/cms";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <ReturnPolicyForm />
      </div>
    </div>
  );
}

function ReturnPolicyForm() {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  const [selected, setSelected] = useState(null);

  const { returnPolicyData, cmsLoading } = useSelector((state) => state.cms);

  const {
    register,
    reset,
    control,
    watch,
    setValue,
    getValues, // ✅ add this
    formState: { errors },
  } = useForm({
    defaultValues: {
      policies: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "policies",
  });

  const data = returnPolicyData || [];

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    dispatch(getReturnPolicy());
  }, []);

  useEffect(() => {
    if (!data || initialized) return;
    reset({
      policies: data?.map((item) => ({
        id: item.id,
        category_id: item.category_id,
        description: item.description,
        highlight_text: item.highlight_text || null,
        status: item.status,
      })),
    });

    setInitialized(true);
  }, [data]);

  const handleSingleUpdate = async (item) => {
    const payload = {
      category_id: item.category_id,
      description: item.description,
      status: item.status,
    };

    // ✅ only add if exists
    if (item.highlight_text && item.highlight_text.trim() !== "") {
      payload.highlight_text = item.highlight_text;
    }

    await dispatch(updateReturnPolicy({ payload, id: item?.id })).unwrap();

    dispatch(getReturnPolicy());
  };
  return (
    <>
      <div className="flex items-center justify-between">
        {" "}
        <h2 className="text-xl font-bold text-gray-800 mb-8">
          Return Policy Settings
        </h2>
      </div>

      <form className="space-y-8 text-gray-700">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 p-4 rounded-xl space-y-4"
          >
            {/* CATEGORY */}
            <CategoryField
              register={register}
              setValue={setValue}
              name={`policies.${index}.category_id`}
              value={watch(`policies.${index}.category_id`)} // ✅ IMPORTANT
            />

            {/* DESCRIPTION */}
            <TextAreaField
              label="Description"
              register={register(`policies.${index}.description`, {
                required: "Description required",
              })}
              error={errors?.policies?.[index]?.description}
            />

            {/* HIGHLIGHT TEXT */}
            <TextAreaField
              label="Highlight Text"
              register={register(`policies.${index}.highlight_text`)}
            />

            {/* STATUS */}
            <SelectField
              label="Status"
              register={register(`policies.${index}.status`)}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            <div className="flex justify-end gap-4">
              {" "}
              <button
                type="button"
                onClick={() => {
                  const item = getValues(`policies.${index}`);
                  handleSingleUpdate(item);
                  setSelected(item?.id);
                }}
                className="bg-brand-green text-white w-40 px-4 py-2 rounded-lg"
              >
                {cmsLoading && item.category_id === selected ? (
                  <Spinner />
                ) : (
                  "Update Section"
                )}
              </button>
            </div>
          </div>
        ))}

        {/* SUBMIT */}
      </form>
    </>
  );
}

const TextAreaField = ({ label, register, error }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <textarea
      {...register}
      rows={4}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

const SelectField = ({ label, register, options }) => (
  <div>
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <select
      {...register}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

function CategoryField({ register, setValue, name, value }) {
  const [categories, setCategories] = useState([]);
  const { adminData } = useSelector((state) => state.authentication);
  const loginToken = adminData?.token;
  const [input, setInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  /* ================= FETCH CATEGORY ================= */
  const fetchCategories = async () => {
    try {
      const res = await instance.get(`/admin/returnpolicycategory`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await instance.delete(`/admin/deletereturnpolicycategory/${id}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      // refresh list
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    if (loginToken) {
      fetchCategories();
    }
  }, [loginToken]);

  /* ================= CHECK EXIST ================= */
  useEffect(() => {
    if (!input) {
      setShowAdd(false);
      return;
    }

    const exists = categories?.some(
      (cat) => cat.category_name.toLowerCase() === input.toLowerCase(),
    );

    setShowAdd(!exists);
  }, [input, categories]);

  /* ================= CREATE CATEGORY ================= */
  const handleAddCategory = async () => {
    if (!input) return;

    try {
      setLoading(true);

      const res = await instance.post(
        `/admin/returnpolicycategorystore`,
        {
          category_name: input,
          status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );

      const newCategory = res.data?.data;

      // refresh list
      await fetchCategories();

      // select new category
      setValue(name, newCategory?.id);

      // reset
      setInput("");
      setShowAdd(false);
    } catch (err) {
      console.error("Create category error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <label className="text-sm font-semibold mb-2 block">Category</label>

        {/* SELECT */}
        <select
          {...register(name)}
          value={value || ""} // ✅ THIS FIXES DEFAULT
          className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-200 mb-3"
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Or type new category"
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            const match = categories.find(
              (cat) => cat.category_name.toLowerCase() === value.toLowerCase(),
            );

            if (match) {
              setValue(name, match.id);
            }
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200"
        />

        <div className="flex gap-4">
          {/* ADD BUTTON */}
          {showAdd && (
            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-2 text-sm bg-brand-green text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Adding..." : `+ Add "${input}"`}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            View Categories
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Categories</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* LIST */}
            <div className="max-h-80 overflow-y-auto space-y-3">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-400">No categories found</p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-2"
                  >
                    <span className="text-sm">{cat.category_name}</span>

                    <button
                      type="button" // ✅ FIX
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
