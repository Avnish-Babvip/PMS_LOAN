import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
  getAllCategoriesWithSubCategories,
  getAllSubCategories,
} from "../actions/category";

const formattedDate = new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const initialState = {
  errorMessage: "",
  categoryLoading: false,
  categoryTreeLoading: false,
  categoryData: [],
  categoryTreeData: [],
  subCategoryData: {},
};

// ---------------------------------------------------------------------------------------

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.errorMessage = "";
        state.categoryLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryLoading = false;
        state.categoryData = action.payload.data;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.categoryLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllSubCategories.pending, (state) => {
        state.errorMessage = "";
        state.categoryLoading = true;
      })
      .addCase(getAllSubCategories.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryLoading = false;
        state.subCategoryData = action.payload.data;
      })
      .addCase(getAllSubCategories.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.categoryLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllCategoriesWithSubCategories.pending, (state) => {
        state.errorMessage = "";
        state.categoryTreeLoading = true;
      })
      .addCase(getAllCategoriesWithSubCategories.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryTreeLoading = false;
        state.categoryTreeData = action.payload.data;
      })
      .addCase(getAllCategoriesWithSubCategories.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.categoryTreeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addCategory.pending, (state) => {
        state.errorMessage = "";
        state.categoryLoading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryLoading = false;
        toast("Category added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.categoryLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg, {
                description: formattedDate,
              });
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message, {
            description: formattedDate,
          });
        }
      })
      .addCase(editCategory.pending, (state) => {
        state.errorMessage = "";
        state.categoryLoading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryLoading = false;
        toast("Category details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.categoryLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteCategory.pending, (state) => {
        state.errorMessage = "";
        state.categoryLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.categoryLoading = false;
        toast("Category deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.categoryLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = categorySlice.actions;
export default categorySlice.reducer;
