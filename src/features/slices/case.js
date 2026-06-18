import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addCase,
  editCase,
  getAllCaseDocuments,
  getAllCases,
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
  caseData: [],
  documentData: [],
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
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllCaseDocuments.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(getAllCaseDocuments.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        state.documentData = action.payload;
      })
      .addCase(getAllCaseDocuments.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addCase.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(addCase.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast("Case added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addCase.rejected, (state, action) => {
        state.caseLoading = false;

        const payload = action.payload;
        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload?.errors).forEach((messages) => {
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
      .addCase(editCase.pending, (state) => {
        state.errorMessage = "";
        state.caseLoading = true;
      })
      .addCase(editCase.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.caseLoading = false;
        toast("Case details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editCase.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.caseLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = caseSlice.actions;
export default caseSlice.reducer;
