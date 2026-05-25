import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  changePassword,
  forgotPassword,
  getCompanyInfo,
  resetForgotPassword,
  updateAdminProfile,
  updateCompanyInfo,
  verifyAdmin,
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
  isCompanyLoading: false,
  isCredentials: false,
  isAdminLoggedIn: false,
  adminData: {},
  companyData: {},
  errorMessage: "",
  isPasswordChanged: false,
  loginCredentials: {
    email: "",
    password: "",
  },
};

// ---------------------------------------------------------------------------------------

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    resetUserState: (state) => {
      ((state.isLoading = false),
        (state.isCredentials = false),
        (state.isPasswordChanged = false),
        (state.isAdminLoggedIn = false),
        (state.errorMessage = ""),
        (state.loginCredentials = {
          email: "",
          password: "",
        }));
    },
    logoutFromInterceptor: (state) => {
      ((state.isLoading = false), (state.isAdminLoggedIn = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.isCredentials = false;
        state.errorMessage = "";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isCredentials = true;
        state.adminData = action.payload;
        // ✅ SAVE EMAIL + PASSWORD
        state.loginCredentials.email = action.meta.arg.login;
        state.loginCredentials.password = action.meta.arg.password;
        toast("OTP sent to registered email", {
          description: formattedDate,
        });
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isCredentials = false;
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to login API.";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(verifyAdmin.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(verifyAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isAdminLoggedIn = true;
        state.isCredentials = false;
        state.adminData = action.payload.data;
        toast("Admin successfully logged in.", {
          description: formattedDate,
        });
      })
      .addCase(verifyAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed.";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast("Password reset link sent to email.", {
          description: formattedDate,
        });
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed.";
        toast(action.payload, {
          description: formattedDate,
        });
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
        toast("Password changed successfully.", {
          description: formattedDate,
        });
      })
      .addCase(resetForgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isPasswordChanged = false;
        state.errorMessage = action.payload || "Failed.";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(adminLogout.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.isAdminLoggedIn = false;
        state.adminData = {};
        toast("Log out Successful.", {
          description: formattedDate,
        });
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed to logout API.";
        toast("Logout failed. Please try again", {
          description: formattedDate,
        });
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.adminData = action.payload.data;
        toast("Profile updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateCompanyInfo.pending, (state) => {
        state.isCompanyLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.isCompanyLoading = false;
        state.errorMessage = "";
        toast("Company updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateCompanyInfo.rejected, (state, action) => {
        state.isCompanyLoading = false;
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast("Password updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getCompanyInfo.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getCompanyInfo.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.companyData = action.payload.data;
      })
      .addCase(getCompanyInfo.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetUserState, logoutFromInterceptor } = authSlice.actions;
export default authSlice.reducer;
