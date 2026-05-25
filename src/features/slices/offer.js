import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addOffer, editOffer, getAllOffers } from "../actions/offer";

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
  offerLoading: false,
  offerData: {},
};

// ---------------------------------------------------------------------------------------

const offerSlice = createSlice({
  name: "offerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOffers.pending, (state) => {
        state.errorMessage = "";
        state.offerLoading = true;
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.offerLoading = false;
        state.offerData = action.payload;
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.offerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addOffer.pending, (state) => {
        state.errorMessage = "";
        state.offerLoading = true;
      })
      .addCase(addOffer.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.offerLoading = false;
        toast("Offer added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addOffer.rejected, (state, action) => {
        state.offerLoading = false;
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
      .addCase(editOffer.pending, (state) => {
        state.errorMessage = "";
        state.offerLoading = true;
      })
      .addCase(editOffer.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.offerLoading = false;
        toast("Offer updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editOffer.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.offerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = offerSlice.actions;
export default offerSlice.reducer;
