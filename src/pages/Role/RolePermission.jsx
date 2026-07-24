import { useEffect, useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import { getRoleWithPermissions } from "../../features/actions/role";
import { useParams } from "react-router-dom";

const RolePermission = () => {
  const dispatch = useDispatch();
  const { id, role } = useParams();
  const { rolePermissionData, roleLoading } = useSelector(
    (state) => state.role,
  );
  const data = rolePermissionData?.permissions || [];
  const hasData = Array.isArray(data) && data.length > 0;

  useEffect(() => {
    dispatch(getRoleWithPermissions(id));
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            All Permissions : {role} (Role)
          </h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5  px-3 py-3 w-[160px]">Name</th>
                {/* <th className="text-center px-3 py-3 w-[120px]">Action</th> */}
              </tr>
            </thead>

            <tbody className="divide-y">
              {roleLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[{ width: "w-32 h-4" }]}
                  actionColumn={false}
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
    </>
  );
};

export default RolePermission;
