import { useEffect, useState } from "react";
import Button from "../components/Button";
import Error from "../components/Error";
import PageNav from "../components/PageNav";
import styles from "./Auth.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {
    register,
    isAuthenticated,
    isLoading,
    isError,
    error: authError,
  } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const user = {
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      email,
      password,
    };

    await register(user);
    if (isError) setError(authError);
  }

  useEffect(() => {
    setError(authError);
  }, [authError]);

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated]);

  return (
    <main className={styles.register}>
      <PageNav />

      <section>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.col}>
              <label htmlFor="firstName">First Name</label>
              <input
                required
                type="text"
                id="firstName"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError(null);
                }}
                value={firstName}
                autoComplete="on"
              />
            </div>
            <div className={styles.col}>
              <label htmlFor="lastName">Last Name</label>
              <input
                required
                type="text"
                id="lastName"
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError(null);
                }}
                value={lastName}
                autoComplete="on"
              />
            </div>
          </div>
          <div className={styles.col}>
            <label htmlFor="email">Email Address</label>
            <input
              required
              type="email"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              value={email}
              autoComplete="on"
            />
          </div>
          <div className={styles.col}>
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              value={password}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Button type="primary" disabled={isLoading}>
              {isLoading ? "loading..." : "Register"}
            </Button>
            <p style={{ fontSize: "1.2rem" }}>
              you have an account already?{" "}
              <NavLink
                style={{
                  color: "var(--color-brand--2)",
                  textDecoration: "none",
                  fontWeight: "bolder",
                }}
                to="/login"
              >
                Login
              </NavLink>
            </p>
          </div>
          {error && <Error message={error} />}
          {isLoading && <Spinner />}
        </form>
      </section>
    </main>
  );
}
