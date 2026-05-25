import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/types/post";

interface PostsState {
  updates: Record<string, Post>;
  prepended: Post[];
  deleted: string[];
}

const postsSlice = createSlice({
  name: "posts",
  initialState: { updates: {}, prepended: [], deleted: [] } as PostsState,
  reducers: {
    patchPost(state, action: PayloadAction<Post>) {
      state.updates[action.payload.id] = action.payload;
    },
    prependPost(state, action: PayloadAction<Post>) {
      state.prepended.unshift(action.payload);
    },
    removePost(state, action: PayloadAction<string>) {
      state.prepended = state.prepended.filter((p) => p.id !== action.payload);
      delete state.updates[action.payload];
      state.deleted.push(action.payload);
    },
  },
});

export const { patchPost, prependPost, removePost } = postsSlice.actions;
export default postsSlice.reducer;
