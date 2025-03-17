import { WeatherData, Coordinates } from "@/utils/types";

// Tipo de error personalizado para capturar los errores de la API
class WeatherAPIError extends Error {
  statusCode?: number;
  constructor( message: string, statusCode?: number ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "WeatherAPIError";
  }
}

export async function getCurrentWeather( coordinates: Coordinates ): Promise<WeatherData> {
  const { latitude, longitude } = coordinates;
  const endpoint = `/api/openWeather?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(endpoint);

    // Comprobamos que la respuesta sea exitosa
    if (!response.ok) {
      // Puedes incluir el código de estado de la respuesta en el error
      throw new WeatherAPIError("Error fetching weather data", response.status);
    }

    // Verificamos que el contenido sea JSON y lo parseamos
    const data = await response.json();

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !data.coord) {
      throw new WeatherAPIError("Invalid weather data structure");
    }

    return data as WeatherData;
  } catch (error) {
    // Mejor manejo de errores, diferenciando tipos de errores
    if (error instanceof WeatherAPIError) {
      console.error(
        `Weather API error: ${error.message} (Status: ${error.statusCode})`
      );
    } else {
      console.error("General error fetching weather data:", error);
    }

    // Re-lanzamos el error para que el consumidor de la función lo maneje
    throw error;
  }
}
