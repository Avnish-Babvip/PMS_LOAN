import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addRole,
  addRoleWithPermissions,
  deleteRole,
  editRole,
  getAllRoles,
  getRoleWithPermissions,
} from "../actions/role";

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
  roleLoading: false,
  roleData: [],
  rolePermissionData: {},
};

// ---------------------------------------------------------------------------------------

const roleSlice = createSlice({
  name: "roleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        state.roleData = action.payload.data;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.roleLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addRole.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        toast("Role added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addRole.rejected, (state, action) => {
        state.roleLoading = false;

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
      .addCase(editRole.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        toast("Role details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editRole.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.roleLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteRole.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        toast("Role deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.roleLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRoleWithPermissions.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(getRoleWithPermissions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        state.rolePermissionData = action.payload.data;
      })
      .addCase(getRoleWithPermissions.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.roleLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addRoleWithPermissions.pending, (state) => {
        state.errorMessage = "";
        state.roleLoading = true;
      })
      .addCase(addRoleWithPermissions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.roleLoading = false;
        toast("Role permission added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addRoleWithPermissions.rejected, (state, action) => {
        state.roleLoading = false;

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
export const {} = roleSlice.actions;
export default roleSlice.reducer;
