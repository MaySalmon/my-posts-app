"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeModal } from "@/lib/store/slices/modalSlice";
import { patchPost, prependPost } from "@/lib/store/slices/postsSlice";
import { addToast } from "@/lib/store/slices/toastSlice";
import type { ModalContent } from "@/lib/store/slices/modalSlice";
import type { Post } from "@/types/post";
import styles from "./Modal.module.css";

function EditPostForm({ data }: { data: Extract<ModalContent, { type: "post" }>["data"] }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Post>(data);
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          author: form.author,
          category: form.category,
          readTime: form.readTime,
          imageColor: form.imageColor,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated: Post = await res.json();
      dispatch(patchPost(updated));
      dispatch(addToast({ message: "Post updated", type: "success" }));
      dispatch(closeModal());
    } catch {
      dispatch(addToast({ message: "Failed to save changes", type: "error" }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className={styles.postBand}
        style={{ "--band-color": form.imageColor } as React.CSSProperties}
      >
        <span className={styles.postCategory}>{form.category || "Category"}</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formBody}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={styles.input}
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className={`${styles.input} ${styles.textarea}`}
              value={form.excerpt}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                className={styles.input}
                value={form.author}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                className={styles.input}
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="readTime">Read time</label>
              <input
                id="readTime"
                name="readTime"
                className={styles.input}
                value={form.readTime}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="imageColor">Card color</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={form.imageColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageColor: e.target.value }))}
                  aria-label="Pick card color"
                />
                <input
                  id="imageColor"
                  name="imageColor"
                  className={styles.input}
                  value={form.imageColor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}

function NewPostForm() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    author: "",
    category: "",
    readTime: "",
    imageColor: "#1a1a2e",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created: Post = await res.json();
      dispatch(prependPost(created));
      dispatch(addToast({ message: "Post created", type: "success" }));
      dispatch(closeModal());
    } catch {
      dispatch(addToast({ message: "Failed to create post", type: "error" }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className={styles.postBand}
        style={{ "--band-color": form.imageColor } as React.CSSProperties}
      >
        <span className={styles.postCategory}>{form.category || "New Post"}</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formBody}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="np-title">Title</label>
            <input
              id="np-title"
              name="title"
              className={styles.input}
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="np-excerpt">Excerpt</label>
            <textarea
              id="np-excerpt"
              name="excerpt"
              className={`${styles.input} ${styles.textarea}`}
              value={form.excerpt}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-author">Author</label>
              <input
                id="np-author"
                name="author"
                className={styles.input}
                value={form.author}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-category">Category</label>
              <input
                id="np-category"
                name="category"
                className={styles.input}
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-readTime">Read time</label>
              <input
                id="np-readTime"
                name="readTime"
                className={styles.input}
                value={form.readTime}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-imageColor">Card color</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={form.imageColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageColor: e.target.value }))}
                  aria-label="Pick card color"
                />
                <input
                  id="np-imageColor"
                  name="imageColor"
                  className={styles.input}
                  value={form.imageColor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving || !form.title.trim()}
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}

function TextBody({ data }: { data: Extract<ModalContent, { type: "text" }>["data"] }) {
  const dispatch = useAppDispatch();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <>
      <div className={styles.textBody}>
        <h2 id="modal-title" className={styles.title}>{data.title}</h2>
        <p id="modal-message" className={styles.message}>{data.message}</p>
      </div>
      <div className={styles.footer}>
        <button
          ref={closeBtnRef}
          className={styles.closeBtn}
          onClick={() => dispatch(closeModal())}
        >
          Close
        </button>
      </div>
    </>
  );
}

export function Modal() {
  const dispatch = useAppDispatch();
  const { isOpen, content } = useAppSelector((s) => s.modal);

  useEffect(() => {
    if (!isOpen) return;
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
        onClick={(e) => e.stopPropagation()}
      >
        {content.type === "post" && <EditPostForm data={content.data} />}
        {content.type === "new-post" && <NewPostForm />}
        {content.type === "text" && <TextBody data={content.data} />}
      </div>
    </div>
  );
}
