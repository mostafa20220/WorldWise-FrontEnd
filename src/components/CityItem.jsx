import styles from "./CityItem.module.css";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) => {
  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch (err) {
    console.error(err);
    return date;
  }
};

export default function CityItem({ city }) {
  const { cityName, emoji, date, position, _id } = city;
  const { currentCity, deleteCity } = useCities();
  const { lat, lng } = position;

  const isShareMode = useLocation().pathname.includes("share");

  function handleDeleteCity(e) {
    e.preventDefault();
    deleteCity(_id);
  }

  return (
    <li>
      <Link
        to={`${city._id}?lat=${lat}&lng=${lng}`}
        className={`${styles.cityItem}  ${
          currentCity._id === _id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        {!isShareMode && (
          <button className={styles.deleteBtn} onClick={handleDeleteCity}>
            &times;
          </button>
        )}
      </Link>
    </li>
  );
}
