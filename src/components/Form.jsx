// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-date-picker";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isReversedGeoPositionLoading, setIsReversedGeoPositionLoading] =
    useState(false);
  const [error, setError] = useState("");

  const { addCity, isLoading: isCityLoading } = useCities();

  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();

  useEffect(() => {
    if (lat && lng) {
      setError("");
      setIsReversedGeoPositionLoading(true);
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status >= 400 && data.status < 500) {
            throw new Error(data.message);
          }
          if (!data.countryCode)
            throw new Error(
              "This place is in the middle of nowhere!\n Please select a city on the map."
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        })
        .catch((error) => {
          error = error.message || error.description;
          setError(error);
          console.error(error);
        })
        .finally(() => {
          setIsReversedGeoPositionLoading(false);
        });
    }
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
      // id: parseInt(Math.random() * 10**5),
    };

    try {
      await addCity(newCity);
      navigate(`/app/cities`);
    } catch (error) {
      console.error(error);
      setError(error.message || error.description);
    }
  };

  if (isReversedGeoPositionLoading) return <Spinner />;
  if (error) return <Message message={error} />;
  if (!lat || !lng)
    return <Message message="Please select a city on the map." />;

  return (
    <form
      className={` ${styles.form} ${isCityLoading ? styles.loading : ""} `}
      onSubmit={handleSubmit}
    >
      <div style={{position: "relative"}} className={styles.col}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
          required
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div style={{ fontSize: "1.8rem" }} className={styles.col}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <br />
        <DatePicker
          className={styles.datePicker}
          id="date"
          onChange={(d) => setDate(d)}
          value={date}
          required
          format="dd/MM/y"
          maxDate={new Date()}
        />
      </div>

      <div className={styles.col}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary"> Add </Button>
        <BackButton backTo={"/app"}/>
      </div>
    </form>
  );
}

export default Form;
