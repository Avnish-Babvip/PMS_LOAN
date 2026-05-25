import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";

export const getRiderWallet = createAsyncThunk(
  "/rider/wallet",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/rider/wallet`, {
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

export const getRiderWalletHistory = createAsyncThunk(
  "/rider/wallet-transactions",
  async (
    { search, type, page, from_date, to_date },
    { getState, rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 6);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (type !== "" && type !== undefined) {
        params.append("type", type);
      }
      if (from_date !== "" && from_date !== undefined) {
        params.append("from_date", from_date);
      }
      if (to_date !== "" && to_date !== undefined) {
        params.append("to_date", to_date);
      }

      const link = `/rider/wallet-transactions?${params.toString()}`;
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
