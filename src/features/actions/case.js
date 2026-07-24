import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getAllCases = createAsyncThunk(
  "/api/admin/cases",
  async (
    { page, per_page, status, bank_id, search, form_id, start_date, end_date },
    { getState, rejectWithValue },
  ) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("page", page || 1);
      params.append("per_page", per_page || 10);

      // // ✅ Add status filter
      if (status !== "" && status !== undefined) {
        params.append("status", status);
      }
      if (bank_id !== "" && bank_id !== undefined) {
        params.append("bank_id", bank_id);
      }
      if (search !== "" && search !== undefined) {
        params.append("search", search);
      }
      if (form_id !== "" && form_id !== undefined) {
        params.append("form_id", form_id);
      }
      if (start_date !== "" && start_date !== undefined) {
        params.append("start_date", start_date);
      }
      if (end_date !== "" && end_date !== undefined) {
        params.append("end_date", end_date);
      }

      const link = `/admin/cases?${params.toString()}`;

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

export const getAllCaseDocuments = createAsyncThunk(
  "/api/admin/cases/document",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;

      const { data } = await instance.get(`/admin/cases/${id}/documents`, {
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

export const addCase = createAsyncThunk(
  "/admin/cases/add",
  async (payload, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(`/admin/cases`, payload, {
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

export const editCase = createAsyncThunk(
  "/admin/cases/6",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(`/admin/cases/${id}`, payload, {
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
export const addCaseDocument = createAsyncThunk(
  "/admin/cases/add/doc",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/cases/${id}/documents`,
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

export const editCaseDocument = createAsyncThunk(
  "/admin/cases/6/doc",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.put(`/admin/documents/${id}`, payload, {
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

export const getDynamicForm = createAsyncThunk(
  "/admin/cases/form",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(`/admin/cases/${id}/form`, {
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

export const submitForm = createAsyncThunk(
  "/admin/cases/submit/doc",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/cases/${id}/submit`,
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

export const updateVisitDistance = createAsyncThunk(
  "/admin/cases/visitDistance",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.post(
        `/admin/verification-documents/${id}/distance`,
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

export const getVerificationLogs = createAsyncThunk(
  "/admin/cases/logs",
  async (id, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const { data } = await instance.get(
        `/admin/verification-documents/${id}/logs`,
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

export const exportCases = createAsyncThunk(
  "admin/cases/export",
  async (
    { status, bank_id, start_date, end_date, form_id },
    { getState, rejectWithValue },
  ) => {
    try {
      const loginToken = getState().authentication?.adminData?.token;

      const params = new URLSearchParams();

      params.append("format", "xlsx");

      if (status !== "" && status !== undefined) {
        params.append("status", status);
      }

      if (bank_id !== "" && bank_id !== undefined) {
        params.append("bank_id", bank_id);
      }

      if (form_id !== "" && form_id !== undefined) {
        params.append("bank_form_id", form_id);
      }

      if (start_date !== "" && start_date !== undefined) {
        params.append("start_date", start_date);
      }
      if (end_date !== "" && end_date !== undefined) {
        params.append("end_date", end_date);
      }

      const response = await instance.get(
        `/admin/cases/export?${params.toString()}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );

      const contentType = response.headers["content-type"];

      if (contentType?.includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);

        return rejectWithValue(json);
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;

      // Get filename from response header if available
      const disposition = response.headers["content-disposition"];

      let fileName = "cases.xlsx";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);

        if (match?.[1]) {
          fileName = match[1];
        }
      }

      link.setAttribute("download", fileName);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);

          return rejectWithValue(json);
        } catch {
          return rejectWithValue({
            message: "Failed to export cases",
          });
        }
      }

      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        },
      );
    }
  },
);

export const updateCaseStatus = createAsyncThunk(
  "/admin/cases/updateCaseStatus",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const data = await instance.patch(
        `/admin/cases/${id}/qc-status`,
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
export const updateCaseDocumentStatus = createAsyncThunk(
  "/admin/documents/updateCaseDocumentStatus",
  async ({ payload, id }, { getState, rejectWithValue }) => {
    try {
      // ✅ Get token directly from store
      const loginToken = getState().authentication?.adminData?.token;
      const data = await instance.patch(
        `/admin/documents/${id}/qc-status`,
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
