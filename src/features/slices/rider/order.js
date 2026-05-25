import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getAllOrderHistory,
  getAssignedOrders,
  markedDelivered,
  markedFailed,
  markedPicked,
} from "../../actions/rider/order";

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
  orderLoading: false,
  pickedLoading: false,
  deliveredLoading: false,
  failedLoading: false,
  orderData: {},
  orderHistoryData: {},
};

// ---------------------------------------------------------------------------------------

const rider_orderSlice = createSlice({
  name: "rider_OrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAssignedOrders.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getAssignedOrders.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.orderData = action.payload.data;
      })
      .addCase(getAssignedOrders.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllOrderHistory.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getAllOrderHistory.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.orderHistoryData = action.payload.data;
      })
      .addCase(getAllOrderHistory.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(markedPicked.pending, (state) => {
        state.errorMessage = "";
        state.pickedLoading = true;
      })
      .addCase(markedPicked.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.pickedLoading = false;
        toast("Order status marked picked.", {
          description: formattedDate,
        });
      })
      .addCase(markedPicked.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.pickedLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(markedDelivered.pending, (state) => {
        state.errorMessage = "";
        state.deliveredLoading = true;
      })
      .addCase(markedDelivered.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.deliveredLoading = false;
        toast("Order status marked delivered.", {
          description: formattedDate,
        });
      })
      .addCase(markedDelivered.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.deliveredLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(markedFailed.pending, (state) => {
        state.errorMessage = "";
        state.failedLoading = true;
      })
      .addCase(markedFailed.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.failedLoading = false;
        toast("Order status marked failed.", {
          description: formattedDate,
        });
      })
      .addCase(markedFailed.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.failedLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = rider_orderSlice.actions;
export default rider_orderSlice.reducer;
