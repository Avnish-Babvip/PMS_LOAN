import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  assignOrder,
  editOrderStatus,
  getAllAssignOrders,
  getAllNotAssignOrders,
  getAllOrders,
  getOrderSettings,
  getSingleOrder,
  multipleOrderPrint,
  singleOrderPrint,
  updateOrderSettings,
} from "../actions/order";

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
  printLoading: false,
  multiplePrintLoading: false,
  orderData: {},
  settingData: {},
  assignedOrderData: {},
  unassignedOrderData: {},
  orderDetails: {},
};

// ---------------------------------------------------------------------------------------

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.orderData = action.payload.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllAssignOrders.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getAllAssignOrders.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.assignedOrderData = action.payload.data;
      })
      .addCase(getAllAssignOrders.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllNotAssignOrders.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getAllNotAssignOrders.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.unassignedOrderData = action.payload.data;
      })
      .addCase(getAllNotAssignOrders.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getSingleOrder.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getOrderSettings.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getOrderSettings.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.settingData = action.payload.data;
      })
      .addCase(getOrderSettings.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateOrderSettings.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(updateOrderSettings.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        toast("Order settings updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateOrderSettings.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(assignOrder.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(assignOrder.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        toast("Order assigned to the rider.", {
          description: formattedDate,
        });
      })
      .addCase(assignOrder.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editOrderStatus.pending, (state) => {
        state.errorMessage = "";
        state.orderLoading = true;
      })
      .addCase(editOrderStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.orderLoading = false;
        toast("Order status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editOrderStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.orderLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(singleOrderPrint.pending, (state) => {
        state.errorMessage = "";
        state.printLoading = true;
      })
      .addCase(singleOrderPrint.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.printLoading = false;
        toast("Print order successfully.", {
          description: formattedDate,
        });
      })
      .addCase(singleOrderPrint.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.printLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(multipleOrderPrint.pending, (state) => {
        state.errorMessage = "";
        state.multiplePrintLoading = true;
      })
      .addCase(multipleOrderPrint.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.multiplePrintLoading = false;
        toast("Multiple print order successfully.", {
          description: formattedDate,
        });
      })
      .addCase(multipleOrderPrint.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.multiplePrintLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = orderSlice.actions;
export default orderSlice.reducer;
