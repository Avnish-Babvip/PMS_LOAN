import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { getAllRoles } from "../../features/actions/role";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllAgents } from "../../features/actions/agent";
import AddAgentModal from "../../components/Modal/Agent/AddAgent";
import EditAgentModal from "../../components/Modal/Agent/EditAgent";

const Agent = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { agentData, agentLoading } = useSelector((state) => state.agent);
  const { permissions } = useSelector(
    (state) => state.authentication.adminData.admin,
  );
  const canCreateAgent = permissions?.includes("create agents");
  const canEditAgent = permissions?.includes("edit agents");
  const canShowActions = canEditAgent || canCreateAgent;
  const [selectedUser, setSelectedUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const role_id = searchParams.get("role_id") || "";
  const users = agentData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const roles = [
    { label: "verifier", value: "verifier" },
    { label: "boe_1", value: "boe_1" },
    { label: "boe_2", value: "boe_2" },
    { label: "boe_3", value: "boe_3" },
    { label: "initiator_1", value: "initiator_1" },
    { label: "initiator_2", value: "initiator_2" },
  ];

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
        getAllAgents({
          search: searchQuery,
          page,
          status,
          role_id,
        }),
      );
    }
  }, [openModal, openEditModal, page, searchQuery, status, role_id]);

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
          <h2 className="font-semibold text-gray-800">All Agents</h2>

          <div className="flex gap-3">
            {canCreateAgent && (
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
                  Add New Agent
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </button>
            )}

            <FilterSelect
              label="Status"
              value={status || "All"}
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
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
                <th className="text-left px-3 py-3 w-[100px]">Role</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                {canShowActions && (
                  <th className="text-center px-3 py-3 w-[155px]">Action</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {agentLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-4" }, // Name
                    { width: "w-32 h-4" }, // Username
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-24 h-4" }, // Mobile
                    { width: "w-20 h-4" }, // Status
                  ]}
                  actionColumn={canShowActions}
                  actionCount={1}
                  actionWidth="w-32 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={canShowActions ? 5 : 4} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No agent found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new agent
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
                    <td className="ps-5 px-3 py-5 text-gray-700 whitespace-normal break-all">
                      {item.name || "—"}
                    </td>

                    <td className="px-3 truncate cursor-pointer py-5 text-gray-700 whitespace-normal break-all">
                      <span title={item.username}>{item.username || "—"}</span>
                    </td>

                    <td className="px-3 cursor-pointer py-5 text-gray-700 whitespace-normal break-all">
                      <span title={item.email}>{item.email || "—"}</span>
                    </td>

                    <td className="px-3 py-5 capitalize text-gray-700 whitespace-nowrap ">
                      {item?.role || "—"}
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {canShowActions && (
                      <td className="px-3 py-5">
                        <div className="flex justify-center gap-2">
                          {canEditAgent && (
                            <button
                              onClick={() => {
                                setOpenEditModal(true);
                                setSelectedUser(item);
                              }}
                              className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                            >
                              <FiEdit2 />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!agentLoading && hasData && agentData?.meta?.pagination && (
          <Pagination
            data={agentData?.meta?.pagination}
            page={page}
            label="agents"
            onPageChange={updateParams}
            extraParams={{ search: searchQuery, status, role_id }}
          />
        )}
      </div>
      {canCreateAgent && (
        <AddAgentModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            dispatch(setActiveSubTab("All Agents"));
            navigate(".", {
              replace: true,
              state: null,
            });
          }}
          roles={roles}
        />
      )}
      {canEditAgent && (
        <EditAgentModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          user={selectedUser}
          roles={roles}
        />
      )}
    </>
  );
};

export default Agent;
