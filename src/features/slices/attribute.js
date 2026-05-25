import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addAttribute,
  addAttributeValue,
  deleteAttribute,
  deleteAttributeValue,
  editAttribute,
  editAttributeValue,
  getAllAttributes,
  getAllAttributeValues,
} from "../actions/attribute";

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
  attributeLoading: false,
  attributeData: [],
  attributeValueData: [],
};

// ---------------------------------------------------------------------------------------

const attributeSlice = createSlice({
  name: "attributeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttributes.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(getAllAttributes.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        state.attributeData = action.payload.data;
      })
      .addCase(getAllAttributes.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addAttribute.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(addAttribute.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addAttribute.rejected, (state, action) => {
        state.attributeLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
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
      .addCase(editAttribute.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(editAttribute.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute details updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editAttribute.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteAttribute.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(deleteAttribute.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteAttribute.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getAllAttributeValues.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(getAllAttributeValues.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        state.attributeValueData = action.payload.data;
      })
      .addCase(getAllAttributeValues.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addAttributeValue.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(addAttributeValue.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute Value added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addAttributeValue.rejected, (state, action) => {
        state.attributeLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
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
      .addCase(editAttributeValue.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(editAttributeValue.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute Value updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editAttributeValue.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(deleteAttributeValue.pending, (state) => {
        state.errorMessage = "";
        state.attributeLoading = true;
      })
      .addCase(deleteAttributeValue.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.attributeLoading = false;
        toast("Attribute value deleted successfully.", {
          description: formattedDate,
        });
      })
      .addCase(deleteAttributeValue.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.attributeLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = attributeSlice.actions;
export default attributeSlice.reducer;
