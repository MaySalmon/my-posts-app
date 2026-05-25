"use client";

import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { openModal } from "@/lib/store/slices/modalSlice";
import { removePost } from "@/lib/store/slices/postsSlice";
import { addToast } from "@/lib/store/slices/toastSlice";
import type { Post } from "@/types/post";
import styles from "./PostCard.module.css";

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export const PostCard = ({ post, index }: { post: Post; index: number }) => {
  const dispatch = useAppDispatch();
  const override = useAppSelector((s) => s.posts.updates[post.id]);
  const p = override ?? post;
  const [deleting, setDeleting] = useState(false);

  const handleOpen = () => dispatch(openModal({ type: "post", data: p }));

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      dispatch(removePost(p.id));
      dispatch(addToast({ message: "Post deleted", type: "success" }));
    } catch {
      dispatch(addToast({ message: "Failed to delete post", type: "error" }));
      setDeleting(false);
    }
  };

  return (
    <article
      className={styles.card}
      style={{ "--i": index, "--card-color": p.imageColor } as React.CSSProperties}
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
      tabIndex={0}
      role="button"
      aria-label={`Edit ${p.title}`}
    >
      <div className={styles.cardImage}>
        <span className={styles.category}>{p.category}</span>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${p.title}`}
        >
          <TrashIcon />
        </button>
        <div className={styles.imageAccent} />
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.title}>{p.title}</h2>
        <p className={styles.excerpt}>{p.excerpt}</p>
        <footer className={styles.meta}>
          <span className={styles.author}>{p.author}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.date}>{p.date}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{p.readTime}</span>
        </footer>
      </div>
    </article>
  );
};
