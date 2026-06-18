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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="font-semibold text-gray-800">All Permissions</h2>

          <div className="flex gap-3">

          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Name</th>
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
       

          
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {!permissionLoading && hasData && permissionData?.meta?.pagination && (
        <Pagination
          data={permissionData.meta.pagination}
          page={page}
          label="permissions"
          onPageChange={updateParams}
          extraParams={{ search: searchQuery }}
        />
      )}

    </>
  );
};

export default Permission;
