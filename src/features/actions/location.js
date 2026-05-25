import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getCountries = createAsyncThunk(
  "/api/admin/locations/countries",
  async (_, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get("/admin/locations/countries", {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);
export const getStates = createAsyncThunk(
  "/api/admin/locations/states/countryid",
  async (id, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/admin/locations/states/${id}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);
export const getCities = createAsyncThunk(
  "/api/admin/locations/cities/stateid",
  async (id, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/admin/locations/cities/${id}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);

export const addCity = createAsyncThunk(
  "/admin/locations/city",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(`/admin/locations/city`, payload, {
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

export const updateCity = createAsyncThunk(
  "/admin/locations/city/update",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.put(
        `/admin/locations/city/${id}`,
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
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);

export const getAllPincodes = createAsyncThunk(
  "/api/admin/delivery-pincodes",
  async ({ search, status, page }, { getState, rejectWithValue }) => {
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

      const link = `/admin/delivery-pincodes?${params.toString()}`;

      const { data } = await instance.get(link, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);

export const addPincode = createAsyncThunk(
  "/admin/delivery-pincodes",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.post(
        `/admin/delivery-pincodes`,
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
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);

export const updatePincode = createAsyncThunk(
  "/admin/delivery-pincodes/2",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.put(
        `/admin/delivery-pincodes/${id}`,
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
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" },
      );
    }
  },
);
