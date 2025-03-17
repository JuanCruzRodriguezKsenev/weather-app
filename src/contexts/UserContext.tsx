"use client";

// Importaciones necesarias desde React
import {
  createContext, // Permite crear un contexto para compartir el estado entre componentes
  ReactNode, // Tipo para definir los hijos del componente (children)
  useContext, // Hook para consumir el contexto en componentes hijos
  useState, // Hook para manejar el estado dentro del componente
} from "react";

// Importación del tipo `User` desde un archivo local de utilidades
import { User } from "@/utils/types";

// Definición del tipo para el contexto del usuario
export type UserContextType = {
  user: User | null; // El usuario actual o `null` si no hay usuario
  setUser: (user: User | null) => void; // Función para actualizar el estado del usuario
};

// Crear el contexto con un valor inicial de `undefined`, lo que implica que el contexto no está disponible inicialmente
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Tipo para las propiedades del componente `UserProvider`
type UserProviderProps = {
  children: ReactNode; // Propiedad que permite pasar los componentes hijos
};

// Componente `UserProvider` que envuelve la aplicación y proporciona el contexto del usuario
export function UserProvider({ children }: UserProviderProps) {
  // Estado que maneja el usuario, con valor inicial de `null`
  const [user, setUser] = useState<User | null>(null);

  // El valor del contexto incluye tanto el usuario como la función para actualizarlo
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Renderiza los componentes hijos dentro del proveedor */}
    </UserContext.Provider>
  );
}

// Custom hook para consumir el contexto de usuario de manera más fácil
export function useUserContext() {
  const context = useContext(UserContext);

  // Manejo de error si el contexto no está disponible (en caso de que no se haya envuelto el componente con `UserProvider`)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}