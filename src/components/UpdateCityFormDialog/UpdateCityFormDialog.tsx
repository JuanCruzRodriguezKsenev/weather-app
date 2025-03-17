"use client";

import { useState, FormEvent } from "react";
import { FormDialog } from "@/components/FormDialog/FormDialog";
import styles from "./UpdateCityFormdialog.module.css";
import { searchLocation } from "@/utils/locationIQ";
import { Location } from "@/utils/types";

interface SearchableFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    location: Location | null
  ) => void;
  title: string;
}

export function UpdateCityFormDialog({
  open,
  setOpen,
  onSubmit
}: SearchableFormDialogProps) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const handleSearch = async () => {
    try {
      const results = await searchLocation(query);
      setLocations(results);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setQuery(location.display_name);
    setLocations([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event, selectedLocation);
    setOpen(false);
  };

  return (
    <FormDialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={"Change City"}
    >
      <input
        type="text"
        placeholder="Search for a location"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />
      <button
        type="button"
        onClick={handleSearch}
        className={styles.searchButton}
      >
        Search
      </button>
      <ul className={styles.locationList}>
        {locations.map((location) => (
          <li
            key={location.place_id}
            onClick={() => handleSelectLocation(location)}
            className={styles.locationItem}
          >
            {location.display_name}
          </li>
        ))}
      </ul>
      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </FormDialog>
  );
}
