import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { FiShield, FiCheck } from "react-icons/fi";

import { Input, Textarea } from "../../ReusableInputs";
import { editRole } from "../../../features/actions/role";
import { getAllPermissions } from "../../../features/actions/permission";
import { Spinner } from "../../Loader/Spinner";

export const EditRoleModal = ({ isOpen, onClose, role }) => {
  const dispatch = useDispatch();

  const { roleLoading } = useSelector((state) => state.role);

  const { permissionData } = useSelector((state) => state.permission);

  const data =
    (Array.isArray(permissionData?.data) && permissionData?.data) || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: role?.name || "",
      permissions: role?.permissions?.map((p) => p?.name) || [],
    },
  });

  const selectedPermissions = watch("permissions") || [];

  const onSubmit = (data) => {
    const permissions = new Set(data.permissions || []);
    permissions.add("view dashboard");

    dispatch(
      editRole({
        id: role?.id,
        payload: {
          ...data,
          permissions: [...permissions],
        },
      }),
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  useEffect(() => {
    if (role && isOpen) {
      const permissions = role?.permissions?.map((p) => p?.name) || [];

      if (!permissions.includes("view dashboard")) {
        permissions.push("view dashboard");
      }

      reset({
        name: role?.name || "",
        permissions,
      });
    }
  }, [role, isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllPermissions({ per_page: 1000 }));
    }
  }, [dispatch, isOpen, role]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex h-[95vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] px-8 py-6">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                <FiShield size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Edit Role</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Update role details and permissions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <HiX size={24} />
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* LEFT */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Role Information
              </h3>

              <div className="space-y-5">
                <Input
                  label="Role Name"
                  name="name"
                  placeholder="Enter role name"
                  register={register}
                  required
                  errors={errors}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Permissions
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Update permissions for this role
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                  {data?.length || 0} Permissions
                </div>
              </div>

              <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                {data?.map((permission) => {
                  const isDashboardPermission =
                    permission.name.toLowerCase() === "view dashboard";

                  return (
                    <label
                      key={permission.id}
                      className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                        isDashboardPermission
                          ? "cursor-not-allowed border-indigo-200 bg-indigo-50"
                          : "cursor-pointer border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={permission.name}
                        {...register("permissions")}
                        disabled={isDashboardPermission}
                        checked={
                          isDashboardPermission
                            ? true
                            : selectedPermissions.includes(permission.name)
                        }
                        className="peer hidden"
                      />

                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-gray-300 bg-white transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500">
                        <FiCheck className="hidden text-sm text-white peer-checked:block" />
                      </div>

                      <p className="text-sm font-medium capitalize text-gray-700">
                        {permission.name}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={roleLoading}
              type="submit"
              className="flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#79BF28] to-[#5ea51f] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {roleLoading ? <Spinner /> : "Update Role"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
