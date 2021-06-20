import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import contactReducer from "./slices/contact";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  contact: contactReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "production" ? false : true,
});

export default store;
