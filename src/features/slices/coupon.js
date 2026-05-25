import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addCoupon, editCoupon, getAllCoupons } from "../actions/coupon";

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
  couponLoading: false,
  couponData: {},
};

// ---------------------------------------------------------------------------------------

const couponSlice = createSlice({
  name: "couponSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.errorMessage = "";
        state.couponLoading = true;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.couponLoading = false;
        state.couponData = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.couponLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addCoupon.pending, (state) => {
        state.errorMessage = "";
        state.couponLoading = true;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.couponLoading = false;
        toast("Coupon added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.couponLoading = false;
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
      .addCase(editCoupon.pending, (state) => {
        state.errorMessage = "";
        state.couponLoading = true;
      })
      .addCase(editCoupon.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.couponLoading = false;
        toast("Coupon updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCoupon.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.couponLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = couponSlice.actions;
export default couponSlice.reducer;
