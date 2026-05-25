import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addBulkProduct,
  addProduct,
  addZipImages,
  deleteImage,
  deleteProduct,
  editProduct,
  getAllProducts,
} from "../actions/product";

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
  productLoading: false,
  productData: [],
  bulkData: {},
  bulkZipResult: {},
};

// ---------------------------------------------------------------------------------------

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        state.productData = action.payload.data;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.productLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addProduct.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        toast("Product added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productLoading = false;

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
      .addCase(editProduct.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        toast("Product details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.productLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteProduct.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        toast("Product deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.productLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteImage.pending, (state) => {
        state.errorMessage = "";
        state.imageLoading = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.imageLoading = false;
        toast("Product image deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.imageLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addBulkProduct.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(addBulkProduct.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        state.bulkData = action.payload;
        toast("File Submitted Successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addBulkProduct.rejected, (state, action) => {
        state.productLoading = false;
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
      .addCase(addZipImages.pending, (state) => {
        state.errorMessage = "";
        state.productLoading = true;
      })
      .addCase(addZipImages.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.productLoading = false;
        state.bulkZipResult = action.payload;
        toast("Zip Submitted Successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addZipImages.rejected, (state, action) => {
        state.productLoading = false;
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
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;
export default productSlice.reducer;
