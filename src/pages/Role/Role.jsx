import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import { deleteRole, getAllRoles } from "../../features/actions/role";
import { EditRoleModal } from "../../components/Modal/Role/EditRole";
import AddRoleModal from "../../components/Modal/Role/AddRole";
import DeleteModal from "../../components/Modal/Delete";
import { Link, useLocation } from "react-router-dom";
import { setActiveSubTab } from "../../features/slices/references";

const Role = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { roleData, roleLoading } = useSelector((state) => state.role);
  const data = roleData || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    if (!openEditModal && !openModal && !openDeleteModal) {
      dispatch(getAllRoles());
    }
  }, [openEditModal, openModal, openDeleteModal]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Roles</h2>

          <div className="flex gap-3">
        <button
  onClick={() => setOpenModal(true)}
  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
>
  <span className="relative z-10 flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>

    Add New Role
  </span>

  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
</button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5  px-3 py-3 w-[160px]">Role ID</th>
                <th className="text-left px-3 py-3 w-[160px]">Name</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {roleLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" },
                    { width: "w-32 h-4" },
                  ]}
                  actionColumn
                  actionCount={3}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={4} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No roles found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters
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
                      {item.id || "—"}
                    </td>
                    <td className=" px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>
               

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        {/* <button className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <FiEye />
                        </button> */}
                        <button
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelected(item);
                          }}
                          className="p-2 px-3 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setSelected({ id: item?.id });
                          }}
                          className="p-2 px-3  bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                        >
                          <FiTrash2 />
                        </button>
                        <Link
                          to={`${item?.id}/${item?.name}`}
                          className="p-2 px-3 flex items-center gap-2 bg-indigo-100 text-indigo-500 rounded-lg hover:bg-indigo-200"
                        >
                          <FiEye />
                          <span>View Permissions</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddRoleModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Roles"));
        }}
      />
      <EditRoleModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        role={selected}
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

export default Role;
