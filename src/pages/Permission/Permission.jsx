import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import {
  deletePermission,
  getAllPermissions,
} from "../../features/actions/permission";
import { EditPermissionModal } from "../../components/Modal/Permission/EditPermission";
import AddPermissionModal from "../../components/Modal/Permission/AddPermission";
import DeleteModal from "../../components/Modal/Delete";
import { useLocation, useSearchParams } from "react-router-dom";
import { setActiveSubTab } from "../../features/slices/references";
import Pagination from "../../components/Pagination";

const Permission = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { permissionData, permissionLoading } = useSelector(
    (state) => state.permission,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const data = permissionData?.data || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const updateParams = ({ page, search }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal && !openDeleteModal) {
      dispatch(getAllPermissions({ search: searchQuery, page }));
    }
  }, [openEditModal, openModal, openDeleteModal, page, searchQuery]);

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
          <h2 className="font-semibold text-gray-800">All Permissions</h2>

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

    Add New Permission
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
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Name</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {permissionLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" },
                  ]}
                  actionColumn
                  actionCount={2}
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
                        No permissions found
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
                    <td className="capitalize ps-5 px-3 py-5 text-gray-700">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {!permissionLoading && hasData && permissionData?.meta && (
        <Pagination
          data={permissionData.meta}
          page={page}
          label="permissions"
          onPageChange={updateParams}
          extraParams={{ search: searchQuery }}
        />
      )}

      <AddPermissionModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Permissions"));
        }}
      />
      <EditPermissionModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        permission={selected}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        isLoading={permissionLoading}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Permission"
        message="Are you sure you want to delete this permission? This action cannot be undone."
        onConfirm={() => {
          dispatch(deletePermission(selected.id))
            .unwrap()
            .then(() => {
              setOpenDeleteModal(false);
              // ✅ move to previous page only if current page is now empty
              if (data.length === 1 && page > 1) {
                setSearchParams({
                  page: page - 1,
                  ...(searchQuery ? { search: searchQuery } : {}),
                });
              }
            });
        }}
      />
    </>
  );
};

export default Permission;
