import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/types/post";

export type ModalContent =
  | { type: "text"; data: { title: string; message: string } }
  | { type: "post"; data: Post };

interface ModalState {
  isOpen: boolean;
  content: ModalContent | null;
}

const initialState: ModalState = {
  isOpen: false,
  content: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalContent>) {
      state.isOpen = true;
      state.content = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.content = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
