import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import references from "./slices/references";
import authentication from "./slices/authentication";
import adminUser from "./slices/adminUser";
import role from "./slices/role";
import permission from "./slices/permission";
import dashboard from "./slices/dashboard";
import agent from "./slices/agent";
import bank from "./slices/bank";
import form from "./slices/form";
import caseSlice from "./slices/case";
import timeline from "./slices/timeline";

const rootReducer = combineReducers({
  references,
  dashboard,
  authentication,
  adminUser,
  role,
  permission,
  agent,
  bank,
  form,
  caseSlice,
  timeline,
});

// Redux-persist configuration
const persistConfig = {
  key: "PMS",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: `${import.meta.env.VITE_REACT_APP_REDUX_PERSIST_SECRET_KEY}`,
      onError: (err) => {
        // Handle encryption errors if any
      },
    }),
  ],
};

// Persisted root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
