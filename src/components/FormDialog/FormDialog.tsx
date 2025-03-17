"use client";

import { useEffect, useRef, ReactNode, FormEvent } from "react";
import styles from "./FormDialog.module.css";

interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  children: ReactNode;
}

export function FormDialog({
  open,
  setOpen,
  onSubmit,
  title,
  children,
}: FormDialogProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const modal = modalRef.current;

    if (modal) {
      if (open) {
        modal.showModal();
        const firstInput = modal.querySelector("input");
        if (firstInput) firstInput.focus();
      } else {
        modal.close();
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.close();
      setOpen(false);
    }
  };

  return (
    <div
      className={styles.backdrop}
      style={{ display: open ? "block" : "none" }}
    >
      <dialog className={styles.dialog} ref={modalRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          {children}
        </form>
      </dialog>
    </div>
  );
}
