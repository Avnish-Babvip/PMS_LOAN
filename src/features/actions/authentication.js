import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//LOGIN

export const adminLogin = createAsyncThunk(
  "/admin/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/admin/login", payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to post admin login",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "admin/forgot-password",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post(`/admin/forgot-password`, payload, {
        withCredentials: false,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);

export const resetForgotPassword = createAsyncThunk(
  "admin/reset-password",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post(`/admin/reset-password`, payload, {
        withCredentials: false,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);

export const changePassword = createAsyncThunk(
  "admin/change-password",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/update-password`, payload, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);

export const adminLogout = createAsyncThunk(
  "admin/Logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/logout`,
        {},
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to logout admin",
      );
    }
  },
);

export const updateAdminProfile = createAsyncThunk(
  "admin/profile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.put(`/admin/profile`, payload, {
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
