import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  editForm,
  getAllForms,
  uploadFormSheet,
} from "../actions/form";

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
  formLoading: false,
  formData: {},
};

// ---------------------------------------------------------------------------------------

const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllForms.pending, (state) => {
        state.errorMessage = "";
        state.formLoading = true;
      })
      .addCase(getAllForms.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formLoading = false;
        state.formData = action.payload;
      })
      .addCase(getAllForms.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.formLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(uploadFormSheet.pending, (state) => {
        state.errorMessage = "";
        state.formLoading = true;
      })
      .addCase(uploadFormSheet.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formLoading = false;
        toast("File uploaded successfully.", {
          description: formattedDate,
        });
      })
      .addCase(uploadFormSheet.rejected, (state, action) => {
        state.formLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload.errors).forEach((messages) => {
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
      .addCase(editForm.pending, (state) => {
        state.errorMessage = "";
        state.formLoading = true;
      })
      .addCase(editForm.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formLoading = false;
        toast("Admin user updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editForm.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.formLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = formSlice.actions;
export default formSlice.reducer;
