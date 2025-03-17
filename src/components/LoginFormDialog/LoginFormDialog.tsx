// src/components/LoginFormDialog/LoginFormDialog.tsx
"use client";

import { useState, FormEvent } from "react";
import { FormDialog } from "@/components/FormDialog/FormDialog";
import styles from "./LoginFormDialog.module.css";

interface LoginFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string; // Nueva propiedad para manejar el error
}

export function LoginFormDialog({
  open,
  setOpen,
  onSubmit,
  loading,
  error,
}: LoginFormDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <FormDialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title="Login"
    >
      <label htmlFor="email" className={styles.label}>
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}{" "}
      {/* Mostrar el error si existe */}
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Loading..." : "Log In"}
      </button>
    </FormDialog>
  );
}
