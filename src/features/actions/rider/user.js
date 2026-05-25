import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";

export const getRiderReferralHistory = createAsyncThunk(
  "/rider/referral-usages",
  async (
    { search, page, from_date, to_date },
    { getState, rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 6);

      if (search) params.append("search", search);

      if (from_date !== "" && from_date !== undefined) {
        params.append("from_date", from_date);
      }
      if (to_date !== "" && to_date !== undefined) {
        params.append("to_date", to_date);
      }

      const link = `/rider/referral-usages?${params.toString()}`;
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(link, {
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

export const getRiderCommission = createAsyncThunk(
  "/rider/commission",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/rider/commission`, {
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

export const getRiderProfile = createAsyncThunk(
  "/rider/profile",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/rider/profile`, {
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
export const getRiderDashboard = createAsyncThunk(
  "/rider/dashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/rider/dashboard`, {
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
export const getRiderReferralCode = createAsyncThunk(
  "/rider/referral",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/rider/referral`, {
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

export const updateRiderProfile = createAsyncThunk(
  "/rider/profile/update",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.put(`/rider/profile`, payload, {
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

export const submitKyc = createAsyncThunk(
  "/rider/kyc",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(`/rider/kyc`, payload, {
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
