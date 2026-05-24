"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeModal } from "@/lib/store/slices/modalSlice";
import type { ModalContent } from "@/lib/store/slices/modalSlice";
import styles from "./Modal.module.css";

function PostBody({ data }: { data: Extract<ModalContent, { type: "post" }>["data"] }) {
  return (
    <>
      <div className={styles.postBand} style={{ "--band-color": data.imageColor } as React.CSSProperties}>
        <span className={styles.postCategory}>{data.category}</span>
      </div>
      <div className={styles.postBody}>
        <h2 id="modal-title" className={styles.title}>{data.title}</h2>
        <p id="modal-message" className={styles.postExcerpt}>{data.excerpt}</p>
        <footer className={styles.postMeta}>
          <span>{data.author}</span>
          <span className={styles.dot}>·</span>
          <span>{data.date}</span>
          <span className={styles.dot}>·</span>
          <span>{data.readTime}</span>
        </footer>
      </div>
    </>
  );
}

function TextBody({ data }: { data: Extract<ModalContent, { type: "text" }>["data"] }) {
  return (
    <div className={styles.textBody}>
      <h2 id="modal-title" className={styles.title}>{data.title}</h2>
      <p id="modal-message" className={styles.message}>{data.message}</p>
    </div>
  );
}

export function Modal() {
  const dispatch = useAppDispatch();
  const { isOpen, content } = useAppSelector((s) => s.modal);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeModal());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, dispatch]);

  if (!isOpen || !content) return null;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={() => dispatch(closeModal())}
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        {content.type === "post" && <PostBody data={content.data} />}
        {content.type === "text" && <TextBody data={content.data} />}
        <div className={styles.footer}>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={() => dispatch(closeModal())}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
