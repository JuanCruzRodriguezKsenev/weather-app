// src/components/Header.tsx
"use client";

import { useState } from "react";
import { fetchUser } from "@/services/users";
import { useUserContext } from "@/contexts/UserContext";
import { LoginFormDialog } from "@/components/LoginFormDialog/LoginFormDialog";

import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  const { user, setUser } = useUserContext();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined); // Estado para el error
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleLoginSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined); // Limpiar el error antes de intentar iniciar sesión

    try {
      const user = await fetchUser(email, password);
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setOpen(false); // Cierra el modal después del login
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to log in. Please check your credentials."); // Establecer el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false); // Cierra el menú al hacer logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna el estado del menú desplegable
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Logo
      </Link>
      <div className={styles.headerRight}>
        {user ? (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button onClick={handleLogout} className={styles.logOut}>
              Log Out
            </button>
          </>
        ) : (
          <button onClick={() => setOpen(true)} className={styles.loginButton}>
            Login
          </button>
        )}
        <div className={styles.hambug} onClick={toggleMenu}>
          <div
            className={`${styles.barsContainer} ${
              isMenuOpen ? styles.active : ""
            }`}
          >
            <div
              className={`${styles.bar} ${styles.bar1} ${
                isMenuOpen ? styles.active : ""
              }`}
            ></div>
            <div
              className={`${styles.bar} ${styles.bar2} ${
                isMenuOpen ? styles.active : ""
              }`}
            ></div>
            <div
              className={`${styles.bar} ${styles.bar3} ${
                isMenuOpen ? styles.active : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
      <nav
        className={`${styles.menuDesplegable} ${
          isMenuOpen ? styles.active : ""
        }`}
      >
        <ul>
          <li>
            <Link href="/myCities" className={styles.menuLink}>
              My Cities
            </Link>
            <Link href="/users" className={styles.menuLink}>
              Users
            </Link>
          </li>
        </ul>
      </nav>

      <LoginFormDialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleLoginSubmit}
        loading={loading}
        error={error} // Pasar el error al componente LoginFormDialog
      />
    </header>
  );
}
