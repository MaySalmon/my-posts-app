import styles from "./PostCard.module.css";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageColor: string;
}

export function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <article
      className={styles.card}
      style={{ "--i": index, "--card-color": post.imageColor } as React.CSSProperties}
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
