import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { addAgent, editAgent, getAllAgents } from "../actions/agent";

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
      .addCase(addAgent.pending, (state) => {
        state.errorMessage = "";
        state.agentLoading = true;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.agentLoading = false;
        toast("Agent added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addAgent.rejected, (state, action) => {
        state.agentLoading = false;

        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.errors) {
          Object.values(payload.errors).forEach((messages) => {
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
      .addCase(editAgent.pending, (state) => {
        state.errorMessage = "";
        state.agentLoading = true;
      })
      .addCase(editAgent.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.agentLoading = false;
        toast("Agent updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(editAgent.rejected, (state, action) => {
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
