import styles from "./Map.module.css";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

export default function Map() {
  const [lat, lng] = useUrlPosition();
  const [mapCenter, setMapCenter] = useState([lat || 51.505, lng || -0.09]);
  // const [zoom, setZoom] = useState(5);
  const [isMapClicked, setIsMapClicked] = useState(false);

  const { isAuthenticated } = useAuth();
  const { cities } = useCities();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar } = useSidebar();

  const [vKey, setVKey] = useState(0);

  const navigate = useNavigate();

  const {
    position: geolocationPosition,
    isLoading: isGeolocationLoading,
    error,
    getPosition,
  } = useGeolocation(cbOnSuccess);

  useEffect(() => {
    if (lat && lng) {
      if (!isMapClicked) setMapCenter([lat, lng]);
    }
    setIsMapClicked(false);
  }, [lat, lng]);

  useEffect(() => {
    // invalidate react-leaflet map size
    const id = setTimeout(() => setVKey(isSidebarOpen), 600);

    return () => {
      clearTimeout(id);
    };
  }, [isSidebarOpen]);

  function cbOnSuccess(lat, lng) {
    navigate(`form?lat=${lat}&lng=${lng}`);
  }

  return (
    <div
      className={`${styles.mapContainer} ${
        isSidebarOpen ? styles.active : ""
      } `}
    >
      {/* {!geolocationPosition && isAuthenticated && ( */}
      {isAuthenticated && (
        <Button
          type="position"
          onClick={() => {
            getPosition();
            !isSidebarOpen && toggleSidebar();
          }}
          style={isGeolocationLoading ? { backgroundColor: "#aeaed0" } : {}}
          className={styles.active}
        >
          {/* {isGeolocationLoading ? "Loading..." : "Use Your current location"} */}

          <img
            width="25"
            height="25"
            src="https://img.icons8.com/external-gliphyline-royyan-wijaya/64/external-gps-riot-van-gliphyline-royyan-wijaya-4.png"
            alt="loc."
          />
        </Button>
      )}
      <MapContainer
        center={mapCenter}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
         key={vKey}
         zoomControl={document.innerWidth > 700}
         
      >
        <TileLayer
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city._id}
          >
            <Popup>
              <span> {city.emoji}</span>
              <span>
                {city.cityName} <br />
                {city.notes}
              </span>
            </Popup>
          </Marker>
        ))}
        {isAuthenticated && (
          <DetectMapClicks
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            setIsMapClicked={setIsMapClicked}
          />
        )}
        <ChangeMapCenter
          mapCenter={mapCenter}
          isMapClicked={isMapClicked}
          setIsMapClicked={setIsMapClicked}
          setMapCenter={setMapCenter}
        />
      </MapContainer>
    </div>
  );
}

function DetectMapClicks({ isSidebarOpen, toggleSidebar, setIsMapClicked }) {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      if(window.innerWidth <= 700){
        toggleSidebar();
        if (isSidebarOpen) {
          setIsMapClicked(false);
          return;
        }
      }
      setIsMapClicked(true);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

function ChangeMapCenter({
  mapCenter,
  isMapClicked,
  setIsMapClicked,
  setMapCenter,
}) {
  const map = useMap();
  if (!isMapClicked) map.setView(mapCenter);
  else {
    setMapCenter(map.getCenter());
  }
  setIsMapClicked(false);
  return null;
}
