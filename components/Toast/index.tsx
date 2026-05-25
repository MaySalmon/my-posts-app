"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { removeToast } from "@/lib/store/slices/toastSlice";
import type { Toast as ToastItem } from "@/lib/store/slices/toastSlice";
import styles from "./Toast.module.css";

const DURATION = 3500;

const ToastEntry = ({ toast }: { toast: ToastItem }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="status" aria-live="polite">
      <p className={styles.message}>{toast.message}</p>
      <button className={styles.dismiss} aria-label="Dismiss" onClick={() => dispatch(removeToast(toast.id))}>
        ×
      </button>
    </div>
  );
};

export const Toast = () => {
  const toasts = useAppSelector((s) => s.toast.toasts);

  return (
    <div className={styles.container} aria-label="Notifications">
      {toasts.map((t) => (
        <ToastEntry key={t.id} toast={t} />
      ))}
    </div>
  );
};
