import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { getAllTimelines, getTimeline } from "../actions/timeline";

const initialState = {
  errorMessage: "",
  timelineLoading: false,
  timelineData: {},
  timelineDetailData: {},
};

// ---------------------------------------------------------------------------------------

const timelineSlice = createSlice({
  name: "timelineSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTimelines.pending, (state) => {
        state.errorMessage = "";
        state.timelineLoading = true;
      })
      .addCase(getAllTimelines.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.timelineLoading = false;
        state.timelineData = action.payload;
      })
      .addCase(getAllTimelines.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.timelineLoading = false;
        toast.error(action.payload);
      })
      .addCase(getTimeline.pending, (state) => {
        state.errorMessage = "";
        state.timelineLoading = true;
      })
      .addCase(getTimeline.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.timelineLoading = false;
        state.timelineDetailData = action.payload;
      })
      .addCase(getTimeline.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.timelineLoading = false;
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = timelineSlice.actions;
export default timelineSlice.reducer;
