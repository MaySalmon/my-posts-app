import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/types/post";

interface PostsState {
  updates: Record<string, Post>;
  prepended: Post[];
}

const postsSlice = createSlice({
  name: "posts",
  initialState: { updates: {}, prepended: [] } as PostsState,
  reducers: {
    patchPost(state, action: PayloadAction<Post>) {
      state.updates[action.payload.id] = action.payload;
    },
    prependPost(state, action: PayloadAction<Post>) {
      state.prepended.unshift(action.payload);
    },
  },
});

export const { patchPost, prependPost } = postsSlice.actions;
export default postsSlice.reducer;
