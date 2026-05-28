import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { dashboard } from "../actions/dashboard";

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
      .addCase(dashboard.pending, (state) => {
        state.errorMessage = "";
        state.dashboardLoading = true;
      })
      .addCase(dashboard.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.dashboardLoading = false;
        state.dashboardData = action.payload.data;
      })
      .addCase(dashboard.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.dashboardLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })

  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
