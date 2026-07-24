import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllTimelines = createAsyncThunk(
  "/api/live-sessions",
  async ({ page, per_page, agent_id, date }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page || 1);
      params.append("per_page", per_page || 10);

      if (agent_id !== "" && agent_id !== undefined) {
        params.append("agent_id", agent_id);
      }
      if (date !== "" && date !== undefined) {
        params.append("date", date);
      }

      const link = `/admin/live-sessions?${params.toString()}`;

      const { data } = await instance.get(link, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed");
    }
  },
);

export const getTimeline = createAsyncThunk(
  "/admin/live-sessions",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(`/admin/live-sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);
