import { User } from "@/utils/types";

const API_BASE_URL = "/api/postgres/users";
const JSON_HEADERS = { "Content-Type": "application/json" };

function handleError(error: unknown, context: string): never {
  console.error(`Error in ${context}:`, error);
  // Puedes devolver un valor predeterminado o realizar alguna acción
  throw error; // Si deseas que el error se lance en todas las funciones
}

// get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Error fetching users");
    return await response.json();
  } catch (error) {
    handleError(error, "fetchUsers");
    return []; // Devolver un array vacío en caso de error
  }
}

// get a user by id
export async function fetchUser(
  email: string,
  password: string
): Promise<User | null> {
  // Se puede retornar null en caso de error
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Failed to fetch user");

    const user: User = await response.json();
    if (!user || !user.id || !user.email) {
      throw new Error("Invalid user data received");
    }

    return user;
  } catch (error) {
    handleError(error, "fetchUser");
    return null; // Devolver null si hay un error
  }
}

// create a new user
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<User | null> {
  // Retornar null en caso de error
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) throw new Error("Failed to create user");

    return await response.json();
  } catch (error) {
    handleError(error, "createUser");
    return null; // Devolver null en caso de error
  }
}

// update an existing user
export async function updateUser(
  id: number,
  name: string,
  email: string,
  password: string
): Promise<User | null> {
  // Retornar null en caso de error
  try {
    const response = await fetch(API_BASE_URL, {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ id, name, email, password }),
    });

    if (!response.ok) throw new Error("Failed to update user");

    return await response.json();
  } catch (error) {
    handleError(error, "updateUser");
    return null; // Devolver null en caso de error
  }
}

// delete a user
export async function deleteUser(id: number): Promise<boolean> {
  // Retornar booleano
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
      headers: JSON_HEADERS,
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error("Failed to delete user");

    return true; // Si la operación fue exitosa
  } catch (error) {
    handleError(error, "deleteUser");
    return false; // Retornar false si hay un error
  }
}
