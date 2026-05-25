import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  editMaintenance,
  getMaintenance,
  getMaintenanceContact,
} from "../actions/maintenance";

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
  maintenanceLoading: false,
  maintenanceData: {},
  contactData: [],
};

// ---------------------------------------------------------------------------------------

const maintenanceSlice = createSlice({
  name: "maintenanceSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMaintenance.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getMaintenance.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.maintenanceData = action.payload.data;
      })
      .addCase(getMaintenance.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getMaintenanceContact.pending, (state) => {
        state.errorMessage = "";
        state.maintenanceLoading = true;
      })
      .addCase(getMaintenanceContact.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.maintenanceLoading = false;
        state.contactData = action.payload.data;
      })
      .addCase(getMaintenanceContact.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.maintenanceLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editMaintenance.pending, (state) => {
        state.errorMessage = "";
        state.maintenanceLoading = true;
      })
      .addCase(editMaintenance.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.maintenanceLoading = false;
        toast("Maintenance details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editMaintenance.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.maintenanceLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
