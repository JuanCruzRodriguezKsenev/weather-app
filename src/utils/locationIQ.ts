import { Location } from "@/utils/types";

// Tipo de error personalizado para capturar errores de la API
class LocationAPIError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "LocationAPIError";
  }
}

// Función para buscar una ubicación usando la API del backend
export async function searchLocation(query: string): Promise<Location[]> {
  const endpoint = `/api/locationIQ?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint);

    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new LocationAPIError(
        "Error fetching location data",
        response.status
      );
    }

    // Parsear el contenido como JSON
    const data = await response.json();

    // Validar que la estructura de los datos sea la esperada
    if (!Array.isArray(data)) {
      throw new LocationAPIError("Invalid location data structure");
    }

    return data as Location[];
  } catch (error) {
    // Manejo de errores diferenciado
    if (error instanceof LocationAPIError) {
      console.error(
        `Location API error: ${error.message} (Status: ${error.statusCode})`
      );
    } else {
      console.error("General error fetching location data:", error);
    }

    // Relanzar el error para que sea manejado por el consumidor de la función
    throw error;
  }
}
