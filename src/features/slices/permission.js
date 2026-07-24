import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addPermission,
  deletePermission,
  editPermission,
  getAllPermissions,
} from "../actions/permission";

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
  permissionLoading: false,
  permissionData: [],
};

// ---------------------------------------------------------------------------------------

const permissionSlice = createSlice({
  name: "permissionSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPermissions.pending, (state) => {
        state.errorMessage = "";
        state.permissionLoading = true;
      })
      .addCase(getAllPermissions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.permissionLoading = false;
        state.permissionData = action.payload;
      })
      .addCase(getAllPermissions.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.permissionLoading = false;
        toast.error(action.payload);
      })
      .addCase(addPermission.pending, (state) => {
        state.errorMessage = "";
        state.permissionLoading = true;
      })
      .addCase(addPermission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.permissionLoading = false;
        toast.success("Permission added successfully.");
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.permissionLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
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
      .addCase(editPermission.pending, (state) => {
        state.errorMessage = "";
        state.permissionLoading = true;
      })
      .addCase(editPermission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.permissionLoading = false;
        toast.success("Permission details updated successfully.");
      })
      .addCase(editPermission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.permissionLoading = false;
        toast.error(action.payload);
      })
      .addCase(deletePermission.pending, (state) => {
        state.errorMessage = "";
        state.permissionLoading = true;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.permissionLoading = false;
        toast.success("Permission deleted successfully.");
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.permissionLoading = false;
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = permissionSlice.actions;
export default permissionSlice.reducer;
