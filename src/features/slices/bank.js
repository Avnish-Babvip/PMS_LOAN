import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addBank,
  editBank,
  getAllBanks,
  toggleBankStatus,
} from "../actions/bank";

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
  bankLoading: false,
  bankData: [],
};

// ---------------------------------------------------------------------------------------

const bankSlice = createSlice({
  name: "bankSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        state.bankData = action.payload;
      })
      .addCase(getAllBanks.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.bankLoading = false;
        toast.error(action.payload);
      })
      .addCase(addBank.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(addBank.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast.success("Bank added successfully.");
      })
      .addCase(addBank.rejected, (state, action) => {
        state.bankLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(editBank.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(editBank.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast.success("Bank details updated successfully.");
      })
      .addCase(editBank.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.bankLoading = false;
        toast.error(action.payload);
      })
      .addCase(toggleBankStatus.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(toggleBankStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast.success("Bank status updated successfully.");
      })
      .addCase(toggleBankStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.bankLoading = false;
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = bankSlice.actions;
export default bankSlice.reducer;
