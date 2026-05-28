import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const dashboard = createAsyncThunk(
  "/admin/dashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(`/admin/dashboard`, {
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

