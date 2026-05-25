import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import {
  deleteAttribute,
  getAllAttributes,
} from "../../features/actions/attribute";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { EditAttributeModal } from "../../components/Modal/Attribute/EditAttribute";
import AddAttributeModal from "../../components/Modal/Attribute/AddAttribute";
import DeleteModal from "../../components/Modal/Delete";
import { Link, useLocation } from "react-router-dom";
import { setActiveSubTab } from "../../features/slices/references";

const Attribute = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { attributeData, attributeLoading } = useSelector(
    (state) => state.attribute,
  );
  const data = attributeData?.data || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDownloadExcel = () => {
    if (!data?.length) return;

    let rows = [];

    data.forEach((attr) => {
      if (attr.values?.length) {
        attr.values.forEach((val) => {
          rows.push({
            attribute_id: attr.id,
            attribute_name: attr.name,
            value_id: val.id,
            value_name: val.value,
          });
        });
      } else {
        // attribute without values
        rows.push({
          attribute_id: attr.id,
          attribute_name: attr.name,
          value_id: "",
          value_name: "",
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attributes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "attributes.xlsx");
  };

  useEffect(() => {
    if (!openEditModal && !openModal && !openDeleteModal) {
      dispatch(getAllAttributes());
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
          <h2 className="font-semibold text-gray-800">All Attributes</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Attribute
            </button>

            <button
              onClick={handleDownloadExcel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg"
            >
              Download Attribute & Value Data
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[160px]">Status</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {attributeLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[{ width: "w-32 h-4" }, { width: "w-32 h-4" }]}
                  actionColumn
                  actionCount={3}
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
                        No attributes found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Add attribute
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
                        <Link
                          to={`${item?.id}`}
                          className="p-2 px-3 flex items-center gap-2 bg-indigo-100 text-indigo-500 rounded-lg hover:bg-indigo-200"
                        >
                          <FiEye />
                          <span>View Values</span>
                        </Link>
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

      <AddAttributeModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Attributes"));
        }}
      />
      <EditAttributeModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        attribute={selected}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Attribute"
        isLoading={attributeLoading}
        message="Are you sure you want to delete this attribute? This action cannot be undone."
        onConfirm={() => {
          dispatch(deleteAttribute(selected.id))
            .unwrap()
            .then(() => {
              setOpenDeleteModal(false);
            });
        }}
      />
    </>
  );
};

export default Attribute;
