import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllCategories = createAsyncThunk(
  "/api/admin/categorys",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();
      params.append("per_page", 500);

      const link = `/admin/categories?${params.toString()}`;

      const { data } = await instance.get(link, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed");
    }
  },
);
export const getAllCategoriesWithSubCategories = createAsyncThunk(
  "/api/admin/categoryswq",
  async (_, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();
      params.append("per_page", 500);

      const link = `/admin/categories/tree?${params.toString()}`;

      const { data } = await instance.get(link, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed");
    }
  },
);

export const getAllSubCategories = createAsyncThunk(
  "/api/admin/subCategory",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(`/admin/categories/${id}`, {
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

export const addCategory = createAsyncThunk(
  "/admin/categorys/add",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/categories`, payload, {
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
export const editCategory = createAsyncThunk(
  "/admin/categorys/6",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/categories/${id}`, payload, {
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

export const deleteCategory = createAsyncThunk(
  "admin/categorys/12",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.delete(`/admin/categories/${id}`, {
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
