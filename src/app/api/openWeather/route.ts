import { NextResponse } from "next/server";

class WeatherAPIError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "WeatherAPIError";
  }
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY as string;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: Request) {
  try {
    // Extraer y validar parámetros
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing latitude or longitude parameters" },
        { status: 400 }
      );
    }

    // Construir URL de la API
    const endpoint = `${OPENWEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    // Realizar solicitud a la API
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new WeatherAPIError(
        `Error fetching data from OpenWeather API`,
        response.status
      );
    }

    // Parsear y validar datos
    const weatherData = await response.json();
    if (!weatherData || !weatherData.weather || !weatherData.main) {
      throw new WeatherAPIError("Invalid data structure from OpenWeather API");
    }

    return NextResponse.json(weatherData);
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      return NextResponse.json(
        { error: error.message, statusCode: error.statusCode },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
