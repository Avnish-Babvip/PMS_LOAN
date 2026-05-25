import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllOrders = createAsyncThunk(
  "admin/orders",
  async (
    {
      search,
      status,
      page,
      payment_status,
      payment_method,
      from_date,
      to_date,
      period,
    },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 10);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
      }
      if (payment_status !== "" && payment_status !== undefined) {
        params.append("payment_status", payment_status);
      }
      if (payment_method !== "" && payment_method !== undefined) {
        params.append("payment_method", payment_method);
      }
      if (from_date !== "" && from_date !== undefined) {
        params.append("from_date", from_date);
      }
      if (to_date !== "" && to_date !== undefined) {
        params.append("to_date", payment_method);
      }
      if (period !== "" && period !== undefined) {
        params.append("period", period);
      }

      const link = `/admin/orders?${params.toString()}`;

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

export const getAllAssignOrders = createAsyncThunk(
  "/admin/order-assignments",
  async (
    { search, filter, status, page, from_date, to_date },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 10);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
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

      const link = `/admin/order-assignments?${params.toString()}`;

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

export const getAllNotAssignOrders = createAsyncThunk(
  "admin/not-assigned-orders",
  async (
    { search, filter, status, page, from_date, to_date },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", 10);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
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

      const link = `/admin/not-assigned-orders?${params.toString()}`;

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

export const assignOrder = createAsyncThunk(
  "/admin/orders/assign",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/assign-rider`, payload, {
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

export const getSingleOrder = createAsyncThunk(
  "admin/order/single",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/admin/orders/${id}`, {
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

export const editOrderStatus = createAsyncThunk(
  "/admin/orders/2/status",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(
        `/admin/orders/${id}/status`,
        payload,
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

export const getOrderSettings = createAsyncThunk(
  "admin/settings",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/admin/settings`, {
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
export const updateOrderSettings = createAsyncThunk(
  "admin/settings/update",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(`/admin/settings/update`, payload, {
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

export const exportOrders =
  ({ payload, loginToken }) =>
  async () => {
    try {
      const response = await instance.post("/admin/Track-export", payload, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.xlsx");

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

export const customerNotification =
  ({ payload, loginToken }) =>
  async () => {
    try {
      const response = await instance.post(
        "/admin/customer-notifications/send",
        payload,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
          responseType: "blob",
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

export const singleOrderPrint = createAsyncThunk(
  "/admin/print/1",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(`/admin/print/${id}`, {
        responseType: "blob",
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
export const multipleOrderPrint = createAsyncThunk(
  "/admin/bulk-print",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/bulk-print`, payload, {
        responseType: "blob",
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
