import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiFileText, FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";
import FilterSelect from "../../components/FilterSelect";
import { setActiveSubTab } from "../../features/slices/references";
import { getAllBanks } from "../../features/actions/bank";
import EditBankModal from "../../components/Modal/Bank/EditBank";
import { exportCases, getAllCases } from "../../features/actions/case";
import AddCaseModal from "../../components/Modal/Case/AddCase";
import EditCaseModal from "../../components/Modal/Case/EditCase";
import { getAllForms } from "../../features/actions/form";
import EditStatusModal from "../../components/Modal/Case/EditStatus";
import { getAllTimelines } from "../../features/actions/timeline";
import { getAllAgents } from "../../features/actions/agent";

const AgentTimeline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { timelineData, timelineLoading } = useSelector(
    (state) => state.timeline,
  );
  const { agentData } = useSelector((state) => state.agent);

  const agents = Array.isArray(agentData?.data)
    ? agentData?.data?.map((r) => ({
        label: `${r.name} (${r.role})`,
        value: r.id,
      }))
    : [];

  const [selectedUser, setSelectedUser] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const agent_id = searchParams.get("agent_id") || "";
  const form_id = searchParams.get("form_id") || "";
  const date = searchParams.get("date") || "";

  const users = timelineData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  const updateParams = ({ page, search, agent_id, date }) => {
    const params = {};

    if (page) params.page = page;
    if (search) params.search = search;
    if (agent_id) params.agent_id = agent_id;
    if (date) params.date = date;

    setSearchParams(params);
  };

  useEffect(() => {
    dispatch(
      getAllTimelines({
        page,
        agent_id,
        search,
        date,
      }),
    );
  }, [page, search, agent_id, date]);

  useEffect(() => {
    dispatch(
      getAllAgents({
        per_page: 1000,
      }),
    );
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-10 px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Timelines</h2>

          <div className="flex flex-wrap items-end gap-3">
            <div className="mt-5">
              <FilterSelect
                label="Agent"
                value={agent_id}
                options={agents}
                onChange={(val) =>
                  updateParams({
                    agent_id: val,
                    form_id: "",
                    page: 1,
                    search,
                    date,
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-500">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  updateParams({
                    page: 1,
                    agent_id,
                    search,
                    date: e.target.value,
                  })
                }
                className="h-[46px] w-[160px] rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 focus:border-[#79BF28] focus:ring-2 focus:ring-[#79BF28]/20"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[90px]">
                  Session No.
                </th>
                <th className="text-left px-3 py-3 w-[180px]">Agent</th>
                <th className="text-left px-3 py-3 w-[130px]">Date</th>
                <th className="text-left px-3 py-3 w-[140px]">Start Time</th>
                <th className="text-left px-3 py-3 w-[140px]">End Time</th>
                <th className="text-center px-3 py-3 w-[120px]">Visits</th>
                <th className="text-center px-3 py-3 w-[140px]">Distance</th>
                <th className="text-center px-3 py-3 w-[120px]">Status</th>
                <th className="text-center px-3 py-3 w-[150px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {timelineLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-16 h-4" },
                    { width: "w-28 h-4" },
                    { width: "w-24 h-4" },
                    { width: "w-28 h-4" },
                    { width: "w-28 h-4" },
                    { width: "w-16 h-4" },
                    { width: "w-20 h-4" },
                    { width: "w-20 h-4" },
                  ]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-24 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={9} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No timeline found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters
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
                    <td className="ps-5 px-3 py-5 font-medium text-gray-700">
                      {item.session_number}
                    </td>

                    <td className="px-3 py-5">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.agent?.name || "—"}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID : {item.agent?.id || "--"}
                        </p>
                      </div>
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.date || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.start_time || "—"}
                    </td>

                    <td className="px-3 py-5 text-gray-700">
                      {item.end_time || (
                        <span className="text-gray-400 italic">Running</span>
                      )}
                    </td>

                    <td className="px-3 py-5 text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {item.number_of_visits}
                      </span>
                    </td>

                    <td className="px-3 py-5 text-center">
                      <span className="font-semibold text-gray-700">
                        {Number(item.total_distance_km).toFixed(2)} km
                      </span>
                    </td>

                    <td className="px-3 py-5 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setSelectedUser(item);
                            setOpenEditModal(true);
                          }}
                          className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100 hover:shadow-sm"
                        >
                          <FiEye className="text-base" />
                          View
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
        {!timelineLoading && hasData && timelineData?.meta?.pagination && (
          <Pagination
            data={timelineData?.meta?.pagination}
            page={page}
            label="cases"
            onPageChange={updateParams}
            extraParams={{ status }}
          />
        )}
      </div>

      <EditStatusModal
        isOpen={openStatusModal}
        onClose={() => {
          setOpenStatusModal(false);
        }}
        user={selectedUser}
        status={[
          { label: "In Progress", value: "in_progress" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ]}
      />
    </>
  );
};

export default AgentTimeline;
