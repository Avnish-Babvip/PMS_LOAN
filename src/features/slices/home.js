import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getAppBanner,
  getHomeSections,
  getSiteSettings,
  updateHomeSection,
  updateSiteSettings,
} from "../actions/home";

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
  homeLoading: false,
  siteSettingData: {},
  homeData: [],
  appBannerData: [],
};

// ---------------------------------------------------------------------------------------

const homeSlice = createSlice({
  name: "homeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSiteSettings.pending, (state) => {
        state.errorMessage = "";
        state.homeLoading = true;
      })
      .addCase(getSiteSettings.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.homeLoading = false;
        state.siteSettingData = action.payload;
      })
      .addCase(getSiteSettings.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.homeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAppBanner.pending, (state) => {
        state.errorMessage = "";
        state.homeLoading = true;
      })
      .addCase(getAppBanner.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.homeLoading = false;
        state.appBannerData = action.payload;
      })
      .addCase(getAppBanner.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.homeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getHomeSections.pending, (state) => {
        state.errorMessage = "";
        state.homeLoading = true;
      })
      .addCase(getHomeSections.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.homeLoading = false;
        state.homeData = action.payload;
      })
      .addCase(getHomeSections.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.homeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateSiteSettings.pending, (state) => {
        state.errorMessage = "";
        state.homeLoading = true;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.homeLoading = false;
        toast("Site settings updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.homeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateHomeSection.pending, (state) => {
        state.errorMessage = "";
        state.homeLoading = true;
      })
      .addCase(updateHomeSection.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.homeLoading = false;
        toast("Home section updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateHomeSection.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.homeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = homeSlice.actions;
export default homeSlice.reducer;
