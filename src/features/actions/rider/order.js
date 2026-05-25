import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../services/axiosInterceptor";

export const getAssignedOrders = createAsyncThunk(
  "/rider/orders",
  async (
    { search, filter, status, page, from_date, to_date },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 6);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("delivery_status", status);
      }
      if (filter !== "" && filter !== undefined) {
        params.append("filter", filter);
      }
      if (from_date !== "" && from_date !== undefined) {
        params.append("from_date", from_date);
      }
      if (to_date !== "" && to_date !== undefined) {
        params.append("to_date", to_date);
      }

      const link = `/rider/orders?${params.toString()}`;

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

export const getAllOrderHistory = createAsyncThunk(
  "/rider/orders/history",
  async (
    { search, payment_method, status, page, payment_status },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 6);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("delivery_status", status);
      }
      if (payment_method !== "" && payment_method !== undefined) {
        params.append("payment_method", payment_method);
      }
      if (payment_status !== "" && payment_status !== undefined) {
        params.append("payment_status", payment_status);
      }

      const link = `/rider/orders/history?${params.toString()}`;

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

export const markedPicked = createAsyncThunk(
  "/rider/orders/2/picked",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(
        `/rider/orders/${id}/picked`,
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
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);

export const markedDelivered = createAsyncThunk(
  "/rider/orders/2/delivered",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(
        `/rider/orders/${id}/delivered`,
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
      return rejectWithValue(error.response.data.message || "Failed ");
    }
  },
);

export const markedFailed = createAsyncThunk(
  "/rider/orders/2/failed",
  async ({ id, reason }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(
        `/rider/orders/${id}/failed`,
        { reason },
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
