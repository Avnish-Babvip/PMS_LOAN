import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { FiShield, FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Input, Textarea } from "../../ReusableInputs";
import { addRole } from "../../../features/actions/role";
import { Spinner } from "../../Loader/Spinner";
import { getAllPermissions } from "../../../features/actions/permission";

const AddRoleModal = ({ isOpen, onClose }) => {
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
    setValue,
    formState: { errors },
  } = useForm();

  const selectedPermissions = watch("permissions") || [];

  const onSubmit = (data) => {
    const permissions = new Set(data.permissions || []);
    permissions.add("view dashboard");

    dispatch(
      addRole({
        ...data,
        permissions: [...permissions],
      }),
    )
      .unwrap()
      .then(() => {
        reset();
        onClose();
      });
  };

  useEffect(() => {
    if (!selectedPermissions.length) return;

    const updatedPermissions = new Set(selectedPermissions);

    selectedPermissions.forEach((permission) => {
      const lower = permission.toLowerCase();

      if (
        lower.startsWith("create ") ||
        lower.startsWith("edit ") ||
        lower.startsWith("delete ")
      ) {
        const resource = lower
          .replace(/^create\s+/, "")
          .replace(/^edit\s+/, "")
          .replace(/^delete\s+/, "");

        const viewPermission = data.find(
          (p) => p.name.toLowerCase() === `view ${resource}`,
        );

        if (viewPermission) {
          updatedPermissions.add(viewPermission.name);
        }
      }
    });

    if (updatedPermissions.size !== selectedPermissions.length) {
      setValue("permissions", [...updatedPermissions], {
        shouldValidate: true,
      });
    }
  }, [selectedPermissions, data, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        permissions: ["view dashboard"],
      });

      dispatch(getAllPermissions({ per_page: 1000 }));
    }
  }, [dispatch, isOpen, reset]);

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
                <h2 className="text-2xl font-bold text-white">Add New Role</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Create role and assign permissions
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
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Role Name */}
            <div className="mb-8">
              <h3 className="mb-5 text-lg font-semibold text-gray-800">
                Role Information
              </h3>

              <Input
                label="Role Name"
                name="name"
                placeholder="Enter role name"
                register={register}
                required
                errors={errors}
              />
            </div>

            {/* Permissions */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Permissions
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Select permissions for this role
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                  {data?.length || 0} Permissions
                </div>
              </div>

              <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">
                {data?.map((permission) => {
                  const isDashboardPermission =
                    permission.name.toLowerCase() === "view dashboard";

                  return (
                    <label
                      key={permission.id}
                      className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300
      ${
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

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-gray-300 bg-white transition-all duration-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500">
                        <FiCheck className="hidden text-sm text-white peer-checked:block" />
                      </div>

                      <span className="text-sm font-medium capitalize text-gray-700">
                        {permission.name}
                      </span>
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
              {roleLoading ? <Spinner /> : "Create Role"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoleModal;
