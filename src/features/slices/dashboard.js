import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { salesChart, trackSales } from "../actions/dashboard";

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
  salesLoading: false,
  chartLoading: false,
  trackSalesData: {},
  salesChartData: [],
};

// ---------------------------------------------------------------------------------------

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(trackSales.pending, (state) => {
        state.errorMessage = "";
        state.salesLoading = true;
      })
      .addCase(trackSales.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.salesLoading = false;
        state.trackSalesData = action.payload;
      })
      .addCase(trackSales.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.salesLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(salesChart.pending, (state) => {
        state.errorMessage = "";
        state.chartLoading = true;
      })
      .addCase(salesChart.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.chartLoading = false;
        state.salesChartData = action.payload.data;
      })
      .addCase(salesChart.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.chartLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
