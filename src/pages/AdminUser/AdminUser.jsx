import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllAdminUsers } from "../../features/actions/adminuser";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import AddAdminUserModal from "../../components/Modal/AdminUser/AddAdminUser";
import FilterSelect from "../../components/FilterSelect";
import { getAllRoles } from "../../features/actions/role";
import { EditAdminUserStatusModal } from "../../components/Modal/AdminUser/EditAdminUserStatus";
import { setActiveSubTab } from "../../features/slices/references";

const AdminUser = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { adminUserData, adminUserLoading } = useSelector(
    (state) => state.adminUser,
  );
  const { roleData } = useSelector((state) => state.role);

  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const role_id = searchParams.get("role_id") || "";

  const users = adminUserData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const roles =
    Array.isArray(roleData) &&
    roleData?.map((r) => ({
      label: r.name,
      value: r.id,
    }));

  const roleMap = useMemo(() => {
    return roles.reduce((acc, role) => {
      acc[role.value] = role.label;
      return acc;
    }, {});
  }, [roles]);

  const updateParams = ({ page, search, status, role_id }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status !== undefined && status !== "") params.status = status;
    if (role_id !== undefined && role_id !== "") params.role_id = role_id;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal) {
      dispatch(
        getAllAdminUsers({
          search: searchQuery,
          page,
          status,
          role_id,
        }),
      );
    }
  }, [openModal, openEditModal, page, searchQuery, status, role_id]);

  useEffect(() => {
    dispatch(getAllRoles());
  }, []);

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
          <h2 className="font-semibold text-gray-800">All Admin Users</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New User
            </button>

            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              onChange={(val) =>
                updateParams({
                  status: val,
                  page: 1,
                  role_id,
                  search: searchQuery,
                })
              }
            />

            <FilterSelect
              label="Role"
              value={role_id} // ← number or ""
              options={roles}
              onChange={(val) =>
                updateParams({
                  role_id: val, // ← still value (1 / 2)
                  page: 1,
                  status,
                  search: searchQuery,
                })
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[150px]">Name</th>
                <th className="text-left px-3 py-3 w-[150px]">Username</th>
                <th className="text-left px-3 py-3 w-[200px]">Email</th>
                <th className="text-left px-3 py-3 w-[100px]">Mobile</th>
                <th className="text-left px-3 py-3 w-[100px]">Role</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                <th className="text-center px-3 py-3 w-[155px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {adminUserLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Username
                    { width: "w-56 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-32 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={7} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No admin users found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new admin user
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                users.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>

                    <td className="px-3 truncate cursor-pointer py-5 text-gray-700">
                      <span title={item.username}>{item.username || "—"}</span>
                    </td>

                    <td className="px-3 cursor-pointer py-5 text-gray-700 truncate max-w-[260px]">
                      <span title={item.email}>{item.email || "—"}</span>
                    </td>

                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {item.mobile || "—"}
                    </td>
                    <td className="px-3 py-5 text-gray-700 whitespace-nowrap">
                      {roleMap[item.role_id] ?? "-"}
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status || "inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        {/* <button className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          <FiEye />
                        </button> */}
                        <button
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedUser({
                              id: item?.id,
                              status: item?.status,
                              role_id: item?.role_id,
                            });
                          }}
                          className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          <FiEdit2 />
                          <span>Role & Status</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!adminUserLoading && hasData && adminUserData?.meta && (
          <Pagination
            data={adminUserData.meta}
            page={page}
            label="admin users"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status, role_id }}
          />
        )}
      </div>
      <AddAdminUserModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All User"));
        }}
        roles={roles}
      />
      <EditAdminUserStatusModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
        roles={roles}
      />
    </>
  );
};

export default AdminUser;
