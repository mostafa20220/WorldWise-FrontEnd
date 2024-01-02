import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";
import { useEffect } from "react";
import { BASE_URL } from "../services/privateFetch";

function User() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!user) return null;

  const avatarUrl = `${BASE_URL}/api${user?.avatar}`;

  const msg = isAuthenticated
    ? `Welcome, ${user.firstName}`
    : `${user.firstName} ${user.lastName}`;

  return (
    <div className={styles.user}>
      <img src={avatarUrl} alt={user.firstName} />
      <span>{msg}</span>
      {isAuthenticated && (
        <button className={styles.logout} onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default User;
