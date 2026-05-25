import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../components/TableSkeleton";
import { deleteProduct, getAllProducts } from "../../features/actions/product";
import { EditProductModal } from "../../components/Modal/Product/EditProduct";
import AddProductModal from "../../components/Modal/Product/AddProduct";
import DeleteModal from "../../components/Modal/Delete";
import { useLocation, useSearchParams } from "react-router-dom";
import { setActiveSubTab } from "../../features/slices/references";
import Pagination from "../../components/Pagination";
import { getAllAttributes } from "../../features/actions/attribute";
import { getAllCategoriesWithSubCategories } from "../../features/actions/category";
import { ViewProductModal } from "../../components/Modal/Product/ViewProduct";
import FilterSelect from "../../components/FilterSelect";

const Product = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { categoryTreeData } = useSelector((state) => state.category);
  const { attributeData } = useSelector((state) => state.attribute);
  const { productData, productLoading } = useSelector((state) => state.product);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "";

  const categories = categoryTreeData || [];
  const attributes = attributeData?.data || [];

  const data = productData?.data || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const [selected, setSelected] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const updateParams = ({ page, search, status, sort }) => {
    const params = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (status) params.status = status;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  useEffect(() => {
    if (!openEditModal && !openModal && !openDeleteModal) {
      dispatch(getAllProducts({ search: searchQuery, page, status, sort }));
    }
  }, [
    openEditModal,
    openModal,
    openDeleteModal,
    page,
    searchQuery,
    status,
    sort,
  ]);

  useEffect(() => {
    if (state?.openModal) {
      setOpenModal(true);
    }
  }, [state]);

  useEffect(() => {
    dispatch(getAllAttributes());
    dispatch(getAllCategoriesWithSubCategories());
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Products</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#79BF28] hover:bg-[#6dac24] text-white text-sm px-4 py-2 rounded-lg"
            >
              Add New Product
            </button>
            <FilterSelect
              label="Sort By"
              value={sort || "All"}
              options={[
                { label: "Low To High", value: "price_asc" },
                { label: "High To Low", value: "price_desc" },
                { label: "New", value: "new" },
                { label: "Featured", value: "featured" },
                { label: "New & Featured", value: "new_featured" },
              ]}
              onChange={(val) =>
                updateParams({
                  sort: val,
                  status,
                  page: 1,
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
                <th className="text-left ps-5 px-3 py-3 w-[160px]">
                  Main Image
                </th>
                <th className="text-left px-3 py-3 w-[160px]">Name</th>
                <th className="text-left px-3 py-3 w-[160px]">Type</th>
                <th className="text-left px-3 py-3 w-[160px]">Sale Price</th>
                <th className="text-center px-3 py-3 w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {productLoading ? (
                /* ================= SKELETON ================= */
                <TableSkeleton
                  rows={5}
                  columns={[
                    { width: "w-32 h-26" },
                    { width: "w-32 h-4" },
                    { width: "w-20 h-4" },
                    { width: "w-16 h-4" },
                  ]}
                  actionColumn
                  actionCount={3}
                  actionWidth="w-8 h-8"
                />
              ) : !hasData ? (
                /* ================= EMPTY STATE ================= */
                <tr>
                  <td colSpan={5} className="py-28">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>

                      <p className="text-gray-600 font-medium">
                        No products found
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
                    <td className="ps-5 px-3 py-5 ">
                      {item.images
                        .filter((img) => img.is_primary)
                        .map((img) => (
                          <img
                            src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}/${img.image}`}
                            alt="Product"
                            className="w-32 rounded-3xl h-32 object-contain"
                          />
                        ))}
                    </td>
                    <td className=" px-3 py-5 text-gray-700">
                      {item.name || "—"}
                    </td>
                    <td className=" px-3 py-5 text-gray-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-600
                        `}
                      >
                        {item.type || "—"}
                      </span>
                    </td>
                    <td className="ps-5 px-3 py-5 text-gray-700">
                      {item.sale_price || "—"}
                    </td>

                    <td className="px-3 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setOpenViewModal(true);
                            setSelected(item);
                          }}
                          className="p-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          <FiEye />
                        </button>
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
      {!productLoading && hasData && productData && (
        <Pagination
          data={productData}
          page={page}
          label="products"
          onPageChange={updateParams}
          extraParams={{ search: searchQuery, sort, status }}
        />
      )}

      <AddProductModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          dispatch(setActiveSubTab("All Products"));
        }}
        categories={categories}
        attributes={attributes}
      />
      <ViewProductModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
        }}
        product={selected}
      />
      <EditProductModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={selected}
        categories={categories}
        attributes={attributes}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        isLoading={productLoading}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => {
          dispatch(deleteProduct(selected.id))
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

export default Product;
