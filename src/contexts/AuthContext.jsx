import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { BASE_URL, privateFetch } from "../services/privateFetch.js";
import { useLocation, useNavigate } from "react-router-dom";

const url = `${BASE_URL}/api/auth`;

const AuthContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    // case "registered":

    case "error":
      return {
        ...state,
        isError: true,
        error: action.payload,
        isLoading: false,
      };

    case "loading":
      return { ...state, isLoading: true };

    case "loggedIn":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "loggedOut":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "refreshed":
      return { ...state, token: action.payload };

    case "userUpdated":
      return { ...state, user: action.payload, isLoading: false };

    default:
      throw new Error(`Unknown action type!: ${action.type}`);
  }
}

// export let TOKEN = null;

const initialState = {
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
};

export default function AuthProvider({ children }) {
  const [
    { user, token, isAuthenticated, isLoading, isError, error },
    dispatch,
  ] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // get Access Token

    (async function () {
      if (location.pathname.includes("share")) {
        const id = location.pathname.split("/")[2];
        const url = `${BASE_URL}/api/users/${id}`;
        const res = await privateFetch(`${url}`, {});
        if (res.error) {
          console.error(res.error);
          navigate("/", { replace: true, state: { from: location } });
          return;
        }
        const { user } = res.data;
        dispatch({ type: "userUpdated", payload: user });
        return;
      }

      const url = `${BASE_URL}/api/auth/refresh`;
      const res = await privateFetch(`${url}`, {});
      if (res.error) {
        console.error(res.error);
        return;
      }

      const { user, token } = res.data;
      dispatch({ type: "loggedIn", payload: { user, token } });
    })();
  }, []);

  const register = async (userData) => {
    dispatch({ type: "loading" });
    const res = await privateFetch(`${url}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (res.error) {
      console.error(res.error);
      if (res.code === 500) {
        dispatch({
          type: "error",
          payload: "Internal Server Error, please try again later.",
        });
        return false;
      } else if (res.code !== 401) {
        dispatch({ type: "error", payload: res.error });
        return false;
      }
    }

    const { user, token } = res.data;
    dispatch({ type: "loggedIn", payload: { user: userData, token } });
    return true;
  };

  const login = async (userCredentials) => {
    dispatch({ type: "loading" });

    const res = await privateFetch(`${url}/login`, {
      method: "POST",
      body: JSON.stringify(userCredentials),
    });

    if (res.error) {
      console.log(res.error);
      if (res.code === 500) {
        dispatch({
          type: "error",
          payload: "Internal Server Error, please try again later.",
        });
        console.error(res.error);
        return false;
      } else if (res.code !== 401) {
        dispatch({ type: "error", payload: res.error });
        return false;
      }
    }

    const { user, token } = res.data;
    dispatch({ type: "loggedIn", payload: { user, token } });
    return true;
  };

  const logout = async () => {
    dispatch({ type: "loading" });
    const res = await privateFetch(`${url}/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.error) {
      console.log(res.error);
      if (res.code === 500) {
        dispatch({
          type: "error",
          payload: "Internal Server Error, please try again later.",
        });
        console.error(res.error);
        return false;
      } else if (res.code !== 401) {
        dispatch({ type: "error", payload: res.error });
        return false;
      }
    }

    dispatch({ type: "loggedOut" });
    navigate("/", { replace: true, state: { from: location } });
    return true;
  };

  const refresh = (token) => {
    dispatch({ type: "refreshed", payload: token });
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      isError,
      error,
      login,
      logout,
      refresh,
      register,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      isError,
      error,
      login,
      logout,
      refresh,
      register,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth was used outside AuthContext!");

  return context;
}

export { useAuth, AuthProvider };
