"use client";

import { useState, useEffect, FormEvent } from "react";
import { FormDialog } from "@/components/FormDialog/FormDialog";
import { useUserContext } from "@/contexts/UserContext";
import { createCity, fetchCities } from "@/services/cities";
import { Coordinates, City } from "@/utils/types";
import { WeatherCard } from "@/components/WeatherCard/WeatherCard";
import { searchLocation } from "@/utils/locationIQ";
import styles from "./page.module.css";

export default function MyCities() {
  const { user } = useUserContext();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (user) {
      refreshCities();
    }
  }, [user]);

  const refreshCities = async () => {
    if (user) {
      try {
        const userCities = await fetchCities(user.id as number);
        setCities(userCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 2) {
      try {
        const results = await searchLocation(value);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (selectedSuggestion: any) => {
    setCity(selectedSuggestion.name);
    setSuggestions([]);
    setCoordinates({
      latitude: selectedSuggestion.lat,
      longitude: selectedSuggestion.lng,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !coordinates) return;

    setLoading(true);
    try {
      await createCity(user.id, coordinates);
      await refreshCities();
      setCity("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding city:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Cities</h1>
        <button className={styles.openNewCity} onClick={() => setOpen(true)}>
          New City
        </button>
      </div>

      <FormDialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        title="Agregar nueva ciudad"
      >
        <label htmlFor="city">City</label>
        <div className={styles.searchCity}>
          <input
            type="text"
            id="city"
            name="city"
            value={city}
            onChange={handleCityChange}
            required
          />
          {suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <div
                  className={styles.suggestion}
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Agregar"}
        </button>
      </FormDialog>

      <div className={styles.myCities}>
        {cities.length > 0 ? (
          cities.map((city) => (
            <WeatherCard
              city={city}
              userId={user?.id ?? 0}
              key={city.id}
              onCityChange={refreshCities}
            />
          ))
        ) : (
          <p>No cities found</p>
        )}
      </div>
    </div>
  );
}
