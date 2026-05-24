import type { Metadata } from "next";
import { PostsList } from "@/components/PostsList";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Journal — Ideas worth keeping",
  description: "A curated collection of ideas and stories worth keeping.",
};

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>The Journal</p>
          <h1 className={styles.headline}>Ideas worth keeping</h1>
        </div>
        <div className={styles.headerRule} />
      </header>
      <PostsList />
    </main>
  );
}
