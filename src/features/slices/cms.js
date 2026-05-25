import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  getAboutUs,
  getContactUs,
  getFaqData,
  getPrivacyPolicy,
  getReturnPolicy,
  getTermsAndConditions,
  updateAboutUs,
  updateContactUs,
  updateFaq,
  updatePrivacyPolicy,
  updateReturnPolicy,
  updateTermsAndConditions,
} from "../actions/cms";

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
  cmsLoading: false,
  faqData: {},
  privacyPolicyData: [],
  returnPolicyData: [],
  termsConditionsData: [],
  contactUsData: [],
  aboutUsData: {},
};

// ---------------------------------------------------------------------------------------

const cmsSlice = createSlice({
  name: "cmsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFaqData.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getFaqData.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.faqData = action.payload;
      })
      .addCase(getFaqData.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateFaq.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("FAQ updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAboutUs.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getAboutUs.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.aboutUsData = action.payload.data;
      })
      .addCase(getAboutUs.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateAboutUs.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updateAboutUs.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("FAQ updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateAboutUs.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getPrivacyPolicy.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getPrivacyPolicy.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.privacyPolicyData = action.payload.data;
      })
      .addCase(getPrivacyPolicy.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updatePrivacyPolicy.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("Privacy policy updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updatePrivacyPolicy.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getReturnPolicy.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getReturnPolicy.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.returnPolicyData = action.payload.data;
      })
      .addCase(getReturnPolicy.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateReturnPolicy.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updateReturnPolicy.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("Return policy updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateReturnPolicy.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getTermsAndConditions.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getTermsAndConditions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.termsConditionsData = action.payload.data;
      })
      .addCase(getTermsAndConditions.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateTermsAndConditions.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updateTermsAndConditions.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("Terms and conditions updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateTermsAndConditions.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getContactUs.pending, (state) => {
        state.errorMessage = "";
      })
      .addCase(getContactUs.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.contactUsData = action.payload.data;
      })
      .addCase(getContactUs.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(updateContactUs.pending, (state) => {
        state.errorMessage = "";
        state.cmsLoading = true;
      })
      .addCase(updateContactUs.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cmsLoading = false;
        toast("Contact us updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateContactUs.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cmsLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = cmsSlice.actions;
export default cmsSlice.reducer;
