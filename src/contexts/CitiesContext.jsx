import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL as SERVER_URL, privateFetch } from "../services/privateFetch";

const BASE_URL = `${SERVER_URL}/api/cities`;

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "error":
      console.error(action.payload); //! TODO: Remove this line in production
      return { ...state, error: action.payload, isLoading: false };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city._id !== action.payload),
        isLoading: false,
      };
    case "city/updated":
      return {
        ...state,
        cities: state.cities.map((city) =>
          city._id === action.payload._id ? action.payload : city
        ),
        isLoading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const { user, refresh, token, logout } = useAuth();

  //* i will try to do it using useEffect first then try to do it in the next line.
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    { ...initialState, cities: user?.cities || [] }
  );

  useEffect(() => {
    if (!user) return;
    dispatch({ type: "loading" });
    if (user?.cities)
      dispatch({ type: "cities/loaded", payload: user?.cities });
    else dispatch({ type: "error", payload: "No Cities Found" });
  }, [user?.cities]);

  async function fetchWrapper(url = BASE_URL, options = {}) {
    const res = await privateFetch(url, options, token, refresh);
    if (res.code === 401) {
      console.log("u should login");
      logout();
      return false;
    }
    return res;
  }

  async function getCities() {
    dispatch({ type: "loading" });
    // return cities;
    // const res = await fetchWrapper();
    // if (res.error) dispatch({ type: "error", payload: res.error });
    dispatch({ type: "cities/loaded", payload: user?.cities || [] });
  }

  async function getCityById(id) {
    dispatch({ type: "loading" });

    // const res = await fetchWrapper(`${BASE_URL}/${id}`);
    // if (res.error) dispatch({ type: "error", payload: res.error });
    dispatch({
      type: "city/loaded",
      payload: cities.find((city) => city._id === id),
    });
  }

  async function addCity(city) {
    dispatch({ type: "loading" });

    const res = await fetchWrapper(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify(city),
    });
    // console.log("res: ", res);
    if (res.error) dispatch({ type: "error", payload: res.error });
    else dispatch({ type: "city/added", payload: res.data.city });
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    const res = await fetchWrapper(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (res.error) dispatch({ type: "error", payload: res.error });
    else dispatch({ type: "city/deleted", payload: id });
  }

  async function updateCity(city) {
    dispatch({ type: "loading" });

    const res = await fetchWrapper(`${BASE_URL}/${city._id}`, {
      method: "PUT",
      body: JSON.stringify(city),
    });
    if (res.error) dispatch({ type: "error", payload: res.error });
    else dispatch({ type: "city/updated", payload: res.data.city });
  }

  const value = useMemo(
    () => ({
      cities,
      currentCity,
      isLoading,
      error,
      getCities,
      getCityById,
      addCity,
      deleteCity,
      updateCity,
    }),
    [cities, currentCity, isLoading, error]
  );

  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities was used outside CitiesContext!");
  return context;
}

export { CitiesProvider, useCities };
