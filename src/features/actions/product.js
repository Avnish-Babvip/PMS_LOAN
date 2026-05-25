import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllProducts = createAsyncThunk(
  "/api/admin/products",
  async (
    { search, page, per_page, status, sort },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", per_page || 10);

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (sort) params.append("sort", sort);

      const link = `/admin/products?${params.toString()}`;

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

export const addProduct = createAsyncThunk(
  "/admin/products/add",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/products`, payload, {
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
export const editProduct = createAsyncThunk(
  "/admin/products/6",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/products/${id}`, payload, {
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

export const deleteProduct = createAsyncThunk(
  "admin/products/12",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.delete(`/admin/products/${id}`, {
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
export const deleteImage = createAsyncThunk(
  "admin/products/image/12",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.delete(`/admin/products/image/${id}`, {
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

export const addBulkProduct = createAsyncThunk(
  "/admin/products/bulk",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/products/bulk-upload`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);

export const addZipImages = createAsyncThunk(
  "/admin/products/bulk-upload-image",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/products/bulk-upload-image`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);
