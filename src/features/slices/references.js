import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "profile", // default value
};

const referencesSlice = createSlice({
  name: "accountCenter",
  initialState,
  reducers: {
    setActiveAccountCenterTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveSubTab: (state, action) => {
      state.activeSub = action.payload;
    },
  },
});

export const { setActiveAccountCenterTab, setActiveSubTab } =
  referencesSlice.actions;
export default referencesSlice.reducer;
