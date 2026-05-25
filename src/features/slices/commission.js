import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  editCommission,
  editReferralCommission,
  getAllCommissions,
  getReferralCommission,
} from "../actions/commission";

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
  commissionLoading: false,
  referralLoading: false,
  commissionData: [],
  referralData: [],
};

// ---------------------------------------------------------------------------------------

const commissionSlice = createSlice({
  name: "commissionSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReferralCommission.pending, (state) => {
        state.errorMessage = "";
        state.referralLoading = true;
      })
      .addCase(getReferralCommission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.referralLoading = false;
        state.referralData = action.payload.data;
      })
      .addCase(getReferralCommission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.referralLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllCommissions.pending, (state) => {
        state.errorMessage = "";
        state.commissionLoading = true;
      })
      .addCase(getAllCommissions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.commissionLoading = false;
        state.commissionData = action.payload.data;
      })
      .addCase(getAllCommissions.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.commissionLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editReferralCommission.pending, (state) => {
        state.errorMessage = "";
        state.referralLoading = true;
      })
      .addCase(editReferralCommission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.referralLoading = false;
        toast("Referral commission value updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editReferralCommission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.referralLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editCommission.pending, (state) => {
        state.errorMessage = "";
        state.commissionLoading = true;
      })
      .addCase(editCommission.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.commissionLoading = false;
        toast("Commission value updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCommission.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.commissionLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = commissionSlice.actions;
export default commissionSlice.reducer;
