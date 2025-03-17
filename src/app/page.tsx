"use client";

import { useEffect, useState } from "react";
import { getCurrentLocation } from "@/utils/geolocation";
import { getCurrentWeather } from "@/utils/openWeather";
import { Coordinates, WeatherData } from "@/utils/types";

import styles from "./page.module.css";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const location: Coordinates = await getCurrentLocation();

        // Llamar a la API para obtener los datos del clima
        const data = await getCurrentWeather(location);
        setWeatherData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchLocation();
  }, []);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {weatherData ? (
        <div className={styles.weather}>
          <div className={styles.location}>
            {weatherData.name}, {weatherData.sys.country}
          </div>
          <div className={styles.temperature}>
            {Math.round(weatherData.main.temp)}°C
          </div>
          <div className={styles.description}>{weatherData.weather[0].description}</div>
        </div>
      ) : (
        <div className={styles.loading}>Loading...</div>
      )}
    </div>
  );
}
