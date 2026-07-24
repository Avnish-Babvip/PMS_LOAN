import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addFormField,
  deleteFormField,
  editBasicDetails,
  editFormField,
  getAllForms,
  getFormDetails,
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
  fieldLoading: false,
  basicLoading: false,
  formData: {},
  formDetailData: {},
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
        toast.error(action.payload);
      })
      .addCase(getFormDetails.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getFormDetails.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formDetailData = action.payload.data;
      })
      .addCase(getFormDetails.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      })
      .addCase(uploadFormSheet.pending, (state) => {
        state.errorMessage = "";
        state.formLoading = true;
      })
      .addCase(uploadFormSheet.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formLoading = false;
        state.formDetailData = action.payload.data;
        toast.success("File uploaded successfully.");
      })
      .addCase(uploadFormSheet.rejected, (state, action) => {
        state.formLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(editBasicDetails.pending, (state) => {
        state.errorMessage = "";
        state.basicLoading = true;
      })
      .addCase(editBasicDetails.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.basicLoading = false;
        state.formDetailData = action.payload.data;
        toast.success("Basic details updated successfully.");
      })
      .addCase(editBasicDetails.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.basicLoading = false;
        toast.error(action.payload);
      })
      .addCase(editFormField.pending, (state) => {
        state.errorMessage = "";
        state.fieldLoading = true;
      })
      .addCase(editFormField.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.fieldLoading = false;
        toast.success("Field details updated successfully.");
      })
      .addCase(editFormField.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.fieldLoading = false;
        toast.error(action.payload);
      })
      .addCase(addFormField.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(addFormField.fulfilled, (state, action) => {
        state.errorMessage = "";
        toast.success("Field added successfully.");
      })
      .addCase(addFormField.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      })
      .addCase(deleteFormField.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(deleteFormField.fulfilled, (state, action) => {
        state.errorMessage = "";
        toast.success("Field deleted successfully.");
      })
      .addCase(deleteFormField.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = formSlice.actions;
export default formSlice.reducer;
