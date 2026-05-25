"use client";

import { useRef, useEffect } from "react";

import { EditPostModal } from "@/components/EditPostModal";
import { NewPostModal } from "@/components/NewPostModal";
import { Modal } from "@/components/Modal";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeModal } from "@/lib/store/slices/modalSlice";
import styles from "@/components/Modal/Modal.module.css";

const TextModal = ({
  data,
  onClose,
}: {
  data: { title: string; message: string };
  onClose: () => void;
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className={styles.textBody}>
        <h2 id="modal-title" className={styles.title}>{data.title}</h2>
        <p id="modal-message" className={styles.message}>{data.message}</p>
      </div>
      <div className={styles.footer}>
        <button ref={closeBtnRef} className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export const AppModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, content } = useAppSelector((s) => s.modal);
  const onClose = () => dispatch(closeModal());

  if (!isOpen || !content) return null;

  if (content.type === "post") return <EditPostModal data={content.data} onClose={onClose} />;
  if (content.type === "new-post") return <NewPostModal onClose={onClose} />;
  if (content.type === "text") return <TextModal data={content.data} onClose={onClose} />;

  return null;
};
