"use client";

import { PostCard } from "@/components/PostCard";

import { usePosts } from "@/hooks/usePosts";
import { useAppSelector } from "@/lib/store/hooks";
import styles from "@/app/page.module.css";

export const PostsList = () => {
  const { posts, isLoading, hasMore, error, loaderRef } = usePosts();
  const prepended = useAppSelector((s) => s.posts.prepended);
  const deleted = useAppSelector((s) => s.posts.deleted);

  const deletedSet = new Set(deleted);
  const prependedIds = new Set(prepended.map((p) => p.id));
  const allPosts = [...prepended, ...posts.filter((p) => !prependedIds.has(p.id))].filter(
    (p) => !deletedSet.has(p.id)
  );

  return (
    <>
      <section className={styles.grid} aria-label="Posts">
        {allPosts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i % 6} />
        ))}
      </section>

      {error && (
        <p className={styles.errorMessage} role="alert">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}

      <div
        ref={loaderRef}
        className={styles.loaderArea}
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading && (
          <div className={styles.loader} role="status" aria-label="Loading posts">
            <span /><span /><span />
          </div>
        )}
        {!hasMore && !isLoading && !error && (
          <p className={styles.endMessage}>You've reached the end</p>
        )}
      </div>
    </>
  );
};
