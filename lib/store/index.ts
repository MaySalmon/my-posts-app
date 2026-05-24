import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import toastReducer from "./slices/toastSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
