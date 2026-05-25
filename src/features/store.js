import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import references from "./slices/references";
import authentication from "./slices/authentication";
import adminUser from "./slices/adminUser";
import customer from "./slices/customer";
import role from "./slices/role";
import permission from "./slices/permission";
import category from "./slices/category";
import attribute from "./slices/attribute";
import product from "./slices/product";
import rider from "./slices/rider";
import order from "./slices/order";
import location from "./slices/location";
import commission from "./slices/commission";
import coupon from "./slices/coupon";
import offer from "./slices/offer";
import tax from "./slices/tax";
import dashboard from "./slices/dashboard";
import paymentGateway from "./slices/paymentGateway";
import home from "./slices/home";
import cms from "./slices/cms";
import maintenance from "./slices/maintenance";
import rider_order from "./slices/rider/order";
import rider_user from "./slices/rider/user";
import rider_wallet from "./slices/rider/wallet";

const rootReducer = combineReducers({
  references,
  authentication,
  adminUser,
  customer,
  role,
  permission,
  category,
  attribute,
  product,
  rider,
  order,
  location,
  commission,
  coupon,
  offer,
  tax,
  dashboard,
  paymentGateway,
  home,
  cms,
  maintenance,
  rider_order,
  rider_user,
  rider_wallet,
});

// Redux-persist configuration
const persistConfig = {
  key: "AONE ADMIN",
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
