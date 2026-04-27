import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import axios from "axios";
import { ref, onValue } from "firebase/database";
import { realDb } from "../firebase";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = { lat: 33.6844, lng: 73.0479 };

const getSeverity = (value) => {
  if (value >= 200) {
    return { color: "#dc3545", label: "High Risk" };
  }
  if (value >= 100) {
    return { color: "#ffc107", label: "Medium Risk" };
  }
  return { color: "#198754", label: "Low Risk" };
};

const metersToLat = (meters) => meters / 111320;

const metersToLng = (meters, lat) =>
  meters / (111320 * Math.cos((lat * Math.PI) / 180));

const getCirclePath = (lat, lng, radiusMeters = 1000, points = 60) => {
  const path = [];

  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;
    const dLat = metersToLat(radiusMeters * Math.sin(angle));
    const dLng = metersToLng(radiusMeters * Math.cos(angle), lat);

    path.push({
      lat: lat + dLat,
      lng: lng + dLng,
    });
  }

  return path;
};

const getRectanglePath = (
  lat,
  lng,
  widthMeters = 1800,
  heightMeters = 1800,
) => {
  const halfLat = metersToLat(heightMeters / 2);
  const halfLng = metersToLng(widthMeters / 2, lat);

  return [
    { lat: lat + halfLat, lng: lng - halfLng },
    { lat: lat + halfLat, lng: lng + halfLng },
    { lat: lat - halfLat, lng: lng + halfLng },
    { lat: lat - halfLat, lng: lng - halfLng },
  ];
};

const getDiamondPath = (lat, lng, sizeMeters = 1200) => {
  const dLat = metersToLat(sizeMeters);
  const dLng = metersToLng(sizeMeters, lat);

  return [
    { lat: lat + dLat, lng },
    { lat, lng: lng + dLng },
    { lat: lat - dLat, lng },
    { lat, lng: lng - dLng },
  ];
};

const getTrianglePath = (lat, lng, sizeMeters = 1300) => {
  const topLat = metersToLat(sizeMeters);
  const sideLat = metersToLat(sizeMeters * 0.8);
  const sideLng = metersToLng(sizeMeters * 0.9, lat);

  return [
    { lat: lat + topLat, lng },
    { lat: lat - sideLat, lng: lng - sideLng },
    { lat: lat - sideLat, lng: lng + sideLng },
  ];
};

const getHexagonPath = (lat, lng, sizeMeters = 1100) => {
  const path = [];

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const dLat = metersToLat(sizeMeters * Math.sin(angle));
    const dLng = metersToLng(sizeMeters * Math.cos(angle), lat);

    path.push({
      lat: lat + dLat,
      lng: lng + dLng,
    });
  }

  return path;
};

const ShapeOverlay = ({ sensor, severity, selectedShape }) => {
  const commonOptions = {
    fillColor: severity.color,
    fillOpacity: 0.25,
    strokeColor: severity.color,
    strokeOpacity: 0.95,
    strokeWeight: 2,
    clickable: false,
  };

  let paths = [];

  switch (selectedShape) {
    case "circle":
      paths = getCirclePath(sensor.lat, sensor.lng, 1000, 60);
      break;
    case "rectangle":
      paths = getRectanglePath(sensor.lat, sensor.lng, 1800, 1800);
      break;
    case "diamond":
      paths = getDiamondPath(sensor.lat, sensor.lng, 1200);
      break;
    case "triangle":
      paths = getTrianglePath(sensor.lat, sensor.lng, 1300);
      break;
    case "hexagon":
      paths = getHexagonPath(sensor.lat, sensor.lng, 1100);
      break;
    default:
      paths = getHexagonPath(sensor.lat, sensor.lng, 1100);
  }

  return (
    <Polygon
      key={`${sensor.id}-${selectedShape}`}
      paths={paths}
      options={commonOptions}
    />
  );
};

const MapScreen = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [weatherPoint, setWeatherPoint] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [selectedShape, setSelectedShape] = useState("hexagon");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const sensorsRef = ref(realDb, "/");

    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data || data.lat === undefined || data.lon === undefined) {
          setSensors([]);
          return;
        }

        const sensorRow = {
          id: "sensor-1",
          name: "Live Sensor",
          lat: Number(data.lat),
          lng: Number(data.lon),
          CO2_Levels: Number(data.CO2_Levels ?? 0),
          Humidity_Sensor: Number(data.Humidity_Sensor ?? 0),
          Tempature_Sensor: Number(data.Tempature_Sensor ?? 0),
          MQ135: Number(data.MQ135 ?? 0),
        };

        setSensors([sensorRow]);
      },
      (error) => {
        console.error("Realtime DB error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setWeatherPoint({ lat, lng });
    setSelectedSensor(null); // Sensor info band kar dein jab map pe click ho
    setWeatherLoading(true);
    setWeather(null);

    try {
      // OpenWeather API Call
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      console.error("Weather error:", error);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const mapCenter =
    sensors.length > 0
      ? { lat: sensors[0].lat, lng: sensors[0].lng }
      : DEFAULT_CENTER;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            marginLeft: "250px",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(to bottom, #3498db, #2c3e50)",
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              gap: "15px",
            }}
          >
            <div className="card shadow-sm border-0">
              <div className="card-body py-3 text-center">
                <h2 className="card-title fw-bold text-dark mb-2">
                  Live Sensors + Region Clusters
                </h2>
                <p className="text-muted mb-3 small">
                  Live marker and selectable risk area shape from Firebase.
                </p>

                <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                  <label htmlFor="shapeSelect" className="fw-semibold mb-0">
                    Select Shape:
                  </label>

                  <select
                    id="shapeSelect"
                    className="form-select"
                    style={{ maxWidth: "220px" }}
                    value={selectedShape}
                    onChange={(e) => setSelectedShape(e.target.value)}
                  >
                    <option value="circle">Circle</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="diamond">Diamond</option>
                    <option value="triangle">Triangle</option>
                    <option value="hexagon">Hexagon</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              className="card shadow-lg border-0"
              style={{
                flex: 1,
                padding: "5px",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={12}
                  onClick={onMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {sensors.map((sensor) => {
                    const severity = getSeverity(sensor.CO2_Levels);

                    return (
                      <React.Fragment key={sensor.id}>
                        <Marker
                          position={{ lat: sensor.lat, lng: sensor.lng }}
                          label="S"
                          onClick={() => setSelectedSensor(sensor)}
                        />

                        <ShapeOverlay
                          sensor={sensor}
                          severity={severity}
                          selectedShape={selectedShape}
                        />
                      </React.Fragment>
                    );
                  })}

                  {selectedSensor && (
                    <InfoWindow
                      position={{
                        lat: selectedSensor.lat,
                        lng: selectedSensor.lng,
                      }}
                      onCloseClick={() => setSelectedSensor(null)}
                    >
                      <div style={{ minWidth: "230px" }}>
                        <h6 className="fw-bold mb-2">{selectedSensor.name}</h6>
                        <p className="mb-1">
                          <strong>CO2:</strong> {selectedSensor.CO2_Levels}
                        </p>
                        <p className="mb-1">
                          <strong>Humidity:</strong>{" "}
                          {selectedSensor.Humidity_Sensor}%
                        </p>
                        <p className="mb-1">
                          <strong>Temperature:</strong>{" "}
                          {selectedSensor.Tempature_Sensor}°C
                        </p>
                        <p className="mb-1">
                          <strong>MQ135:</strong> {selectedSensor.MQ135}
                        </p>
                      </div>
                    </InfoWindow>
                  )}

                  {weatherPoint && <Marker position={weatherPoint} />}

                  {weatherPoint && (
                    <InfoWindow
                      position={weatherPoint}
                      onCloseClick={() => {
                        setWeatherPoint(null);
                        setWeather(null);
                      }}
                    >
                      <div style={{ minWidth: "220px", padding: "5px" }}>
                        {weatherLoading ? (
                          <div className="text-center p-3">
                            <div
                              className="spinner-border spinner-border-sm text-primary"
                              role="status"
                            ></div>
                            <p className="mt-2 mb-0 small">
                              Fetching Weather...
                            </p>
                          </div>
                        ) : weather ? (
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <h6
                                className="fw-bold mb-0"
                                style={{ color: "#2c3e50" }}
                              >
                                {weather.name || "Unknown Location"}
                              </h6>
                              <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                alt="weather icon"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>

                            <div
                              className="p-2 rounded shadow-sm"
                              style={{ backgroundColor: "#f8f9fa" }}
                            >
                              <p className="mb-1 d-flex justify-content-between">
                                <span className="text-muted small">
                                  Temperature:
                                </span>
                                <span className="fw-bold text-primary">
                                  {Math.round(weather.main.temp)}°C
                                </span>
                              </p>
                              <p className="mb-1 d-flex justify-content-between">
                                <span className="text-muted small">
                                  Feels Like:
                                </span>
                                <span className="fw-bold text-secondary">
                                  {Math.round(weather.main.feels_like)}°C
                                </span>
                              </p>
                              <p className="mb-1 d-flex justify-content-between">
                                <span className="text-muted small">
                                  Humidity:
                                </span>
                                <span className="fw-bold text-info">
                                  {weather.main.humidity}%
                                </span>
                              </p>
                              <p className="mb-1 d-flex justify-content-between">
                                <span className="text-muted small">
                                  Wind Speed:
                                </span>
                                <span className="fw-bold text-dark">
                                  {weather.wind.speed} m/s
                                </span>
                              </p>
                              <hr className="my-2" />
                              <p className="mb-0 text-capitalize text-center small fw-bold text-success">
                                {weather.weather[0].description}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-danger small">
                            Weather data not available.
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div
                    className="spinner-grow text-primary"
                    role="status"
                  ></div>
                  <span className="ms-3 text-muted">Loading Maps...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
