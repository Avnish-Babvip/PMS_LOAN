import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllOffers = createAsyncThunk(
  "admin/offers",
  async ({ search, status, page, type }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 10);

      if (search) params.append("name", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
      }
      if (type !== "" && type !== undefined) {
        params.append("discount_type", type);
      }

      const link = `/admin/offers?${params.toString()}`;

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

export const addOffer = createAsyncThunk(
  "/admin/offers/add",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(`/admin/offers`, payload, {
        headers: {
          "Content-type": "application/json",
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

export const editOffer = createAsyncThunk(
  "/admin/offers/2",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(`/admin/offers/${id}`, payload, {
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
