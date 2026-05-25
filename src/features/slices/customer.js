import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  editCustomerKycStatus,
  editCustomerStatus,
  getAllContacts,
  getAllCustomers,
  getAllKycDocument,
  getAllSubscribers,
  getSingleCustomer,
  getSingleCustomerAddresses,
} from "../actions/customer";

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
  customerLoading: false,
  customerAddressLoading: false,
  customerData: {},
  subscriberData: {},
  contactData: {},
  customerDetails: {},
  customerAddressDetails: {},
  kycData: {},
};

// ---------------------------------------------------------------------------------------

const customerSlice = createSlice({
  name: "customerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleCustomer.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(getSingleCustomer.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        state.customerDetails = action.payload.data;
      })
      .addCase(getSingleCustomer.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getSingleCustomerAddresses.pending, (state) => {
        state.errorMessage = "";
        state.customerAddressLoading = true;
      })
      .addCase(getSingleCustomerAddresses.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerAddressLoading = false;
        state.customerAddressDetails = action.payload.data;
      })
      .addCase(getSingleCustomerAddresses.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerAddressLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllCustomers.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        state.customerData = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllContacts.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        state.contactData = action.payload.data;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllSubscribers.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(getAllSubscribers.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        state.subscriberData = action.payload.data;
      })
      .addCase(getAllSubscribers.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllKycDocument.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(getAllKycDocument.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        state.kycData = action.payload.data;
      })
      .addCase(getAllKycDocument.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editCustomerStatus.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(editCustomerStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        toast("Customer status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCustomerStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(editCustomerKycStatus.pending, (state) => {
        state.errorMessage = "";
        state.customerLoading = true;
      })
      .addCase(editCustomerKycStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.customerLoading = false;
        toast("Customer kyc status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCustomerKycStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.customerLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = customerSlice.actions;
export default customerSlice.reducer;
