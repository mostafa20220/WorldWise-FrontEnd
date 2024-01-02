import { NavLink, useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Auth.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Error from "../components/Error";
import Spinner from "../components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {
    login,
    isAuthenticated,
    isLoading,
    isError,
    error: authError,
  } = useAuth();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password });
  }

  useEffect(() => {
    setError(authError);
  }, [authError]);

  useEffect(() => {
    // setError(null);
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated]);

  return (
    <main className={styles.login}>
      <PageNav />

      <section>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.col}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              value={email}
              required
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
              {isLoading ? "loading..." : "login"}
            </Button>
            <p style={{ fontSize: "1.2rem" }}>
              Don't have an account?{" "}
              <NavLink
                style={{
                  color: "var(--color-brand--2)",
                  textDecoration: "none",
                  fontWeight: "bolder",
                }}
                to="/register"
              >
                Sign Up
              </NavLink>
            </p>
          </div>

          {error && <Error message={authError} />}
          {isLoading && <Spinner />}
        </form>
      </section>
    </main>
  );
}
