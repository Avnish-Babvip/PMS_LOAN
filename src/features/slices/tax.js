import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addTax, editTax, getAllTaxes } from "../actions/tax";

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
  taxLoading: false,
  taxData: [],
};

// ---------------------------------------------------------------------------------------

const taxSlice = createSlice({
  name: "taxSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTaxes.pending, (state) => {
        state.errorMessage = "";
        state.taxLoading = true;
      })
      .addCase(getAllTaxes.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.taxLoading = false;
        state.taxData = action.payload;
      })
      .addCase(getAllTaxes.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.taxLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addTax.pending, (state) => {
        state.errorMessage = "";
        state.taxLoading = true;
      })
      .addCase(addTax.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.taxLoading = false;
        toast("Tax added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addTax.rejected, (state, action) => {
        state.taxLoading = false;
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
      .addCase(editTax.pending, (state) => {
        state.errorMessage = "";
        state.taxLoading = true;
      })
      .addCase(editTax.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.taxLoading = false;
        toast("Tax updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editTax.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.taxLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = taxSlice.actions;
export default taxSlice.reducer;
