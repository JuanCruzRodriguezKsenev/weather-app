// src/utils/geolocation.ts

import { Coordinates } from "@/utils/types";

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(new Error("Error getting current location: " + error.message));
        }
      );
    } else {
      reject(new Error("Your browser does not support geolocation."));
    }
  });
}
