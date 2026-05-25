import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addCity,
  addPincode,
  getAllPincodes,
  getCities,
  getCountries,
  getStates,
  updateCity,
  updatePincode,
} from "../actions/location";

const formattedDate = new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const initialState = {
  errorMessage: "",
  locationLoading: false,
  cityLoading: false,
  countryData: [],
  stateData: [],
  cityData: [],
  pincodeData: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllPincodes.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(getAllPincodes.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        state.pincodeData = action.payload.data;
      })
      .addCase(getAllPincodes.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.locationLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addPincode.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(addPincode.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        toast("Delivery Pincode added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addPincode.rejected, (state, action) => {
        state.locationLoading = false;
        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg, {
                description: formattedDate,
              });
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message, {
            description: formattedDate,
          });
        }
      })
      .addCase(updatePincode.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(updatePincode.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        toast("Delivery Pincode updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updatePincode.rejected, (state, action) => {
        state.locationLoading = false;
        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg, {
                description: formattedDate,
              });
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message, {
            description: formattedDate,
          });
        }
      })
      .addCase(getCountries.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        state.countryData = action.payload.data;
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.locationLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getStates.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(getStates.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        state.stateData = action.payload.data;
      })
      .addCase(getStates.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.locationLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(getCities.pending, (state) => {
        state.errorMessage = "";
        state.cityLoading = true;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.cityLoading = false;
        state.cityData = action.payload.data;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed";
        state.cityLoading = false;
        toast(action.payload, {
          description: formattedDate,
        });
      })
      .addCase(addCity.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        toast("City added successfully.", {
          description: formattedDate,
        });
      })
      .addCase(addCity.rejected, (state, action) => {
        state.locationLoading = false;
        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg, {
                description: formattedDate,
              });
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message, {
            description: formattedDate,
          });
        }
      })
      .addCase(updateCity.pending, (state) => {
        state.errorMessage = "";
        state.locationLoading = true;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.errorMessage = "";
        state.locationLoading = false;
        toast("City updated successfully.", {
          description: formattedDate,
        });
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.locationLoading = false;
        const payload = action.payload;

        // ✅ Validation errors from backend
        if (payload?.data?.errors) {
          Object.values(payload.data.errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg, {
                description: formattedDate,
              });
            });
          });

          state.errorMessage = payload.message || "Validation error";
        } else {
          // ✅ Fallback error
          const message = payload?.message || payload || "Failed";
          state.errorMessage = message;

          toast.error(message, {
            description: formattedDate,
          });
        }
      });
  },
});

export const {} = locationSlice.actions;

export default locationSlice.reducer;
