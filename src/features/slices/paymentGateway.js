import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addPaymentGateway,
  getAllPaymentGateways,
  updatePaymentGateway,
} from "../actions/paymentGateway";

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
  paymentGatewayLoading: false,
  paymentGatewayData: {},
};

const paymentGatewaySlice = createSlice({
  name: "paymentGateway",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllPaymentGateways.pending, (state) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = true;
      })
      .addCase(getAllPaymentGateways.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = false;
        state.paymentGatewayData = action.payload;
      })
      .addCase(getAllPaymentGateways.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.paymentGatewayLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addPaymentGateway.pending, (state) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = true;
      })
      .addCase(addPaymentGateway.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = false;
        toast("Payment gateway details added.", {
          description: formattedDate,
        });
      })
      .addCase(addPaymentGateway.rejected, (state, action) => {
        state.paymentGatewayLoading = false;
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
      })
      .addCase(updatePaymentGateway.pending, (state) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = true;
      })
      .addCase(updatePaymentGateway.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.paymentGatewayLoading = false;
        toast("Payment Gateway details updated.", {
          description: formattedDate,
        });
      })
      .addCase(updatePaymentGateway.rejected, (state, action) => {
        state.paymentGatewayLoading = false;
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

export const {} = paymentGatewaySlice.actions;

export default paymentGatewaySlice.reducer;
