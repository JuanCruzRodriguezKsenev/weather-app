import { useEffect, useState, FormEvent } from "react";
import { City, WeatherData } from "@/utils/types";
import { getCurrentWeather } from "@/utils/openWeather";
import { updateCity, deleteCity } from "@/services/cities";
import { UpdateCityFormDialog } from "@/components/UpdateCityFormDialog/UpdateCityFormDialog"; // Asegúrate de importar correctamente
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  city: City | null;
  userId: number;
  onCityChange: () => Promise<void>;
}

export function WeatherCard({ city, userId, onCityChange }: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      if (city && city.coordinates) {
        try {
          const data = await getCurrentWeather(city.coordinates);
          setWeatherData(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        }
      }
    }
    fetchWeather();
  }, [city]);

  const handleToggleMenu = () => setMenuOpen(!menuOpen);

  const handleChangeLocation = () => setDialogOpen(true);

  const handleDialogSubmit = async (
    event: FormEvent<HTMLFormElement>,
    location: Location | null
  ) => {
    event.preventDefault();
    if (location && city && city.id) {
      const { lat, lon } = location;
      await updateCity(city.id, userId, {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });
      await onCityChange();
      setDialogOpen(false);
    } else {
      alert("Por favor, seleccione una ubicación válida.");
    }
  };

  const handleDeleteCard = async () => {
    if (city && city.id) {
      await deleteCity(city.id, userId);
      await onCityChange();
      setMenuOpen(false);
    }
  };

  return (
    <div className={styles.weatherCard}>
      <div className={styles.upper}>
        <div className={styles.menu} onClick={handleToggleMenu}>
          <div className={styles.punto}></div>
          <div className={styles.punto}></div>
          <div className={styles.punto}></div>
        </div>
        {menuOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={handleChangeLocation}>Cambiar Ubicación</button>
            <button onClick={handleDeleteCard}>Eliminar Tarjeta</button>
          </div>
        )}
      </div>
      {weatherData ? (
        <div className={styles.lower}>
          <p>{weatherData.name}</p>
          <p>{`${weatherData.main.temp}°C`}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
        </div>
      ) : error ? (
        <>Error: {error}</>
      ) : (
        <>Loading weather information...</>
      )}
      {dialogOpen && (
        <UpdateCityFormDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          onSubmit={handleDialogSubmit}
          title="Cambiar Ubicación"
        />
      )}
    </div>
  );
}
