"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { openModal } from "@/lib/store/slices/modalSlice";
import styles from "./AddPostButton.module.css";

export function AddPostButton() {
  const dispatch = useAppDispatch();
  return (
    <button
      className={styles.btn}
      onClick={() => dispatch(openModal({ type: "new-post" }))}
    >
      + New Post
    </button>
  );
}
