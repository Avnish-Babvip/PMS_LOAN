import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addAdminUser,
  editAdminUserStatus,
} from "../actions/adminuser";
import { getAllAgents } from "../actions/agent";

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
  agentLoading: false,
  agentData: {},
};

// ---------------------------------------------------------------------------------------

const agentSlice = createSlice({
  name: "agentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAgents.pending, (state) => {
        state.errorMessage = "";
        state.agentLoading = true;
      })
      .addCase(getAllAgents.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.agentLoading = false;
        state.agentData = action.payload;
      })
      .addCase(getAllAgents.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.agentLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addAdminUser.pending, (state) => {
        state.errorMessage = "";
        state.agentLoading = true;
      })
      .addCase(addAdminUser.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.agentLoading = false;
        toast("Admin user added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addAdminUser.rejected, (state, action) => {
        state.agentLoading = false;

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
      .addCase(editAdminUserStatus.pending, (state) => {
        state.errorMessage = "";
        state.agentLoading = true;
      })
      .addCase(editAdminUserStatus.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.agentLoading = false;
        toast("Admin user status updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editAdminUserStatus.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.agentLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = agentSlice.actions;
export default agentSlice.reducer;
