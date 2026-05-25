import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getRiderCommission,
  getRiderDashboard,
  getRiderProfile,
  getRiderReferralCode,
  getRiderReferralHistory,
  submitKyc,
  updateRiderProfile,
} from "../../actions/rider/user";

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
  commissionData: {},
  referralData: {},
  referralHistoryData: {},
  profileData: {},
  profileLoading: false,
  dashboardData: {},
  kycLoading: false,
};

// ---------------------------------------------------------------------------------------

const rider_userSlice = createSlice({
  name: "rider_userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRiderReferralHistory.pending, (state) => {
        state.errorMessage = "";
        state.profileLoading = true;
      })
      .addCase(getRiderReferralHistory.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.profileLoading = false;
        state.referralHistoryData = action.payload.data;
      })
      .addCase(getRiderReferralHistory.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.profileLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRiderCommission.pending, (state) => {
        state.errorMessage = "";
        state.profileLoading = true;
      })
      .addCase(getRiderCommission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.profileLoading = false;
        state.commissionData = action.payload.data;
      })
      .addCase(getRiderCommission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.profileLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRiderReferralCode.pending, (state) => {
        state.errorMessage = "";
        state.profileLoading = true;
      })
      .addCase(getRiderReferralCode.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.profileLoading = false;
        state.referralData = action.payload.data;
      })
      .addCase(getRiderReferralCode.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.profileLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRiderProfile.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getRiderProfile.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.profileData = action.payload.data;
      })
      .addCase(getRiderProfile.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRiderDashboard.pending, (state) => {
        state.profileLoading = true;
        state.errorMessage = "";
      })
      .addCase(getRiderDashboard.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.errorMessage = "";
        state.dashboardData = action.payload.data;
      })
      .addCase(getRiderDashboard.rejected, (state, action) => {
        state.profileLoading = false;
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateRiderProfile.pending, (state) => {
        state.errorMessage = "";
        state.profileLoading = true;
      })
      .addCase(updateRiderProfile.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.profileLoading = false;
        toast("Details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateRiderProfile.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.profileLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(submitKyc.pending, (state) => {
        state.errorMessage = "";
        state.kycLoading = true;
      })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.kycLoading = false;
        toast("Kyc submitted.", {
          description: formattedDate,
        });
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.kycLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = rider_userSlice.actions;
export default rider_userSlice.reducer;
