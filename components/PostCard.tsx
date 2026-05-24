"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { openModal } from "@/lib/store/slices/modalSlice";
import type { Post } from "@/types/post";
import styles from "./PostCard.module.css";

export function PostCard({ post, index }: { post: Post; index: number }) {
  const dispatch = useAppDispatch();

  function handleOpen() {
    dispatch(openModal({ type: "post", data: post }));
  }

  return (
    <article
      className={styles.card}
      style={{ "--i": index, "--card-color": post.imageColor } as React.CSSProperties}
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
      tabIndex={0}
      role="button"
      aria-label={`Read more about ${post.title}`}
    >
      <div className={styles.cardImage}>
        <span className={styles.category}>{post.category}</span>
        <div className={styles.imageAccent} />
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <footer className={styles.meta}>
          <span className={styles.author}>{post.author}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.date}>{post.date}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{post.readTime}</span>
        </footer>
      </div>
    </article>
  );
}
