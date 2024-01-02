import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  const name = country.name.split("(")[0];
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{name}</span>
    </li>
  );
}

export default CountryItem;
