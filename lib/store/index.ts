import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import toastReducer from "./slices/toastSlice";
import postsReducer from "./slices/postsSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    toast: toastReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
