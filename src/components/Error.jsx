import styles from "./Error.module.css";

function Error({message }) {
  return (
    <p className={styles.message}>
      <span role="img">⛔</span> {message}
    </p>
  );
}

export default Error;

