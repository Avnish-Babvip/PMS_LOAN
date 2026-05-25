import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const trackSales = createAsyncThunk(
  "/admin/Track-sales",
  async ({ filter, from_date, to_date }, { getState, rejectWithValue }) => {
    try {
      const payload = { filter, start_date: from_date, end_date: to_date };
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/Track-sales`, payload, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);
export const salesChart = createAsyncThunk(
  "/admin-dashboard-chart",
  async (year, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(
        `/admin/admin-dashboard-chart?year=${year}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);
