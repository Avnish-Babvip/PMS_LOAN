import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getRiderWallet,
  getRiderWalletHistory,
} from "../../actions/rider/wallet";

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
  walletData: {},
  walletHistoryData: {},
  walletLoading: false,
};

// ---------------------------------------------------------------------------------------

const rider_userSlice = createSlice({
  name: "rider_userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRiderWallet.pending, (state) => {
        state.errorMessage = "";
        state.walletLoading = true;
      })
      .addCase(getRiderWallet.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.walletLoading = false;
        state.walletData = action.payload.data;
      })
      .addCase(getRiderWallet.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.walletLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getRiderWalletHistory.pending, (state) => {
        state.errorMessage = "";
        state.walletLoading = true;
      })
      .addCase(getRiderWalletHistory.fulfilled, (state, action) => {
        state.walletLoading = false;
        state.errorMessage = "";
        state.walletHistoryData = action.payload.data;
      })
      .addCase(getRiderWalletHistory.rejected, (state, action) => {
        state.walletLoading = false;
        state.errorMessage = action.payload || "Failed";
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
