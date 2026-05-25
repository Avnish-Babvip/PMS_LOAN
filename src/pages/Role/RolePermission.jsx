import { useEffect, useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import {
  deleteRole,
  getRoleWithPermissions,
} from "../../features/actions/role";
import DeleteModal from "../../components/Modal/Delete";
import { useParams } from "react-router-dom";
import AddRolePermissionModal from "../../components/Modal/Role/AddRolePermission";

const RolePermission = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { rolePermissionData, roleLoading } = useSelector(
    (state) => state.role,
  );
  const data = rolePermissionData?.permissions || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    if (!openModal && !openDeleteModal) {
      dispatch(getRoleWithPermissions(id));
    }
  }, [openModal, openDeleteModal]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">
            All Permissions : {rolePermissionData?.name} (Role)
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Permission
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5  px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[160px]">Description</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {roleLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[{ width: "w-32 h-4" }, { width: "w-32 h-4" }]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={3} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No Permissions found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>
                    <td
                      className="truncate  px-3 py-5 text-gray-700"
                      title={item.description}
                    >
                      {item.description || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setSelected({ id: item?.id });
                          }}
                          className="p-2 px-3  bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddRolePermissionModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        permissionNames={data}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Role"
        isLoading={roleLoading}
        message="Are you sure you want to delete this role? This action cannot be undone."
        onConfirm={() => {
          dispatch(deleteRole(selected.id))
            .unwrap()
            .then(() => {
              setOpenDeleteModal(false);
            });
        }}
      />
    </>
  );
};

export default RolePermission;
