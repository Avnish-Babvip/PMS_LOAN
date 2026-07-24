import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  changePassword,
  forgotPassword,
  resetForgotPassword,
  updateAdminProfile,
} from "../actions/authentication";

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
  isLoading: false,
  isAdminLoggedIn: false,
  adminData: {},
  errorMessage: "",
  isPasswordChanged: false,
};

// ---------------------------------------------------------------------------------------

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    resetUserState: (state) => {
      ((state.isLoading = false),
        (state.isPasswordChanged = false),
        (state.isAdminLoggedIn = false),
        (state.errorMessage = ""));
    },
    logoutFromInterceptor: (state) => {
      ((state.isLoading = false), (state.isAdminLoggedIn = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isAdminLoggedIn = true;
        state.adminData = action.payload.data;
        toast.success("Admin successfully logged in.");
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to login API.";
        toast.error(action.payload);
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast.success("Password reset link sent to email.");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed.";
        toast.error(action.payload);
      })
      .addCase(resetForgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isPasswordChanged = false;
      })
      .addCase(resetForgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isPasswordChanged = true;
        toast.success("Password changed successfully.");
      })
      .addCase(resetForgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isPasswordChanged = false;
        state.errorMessage = action.payload || "Failed.";
        toast.error(action.payload);
      })
      .addCase(adminLogout.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.isAdminLoggedIn = false;
        state.adminData = {};
        toast.success("Log out Successful.");
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed to logout API.";
        toast.error("Logout failed. Please try again");
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.adminData = action.payload.data;
        toast.success("Profile updated successfully.");
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      })

      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast.success("Password updated successfully.");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetUserState, logoutFromInterceptor } = authSlice.actions;
export default authSlice.reducer;
