import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Homepage";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

import { CitiesProvider } from "./contexts/CitiesContext";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import Register from "./pages/Register";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <CitiesProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              <Route
                path="share/:id"
                element={
                    <AppLayout />
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                {/* <Route path="form" element={<Form />} /> */}
              </Route>

              <Route path="product" element={<Product />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="*" element={<PageNotFound />} />


            </Routes>
          </CitiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
