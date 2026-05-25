import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  deleteCategory,
  editCategory,
  getAllCategories,
  getAllCategoriesWithSubCategories,
} from "../../features/actions/category";
import { EditCategoryModal } from "../../components/Modal/Category/EditCategory";
import AddCategoryModal from "../../components/Modal/Category/AddCategory";
import DeleteModal from "../../components/Modal/Delete";
import { Link, useLocation } from "react-router-dom";
import { setActiveSubTab } from "../../features/slices/references";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Category = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const { state } = useLocation();
  const { categoryData, categoryLoading } = useSelector(
    (state) => state.category,
  );
  const data = categoryData?.data || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const flattenCategories = (list, parent = null) => {
    let result = [];

    list.forEach((item) => {
      result.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        parent_id: item.parent_id ?? parent,
        status: item.status,
        position: item.position,
      });

      const children =
        item.children_recursivee || item.children_recursive || [];

      if (children.length) {
        result = result.concat(flattenCategories(children, item.id));
      }
    });

    return result;
  };

  const handleDownloadExcel = async () => {
    try {
      const res = await dispatch(getAllCategoriesWithSubCategories()).unwrap();

      const tree = res?.data || [];

      if (!tree.length) return;

      const flat = flattenCategories(tree);

      const worksheet = XLSX.utils.json_to_sheet(flat);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "categories.xlsx");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!openEditModal && !openModal && !openDeleteModal) {
      dispatch(getAllCategories());
    }
  }, [openEditModal, openModal, openDeleteModal]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const sorted = [...data].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
      );
      setItems(sorted);
    }
  }, [data]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Categories</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Category
            </button>
            <button
              onClick={handleDownloadExcel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg"
            >
              Download Category Data
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3 w-[160px]">
                  Drag This Button To Order
                </th>
                <th className="text-left px-3 py-3 w-[160px]">Image</th>
                <th className="text-left px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[160px]">Slug</th>
                <th className="text-left px-3 py-3 w-[160px]">Status</th>
                <th className="text-center px-3 py-3 w-[170px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {categoryLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-6 h-4" }, // drag
                    { width: "w-20 h-16" }, // image
                    { width: "w-32 h-4" }, // name
                    { width: "w-32 h-4" }, // slug
                    { width: "w-24 h-4" }, // status
                  ]}
                  actionColumn
                  actionCount={3}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={6} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No categories found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ================= DATA ROWS ================= */
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={({ active, over }) => {
                    if (!over || active.id === over.id) return;

                    const oldIndex = items.findIndex((i) => i.id === active.id);
                    const newIndex = items.findIndex((i) => i.id === over.id);

                    const newItems = arrayMove(items, oldIndex, newIndex);
                    setItems(newItems);

                    // 🔥 only 2 items changed position
                    const movedItem = newItems[newIndex];
                    const replacedItem = newItems[oldIndex];

                    dispatch(
                      editCategory({
                        id: movedItem.id,
                        payload: { position: newIndex + 1 },
                      }),
                    );

                    dispatch(
                      editCategory({
                        id: replacedItem.id,
                        payload: { position: oldIndex + 1 },
                      }),
                    );
                  }}
                >
                  <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((item) => (
                      <SortableRow key={item.id} item={item}>
                        {({ listeners }) => (
                          <>
                            {/* DRAG HANDLE */}
                            <td className="text-center ps-5 px-3 py-5">
                              <span
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing text-gray-400"
                                title="Drag to reorder"
                              >
                                ☰
                              </span>
                            </td>

                            {/* IMAGE */}
                            <td className="px-3 py-5">
                              <img
                                className="rounded-xl size-20 object-cover"
                                src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}/${item.image}`}
                              />
                            </td>

                            {/* NAME */}
                            <td className="px-3 py-5">{item.name}</td>

                            {/* SLUG */}
                            <td className="px-3 py-5">{item.slug}</td>

                            {/* STATUS */}
                            <td className="px-3 py-5">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                  item.status === "active"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* ACTION */}
                            <td className="px-3 py-5">
                              <div className="flex justify-center gap-2">
                                <Link
                                  to={`${item?.id}`}
                                  className="
    p-2 px-3 flex items-center gap-2
    bg-indigo-100 text-indigo-500
    rounded-lg hover:bg-indigo-200
    whitespace-nowrap   /* ✅ force single line */
  "
                                >
                                  <FiEye />
                                  <span>Sub Categories</span>
                                </Link>

                                <button
                                  onClick={() => {
                                    setOpenEditModal(true);
                                    setSelected(item);
                                  }}
                                  className="p-2 px-3 bg-orange-100 text-orange-500 rounded-lg"
                                >
                                  <FiEdit2 />
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenDeleteModal(true);
                                    setSelected({ id: item.id });
                                  }}
                                  className="p-2 px-3 bg-red-100 text-red-500 rounded-lg"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </SortableRow>
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Categories"));
        }}
      />
      <EditCategoryModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        category={selected}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        isLoading={categoryLoading}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={() => {
          dispatch(deleteCategory(selected.id))
            .unwrap()
            .then(() => {
              setOpenDeleteModal(false);
            });
        }}
      />
    </>
  );
};

export default Category;

const SortableRow = ({ item, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border-b border-gray-100 hover:bg-gray-50"
    >
      {children({ listeners })}
    </tr>
  );
};
