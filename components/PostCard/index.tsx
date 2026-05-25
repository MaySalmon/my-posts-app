"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { openModal } from "@/lib/store/slices/modalSlice";
import type { Post } from "@/types/post";
import styles from "./PostCard.module.css";

export function PostCard({ post, index }: { post: Post; index: number }) {
  const dispatch = useAppDispatch();
  const override = useAppSelector((s) => s.posts.updates[post.id]);
  const p = override ?? post;

  function handleOpen() {
    dispatch(openModal({ type: "post", data: p }));
  }

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
}
