"use client";

import { useFormik } from "formik";

import { Modal } from "@/components/Modal";

import { useAppDispatch } from "@/lib/store/hooks";
import { closeModal } from "@/lib/store/slices/modalSlice";
import { prependPost } from "@/lib/store/slices/postsSlice";
import { addToast } from "@/lib/store/slices/toastSlice";
import type { Post } from "@/types/post";
import styles from "@/components/Modal/Modal.module.css";

type FormValues = {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  imageColor: string;
};

export const NewPostModal = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      excerpt: "",
      author: "",
      category: "",
      readTime: "",
      imageColor: "#1a1a2e",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Failed to create");
        const created: Post = await res.json();
        dispatch(prependPost(created));
        dispatch(addToast({ message: "Post created", type: "success" }));
        dispatch(closeModal());
      } catch {
        dispatch(addToast({ message: "Failed to create post", type: "error" }));
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal onClose={onClose}>
      <div
        className={styles.postBand}
        style={{ "--band-color": formik.values.imageColor } as React.CSSProperties}
      >
        <span className={styles.postCategory}>{formik.values.category || "New Post"}</span>
      </div>

      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <div className={styles.formBody}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="np-title">Title</label>
            <input
              id="np-title"
              name="title"
              className={styles.input}
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="np-excerpt">Excerpt</label>
            <textarea
              id="np-excerpt"
              name="excerpt"
              className={`${styles.input} ${styles.textarea}`}
              value={formik.values.excerpt}
              onChange={formik.handleChange}
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
                value={formik.values.author}
                onChange={formik.handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-category">Category</label>
              <input
                id="np-category"
                name="category"
                className={styles.input}
                value={formik.values.category}
                onChange={formik.handleChange}
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
                value={formik.values.readTime}
                onChange={formik.handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="np-imageColor">Card color</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={formik.values.imageColor}
                  onChange={(e) => formik.setFieldValue("imageColor", e.target.value)}
                  aria-label="Pick card color"
                />
                <input
                  id="np-imageColor"
                  name="imageColor"
                  className={styles.input}
                  value={formik.values.imageColor}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={formik.isSubmitting || !formik.values.title.trim()}
          >
            {formik.isSubmitting ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
