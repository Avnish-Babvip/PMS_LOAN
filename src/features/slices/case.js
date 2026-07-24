import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addCase,
  addCaseDocument,
  editCase,
  editCaseDocument,
  exportCases,
  getAllCaseDocuments,
  getAllCases,
  getDynamicForm,
  getVerificationLogs,
  submitForm,
  updateCaseDocumentStatus,
  updateCaseStatus,
  updateVisitDistance,
} from "../actions/case";

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
  caseLoading: false,
  formLoading: false,
  documentLoading: false,
  formData: {},
  caseData: [],
  documentData: [],
  logsData: [],
};

// ---------------------------------------------------------------------------------------

const caseSlice = createSlice({
  name: "caseSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCases.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(getAllCases.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        state.caseData = action.payload;
      })
      .addCase(getAllCases.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast.error(action.payload);
      })
      .addCase(exportCases.pending, (state) => {
        state.errorMessage = "";
        state.exportLoading = true;
      })
      .addCase(exportCases.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.exportLoading = false;
      })
      .addCase(exportCases.rejected, (state, action) => {
        state.exportLoading = false;
        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(getVerificationLogs.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(getVerificationLogs.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        state.logsData = action.payload.data;
      })
      .addCase(getVerificationLogs.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast.error(action.payload);
      })
      .addCase(getAllCaseDocuments.pending, (state) => {
        state.errorMessage = "";
        state.documentLoading = true;
      })
      .addCase(getAllCaseDocuments.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.documentLoading = false;
        state.documentData = action.payload;
      })
      .addCase(getAllCaseDocuments.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.documentLoading = false;
        toast.error(action.payload);
      })
      .addCase(getDynamicForm.pending, (state) => {
        state.errorMessage = "";
        state.formData = null;
      })
      .addCase(getDynamicForm.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formData = action.payload.data;
      })
      .addCase(getDynamicForm.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        toast.error(action.payload);
      })
      .addCase(addCase.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(addCase.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast.success("Case added successfully.");
      })
      .addCase(addCase.rejected, (state, action) => {
        state.caseLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(submitForm.pending, (state) => {
        state.errorMessage = "";
        state.formLoading = true;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.formLoading = false;
        toast.success("Form submitted successfully.");
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.formLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(editCase.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(editCase.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast.success("Case details updated successfully.");
      })
      .addCase(editCase.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast.error(action.payload);
      })
      .addCase(updateCaseDocumentStatus.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(updateCaseDocumentStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast.success("Case document status updated successfully.");
      })
      .addCase(updateCaseDocumentStatus.rejected, (state, action) => {
        state.caseLoading = false;
        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(updateCaseStatus.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(updateCaseStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast.success("Case status updated successfully.");
      })
      .addCase(updateCaseStatus.rejected, (state, action) => {
        state.caseLoading = false;
        const payload = action.payload;
        // ✅ Validation errors from backend
        console.log(payload);
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(addCaseDocument.pending, (state) => {
        state.errorMessage = "";
        state.documentLoading = true;
      })
      .addCase(addCaseDocument.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.documentLoading = false;
        toast.success("Case document added successfully.");
      })
      .addCase(addCaseDocument.rejected, (state, action) => {
        state.documentLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message);
        }
      })
      .addCase(editCaseDocument.pending, (state) => {
        state.errorMessage = "";
        state.documentLoading = true;
      })
      .addCase(editCaseDocument.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.documentLoading = false;
        toast.success("Case document details updated successfully.");
      })
      .addCase(editCaseDocument.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.documentLoading = false;
        toast.error(action.payload);
      })
      .addCase(updateVisitDistance.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(updateVisitDistance.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast.success("Visit distance updated successfully.");
      })
      .addCase(updateVisitDistance.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast.error(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = caseSlice.actions;
export default caseSlice.reducer;
