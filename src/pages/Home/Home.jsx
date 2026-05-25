import { useEffect, useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import { getHomeSections } from "../../features/actions/home";
import { EditHomeModal } from "../../components/Modal/Home/EditHome";
import { ViewHomeModal } from "../../components/Modal/Home/ViewHome";

const Home = () => {
  const dispatch = useDispatch();
  const { homeData, homeLoading } = useSelector((state) => state.home);

  const [selectedUser, setSelectedUser] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const users = homeData?.data || [];
  const hasData = Array.isArray(users) && users.length > 0;

  useEffect(() => {
    if (!openEditModal) {
      dispatch(getHomeSections());
    }
  }, [openEditModal]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Home Sections</h2>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[100px]">Section</th>
                <th className="text-left ps-5 px-3 py-3 w-[250px]">Title</th>
                <th className="text-left px-3 py-3 w-[80px]">Status</th>
                <th className="text-center px-3 py-3 w-[50px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {homeLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-24 h-4" }, // Name
                    { width: "w-24 h-4" }, // Email
                    { width: "w-24 h-4" }, // Mobile
                  ]}
                  actionColumn
                  actionCount={2}
                  actionWidth="w-12 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={7} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">No home found</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters or add a new home
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
                    <td className="ps-5 px-3 py-5 text-gray-700 ">
                      {item.section || "—"}
                    </td>
                    <td className="truncate cursor-pointer ps-5 px-3 py-5 text-brand-green">
                      <span title={item.title}> {item.title || "—"}</span>
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelectedUser(item);
                          }}
                          className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedUser(item);
                          }}
                          className="p-2 px-3 flex items-center gap-2  bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          <FiEdit2 />
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

      <ViewHomeModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        section={selectedUser}
      />

      <EditHomeModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        home={selectedUser}
      />
    </>
  );
};

export default Home;
