import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  editRiderKycStatus,
  editRiderStatus,
  getAllRiderKyc,
  getAllRiderReferrals,
  getAllRiders,
} from "../actions/rider";

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
  riderLoading: false,
  riderData: {},
  referralData: {},
  kycData: {},
};

// ---------------------------------------------------------------------------------------

const riderSlice = createSlice({
  name: "riderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRiders.pending, (state) => {
        state.errorMessage = "";
        state.riderLoading = true;
      })
      .addCase(getAllRiders.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.riderLoading = false;
        state.riderData = action.payload.data;
      })
      .addCase(getAllRiders.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.riderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllRiderReferrals.pending, (state) => {
        state.errorMessage = "";
        state.riderLoading = true;
      })
      .addCase(getAllRiderReferrals.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.riderLoading = false;
        state.referralData = action.payload;
      })
      .addCase(getAllRiderReferrals.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.riderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllRiderKyc.pending, (state) => {
        state.errorMessage = "";
        state.riderLoading = true;
      })
      .addCase(getAllRiderKyc.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.riderLoading = false;
        state.kycData = action.payload.data;
      })
      .addCase(getAllRiderKyc.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.riderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editRiderStatus.pending, (state) => {
        state.errorMessage = "";
        state.riderLoading = true;
      })
      .addCase(editRiderStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.riderLoading = false;
        toast("Rider status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editRiderStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.riderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editRiderKycStatus.pending, (state) => {
        state.errorMessage = "";
        state.riderLoading = true;
      })
      .addCase(editRiderKycStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.riderLoading = false;
        toast("Rider kyc status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editRiderKycStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.riderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = riderSlice.actions;
export default riderSlice.reducer;
