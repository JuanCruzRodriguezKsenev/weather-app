import { Key } from "react";

// Tipo para coordenadas geográficas
export type Coordinates = {
  readonly latitude: number; // Latitud de la ciudad
  readonly longitude: number; // Longitud de la ciudad
};

export type City = {
  id?: Key;
  name: string;
  coordinates: Coordinates;
};

// Tipo para representar la estructura de un usuario
export type User = {
  id: number;
  name: string;
  email?: string;
};


export type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export interface BoundingBox {
  [index: number]: string;
}

export interface Location {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  boundingbox: BoundingBox;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon: string;
}