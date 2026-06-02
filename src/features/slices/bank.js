import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addBank, editBank, getAllBanks, toggleBankStatus } from "../actions/bank";


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
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addBank.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(addBank.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast("Bank added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addBank.rejected, (state, action) => {
        state.bankLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
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
      .addCase(editBank.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(editBank.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast("Bank details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editBank.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.bankLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(toggleBankStatus.pending, (state) => {
        state.errorMessage = "";
        state.bankLoading = true;
      })
      .addCase(toggleBankStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.bankLoading = false;
        toast("Bank status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(toggleBankStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.bankLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
     
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = bankSlice.actions;
export default bankSlice.reducer;
