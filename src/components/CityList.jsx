import React from "react";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

export default function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return (
      <Message message="To get started, add a city by clicking on a city on the map" />
    );

  const reversedCities = structuredClone(cities).reverse();

  return (
    <ul className={styles.cityList}>
      {reversedCities.map((city) => (
        <CityItem key={city._id} city={city}></CityItem>
      ))}
    </ul>
  );
}
