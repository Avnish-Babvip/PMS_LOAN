import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { dashboard, getAllNotifications } from "../actions/dashboard";

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
  dashboardLoading: false,
  dashboardData: {},
};

// ---------------------------------------------------------------------------------------

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.errorMessage = "";
        state.dashboardLoading = true;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.dashboardLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.dashboardLoading = false;
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
