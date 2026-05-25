"use client";

import { useFormik } from "formik";

import { Modal } from "@/components/Modal";

import { useAppDispatch } from "@/lib/store/hooks";
import { closeModal } from "@/lib/store/slices/modalSlice";
import { patchPost } from "@/lib/store/slices/postsSlice";
import { addToast } from "@/lib/store/slices/toastSlice";
import type { ModalContent } from "@/lib/store/slices/modalSlice";
import type { Post } from "@/types/post";
import styles from "@/components/Modal/Modal.module.css";

type Props = {
  data: Extract<ModalContent, { type: "post" }>["data"];
  onClose: () => void;
};

export const EditPostModal = ({ data, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const formik = useFormik<Post>({
    initialValues: data,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`/api/posts/${values.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            excerpt: values.excerpt,
            author: values.author,
            category: values.category,
            readTime: values.readTime,
            imageColor: values.imageColor,
          }),
        });
        if (!res.ok) throw new Error("Failed to save");
        const updated: Post = await res.json();
        dispatch(patchPost(updated));
        dispatch(addToast({ message: "Post updated", type: "success" }));
        dispatch(closeModal());
      } catch {
        dispatch(addToast({ message: "Failed to save changes", type: "error" }));
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
        <span className={styles.postCategory}>{formik.values.category || "Category"}</span>
      </div>

      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <div className={styles.formBody}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={styles.input}
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className={`${styles.input} ${styles.textarea}`}
              value={formik.values.excerpt}
              onChange={formik.handleChange}
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
                value={formik.values.author}
                onChange={formik.handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                className={styles.input}
                value={formik.values.category}
                onChange={formik.handleChange}
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
                value={formik.values.readTime}
                onChange={formik.handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="imageColor">Card color</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={formik.values.imageColor}
                  onChange={(e) => formik.setFieldValue("imageColor", e.target.value)}
                  aria-label="Pick card color"
                />
                <input
                  id="imageColor"
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
          <button type="submit" className={styles.saveBtn} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
