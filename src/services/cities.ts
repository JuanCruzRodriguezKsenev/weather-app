import { City, Coordinates } from "@/utils/types";

const API_BASE_URL = "/api/postgres/cities";
const JSON_HEADERS = { "Content-Type": "application/json" };

function handleError(error: unknown, context: string): never {
  console.error(`Error in ${context}:`, error);
  throw error;
}

// Fetch all cities for a user
export async function fetchCities(userId: number): Promise<City[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
    if (!response.ok) throw new Error("Error fetching cities");
    return await response.json();
  } catch (error) {
    handleError(error, "fetchCities");
  }
}

// Create a new city
export async function createCity(
  userId: number,
  coordinates: Coordinates
): Promise<City> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ userId, coordinates }),
    });

    if (!response.ok) throw new Error("Failed to create city");

    return await response.json();
  } catch (error) {
    handleError(error, "createCity");
  }
}

// Update an existing city
export async function updateCity(
  id: number,
  userId: number,
  coordinates: Coordinates
): Promise<City> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ id, userId, coordinates }),
    });

    if (!response.ok) throw new Error("Failed to update city");

    return await response.json();
  } catch (error) {
    handleError(error, "updateCity");
  }
}

// Delete a city
export async function deleteCity(id: number, userId: number): Promise<void> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
      headers: JSON_HEADERS,
      body: JSON.stringify({ id, userId }),
    });

    if (!response.ok) throw new Error("Failed to delete city");
  } catch (error) {
    handleError(error, "deleteCity");
  }
}
