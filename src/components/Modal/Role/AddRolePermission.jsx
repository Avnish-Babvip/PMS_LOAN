import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addRoleWithPermissions } from "../../../features/actions/role";
import { Spinner } from "../../Loader/Spinner";
import { useEffect } from "react";
import { getAllPermissions } from "../../../features/actions/permission";
import { useParams } from "react-router-dom";

const AddRolePermissionModal = ({ isOpen, onClose, permissionNames }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { roleLoading } = useSelector((state) => state.role);
  const { permissionData } = useSelector((state) => state.permission);

  const existingPermissionIds = new Set(
    (permissionNames || []).map((p) => String(p.id)),
  );

  const data =
    (Array.isArray(permissionData?.data) && permissionData?.data) || [];

  const groupedPermissions = data.reduce((acc, item) => {
    const module = item.module || "Permissions";

    if (!acc[module]) acc[module] = [];
    acc[module].push(item);

    return acc;
  }, {});

  //  e.g. {
  //   role: [ { id: 6, name: "avnishrole" } ],
  //   Logs: [ { id: 5, name: "Avnish" } ]
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      permissions: [...existingPermissionIds],
    },
  });

  const onSubmit = (data) => {
    dispatch(addRoleWithPermissions({ role_id: id, ...data }))
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  useEffect(() => {
    dispatch(getAllPermissions({ per_page: 1000 }));
  }, []);

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
            Add New Role Permission
          </h2>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-4">
          {Object.entries(groupedPermissions).map(([module, permissions]) => (
            <div
              key={module}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {/* MODULE HEADER */}
              <h3 className="text-sm font-semibold uppercase text-gray-700 mb-3">
                {module}
              </h3>

              {/* PERMISSIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={perm.id}
                      disabled={existingPermissionIds.has(String(perm.id))}
                      {...register("permissions", { required: true })}
                      className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500
    ${
      existingPermissionIds.has(String(perm.id))
        ? "opacity-60 cursor-not-allowed"
        : ""
    }
  `}
                    />
                    {perm.name}
                    {existingPermissionIds.has(String(perm.id)) && (
                      <span className="text-xs text-gray-400">
                        (Already assigned)
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {errors.permissions && (
            <p className="text-red-500 text-xs mt-2">
              Please select at least one permission
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-300">
          <button
            disabled={roleLoading}
            type="submit"
            className="
              w-full py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-blue-700 to-blue-900
              hover:from-blue-600 hover:to-blue-800
              text-white transition
            "
          >
            {roleLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddRolePermissionModal;
