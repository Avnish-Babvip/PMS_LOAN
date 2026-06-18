import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllForms = createAsyncThunk(
  "admin/forms",
  async (
    { search, status, per_page, page, loan_type, id },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", per_page || 10);

      if (search) params.append("search", search);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
      }
      if (loan_type !== "" && loan_type !== undefined) {
        params.append("loan_type", loan_type);
      }

      const link = `/admin/banks/${id}/forms?${params.toString()}`;

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

export const getFormDetails = createAsyncThunk(
  "admin/forms/details",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const link = `/admin/forms/${id}`;

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

export const uploadFormSheet = createAsyncThunk(
  "/admin/uploadFormSheet",
  async ({ bankId, payload }, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(
        `/admin/banks/${bankId}/forms/upload`,
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

export const editBasicDetails = createAsyncThunk(
  "/admin/forms/basic/2",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(`/admin/forms/${id}`, payload, {
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
export const editFormField = createAsyncThunk(
  "/admin/forms/field/2",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(`/admin/fields/${id}`, payload, {
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
export const addFormField = createAsyncThunk(
  "/admin/forms/field/2/add",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/forms/${id}/fields`,
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

export const deleteFormField = createAsyncThunk(
  "/admin/forms/field/2/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.delete(`/admin/fields/${id}`, {
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
