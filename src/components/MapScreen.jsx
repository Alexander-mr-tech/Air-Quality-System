// import React, { useState, useEffect, useCallback } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   InfoWindow,
//   Marker,
//   Polygon,
// } from "@react-google-maps/api";
// import axios from "axios";
// import { ref, onValue } from "firebase/database";
// import { realDb } from "../firebase";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";

// const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const DEFAULT_CENTER = { lat: 33.6844, lng: 73.0479 };

// const getSeverity = (value) => {
//   if (value >= 200) {
//     return { color: "#dc3545", label: "High Risk" };
//   }
//   if (value >= 100) {
//     return { color: "#ffc107", label: "Medium Risk" };
//   }
//   return { color: "#198754", label: "Low Risk" };
// };

// const metersToLat = (meters) => meters / 111320;

// const metersToLng = (meters, lat) =>
//   meters / (111320 * Math.cos((lat * Math.PI) / 180));

// const getCirclePath = (lat, lng, radiusMeters = 1000, points = 60) => {
//   const path = [];

//   for (let i = 0; i < points; i++) {
//     const angle = (2 * Math.PI * i) / points;
//     const dLat = metersToLat(radiusMeters * Math.sin(angle));
//     const dLng = metersToLng(radiusMeters * Math.cos(angle), lat);

//     path.push({
//       lat: lat + dLat,
//       lng: lng + dLng,
//     });
//   }

//   return path;
// };

// const getRectanglePath = (
//   lat,
//   lng,
//   widthMeters = 1800,
//   heightMeters = 1800,
// ) => {
//   const halfLat = metersToLat(heightMeters / 2);
//   const halfLng = metersToLng(widthMeters / 2, lat);

//   return [
//     { lat: lat + halfLat, lng: lng - halfLng },
//     { lat: lat + halfLat, lng: lng + halfLng },
//     { lat: lat - halfLat, lng: lng + halfLng },
//     { lat: lat - halfLat, lng: lng - halfLng },
//   ];
// };

// const getDiamondPath = (lat, lng, sizeMeters = 1200) => {
//   const dLat = metersToLat(sizeMeters);
//   const dLng = metersToLng(sizeMeters, lat);

//   return [
//     { lat: lat + dLat, lng },
//     { lat, lng: lng + dLng },
//     { lat: lat - dLat, lng },
//     { lat, lng: lng - dLng },
//   ];
// };

// const getTrianglePath = (lat, lng, sizeMeters = 1300) => {
//   const topLat = metersToLat(sizeMeters);
//   const sideLat = metersToLat(sizeMeters * 0.8);
//   const sideLng = metersToLng(sizeMeters * 0.9, lat);

//   return [
//     { lat: lat + topLat, lng },
//     { lat: lat - sideLat, lng: lng - sideLng },
//     { lat: lat - sideLat, lng: lng + sideLng },
//   ];
// };

// const getHexagonPath = (lat, lng, sizeMeters = 1100) => {
//   const path = [];

//   for (let i = 0; i < 6; i++) {
//     const angle = (Math.PI / 3) * i;
//     const dLat = metersToLat(sizeMeters * Math.sin(angle));
//     const dLng = metersToLng(sizeMeters * Math.cos(angle), lat);

//     path.push({
//       lat: lat + dLat,
//       lng: lng + dLng,
//     });
//   }

//   return path;
// };

// const ShapeOverlay = ({ sensor, severity, selectedShape }) => {
//   const commonOptions = {
//     fillColor: severity.color,
//     fillOpacity: 0.25,
//     strokeColor: severity.color,
//     strokeOpacity: 0.95,
//     strokeWeight: 2,
//     clickable: false,
//   };

//   let paths = [];

//   switch (selectedShape) {
//     case "circle":
//       paths = getCirclePath(sensor.lat, sensor.lng, 1000, 60);
//       break;
//     case "rectangle":
//       paths = getRectanglePath(sensor.lat, sensor.lng, 1800, 1800);
//       break;
//     case "diamond":
//       paths = getDiamondPath(sensor.lat, sensor.lng, 1200);
//       break;
//     case "triangle":
//       paths = getTrianglePath(sensor.lat, sensor.lng, 1300);
//       break;
//     case "hexagon":
//       paths = getHexagonPath(sensor.lat, sensor.lng, 1100);
//       break;
//     default:
//       paths = getHexagonPath(sensor.lat, sensor.lng, 1100);
//   }

//   return (
//     <Polygon
//       key={`${sensor.id}-${selectedShape}`}
//       paths={paths}
//       options={commonOptions}
//     />
//   );
// };

// const MapScreen = () => {
//   const [sensors, setSensors] = useState([]);
//   const [selectedSensor, setSelectedSensor] = useState(null);
//   const [weatherPoint, setWeatherPoint] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const [selectedShape, setSelectedShape] = useState("hexagon");

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//   });

//   useEffect(() => {
//     const sensorsRef = ref(realDb, "/");

//     const unsubscribe = onValue(
//       sensorsRef,
//       (snapshot) => {
//         const data = snapshot.val();

//         if (!data || data.lat === undefined || data.lon === undefined) {
//           setSensors([]);
//           return;
//         }

//         const sensorRow = {
//           id: "sensor-1",
//           name: "Live Sensor",
//           lat: Number(data.lat),
//           lng: Number(data.lon),
//           CO2_Levels: Number(data.CO2_Levels ?? 0),
//           Humidity_Sensor: Number(data.Humidity_Sensor ?? 0),
//           Tempature_Sensor: Number(data.Tempature_Sensor ?? 0),
//           MQ135: Number(data.MQ135 ?? 0),
//         };

//         setSensors([sensorRow]);
//       },
//       (error) => {
//         console.error("Realtime DB error:", error);
//       },
//     );

//     return () => unsubscribe();
//   }, []);

//   const onMapClick = useCallback(async (e) => {
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();

//     setWeatherPoint({ lat, lng });
//     setSelectedSensor(null); // Sensor info band kar dein jab map pe click ho
//     setWeatherLoading(true);
//     setWeather(null);

//     try {
//       // OpenWeather API Call
//       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
//       const response = await axios.get(url);
//       setWeather(response.data);
//     } catch (error) {
//       console.error("Weather error:", error);
//     } finally {
//       setWeatherLoading(false);
//     }
//   }, []);

//   const mapCenter =
//     sensors.length > 0
//       ? { lat: sensors[0].lat, lng: sensors[0].lng }
//       : DEFAULT_CENTER;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       <Navbar />

//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar />

//         <div
//           style={{
//             flex: 1,
//             marginLeft: "250px",
//             display: "flex",
//             flexDirection: "column",
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)",
//             padding: "20px",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               maxWidth: "1200px",
//               margin: "0 auto",
//               display: "flex",
//               flexDirection: "column",
//               height: "100%",
//               gap: "15px",
//             }}
//           >
//             <div className="card shadow-sm border-0">
//               <div className="card-body py-3 text-center">
//                 <h2 className="card-title fw-bold text-dark mb-2">
//                   Live Sensors + Region Clusters
//                 </h2>
//                 <p className="text-muted mb-3 small">
//                   Live marker and selectable risk area shape from Firebase.
//                 </p>

//                 <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
//                   <label htmlFor="shapeSelect" className="fw-semibold mb-0">
//                     Select Shape:
//                   </label>

//                   <select
//                     id="shapeSelect"
//                     className="form-select"
//                     style={{ maxWidth: "220px" }}
//                     value={selectedShape}
//                     onChange={(e) => setSelectedShape(e.target.value)}
//                   >
//                     <option value="circle">Circle</option>
//                     <option value="rectangle">Rectangle</option>
//                     <option value="diamond">Diamond</option>
//                     <option value="triangle">Triangle</option>
//                     <option value="hexagon">Hexagon</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div
//               className="card shadow-lg border-0"
//               style={{
//                 flex: 1,
//                 padding: "5px",
//                 borderRadius: "15px",
//                 overflow: "hidden",
//               }}
//             >
//               {isLoaded ? (
//                 <GoogleMap
//                   mapContainerStyle={{ width: "100%", height: "100%" }}
//                   center={mapCenter}
//                   zoom={12}
//                   onClick={onMapClick}
//                   options={{
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                   }}
//                 >
//                   {sensors.map((sensor) => {
//                     const severity = getSeverity(sensor.CO2_Levels);

//                     return (
//                       <React.Fragment key={sensor.id}>
//                         <Marker
//                           position={{ lat: sensor.lat, lng: sensor.lng }}
//                           label="S"
//                           onClick={() => setSelectedSensor(sensor)}
//                         />

//                         <ShapeOverlay
//                           sensor={sensor}
//                           severity={severity}
//                           selectedShape={selectedShape}
//                         />
//                       </React.Fragment>
//                     );
//                   })}

//                   {selectedSensor && (
//                     <InfoWindow
//                       position={{
//                         lat: selectedSensor.lat,
//                         lng: selectedSensor.lng,
//                       }}
//                       onCloseClick={() => setSelectedSensor(null)}
//                     >
//                       <div style={{ minWidth: "230px" }}>
//                         <h6 className="fw-bold mb-2">{selectedSensor.name}</h6>
//                         <p className="mb-1">
//                           <strong>CO2:</strong> {selectedSensor.CO2_Levels}
//                         </p>
//                         <p className="mb-1">
//                           <strong>Humidity:</strong>{" "}
//                           {selectedSensor.Humidity_Sensor}%
//                         </p>
//                         <p className="mb-1">
//                           <strong>Temperature:</strong>{" "}
//                           {selectedSensor.Tempature_Sensor}°C
//                         </p>
//                         <p className="mb-1">
//                           <strong>MQ135:</strong> {selectedSensor.MQ135}
//                         </p>
//                       </div>
//                     </InfoWindow>
//                   )}

//                   {weatherPoint && <Marker position={weatherPoint} />}

//                   {weatherPoint && (
//                     <InfoWindow
//                       position={weatherPoint}
//                       onCloseClick={() => {
//                         setWeatherPoint(null);
//                         setWeather(null);
//                       }}
//                     >
//                       <div style={{ minWidth: "220px", padding: "5px" }}>
//                         {weatherLoading ? (
//                           <div className="text-center p-3">
//                             <div
//                               className="spinner-border spinner-border-sm text-primary"
//                               role="status"
//                             ></div>
//                             <p className="mt-2 mb-0 small">
//                               Fetching Weather...
//                             </p>
//                           </div>
//                         ) : weather ? (
//                           <div>
//                             <div className="d-flex align-items-center justify-content-between mb-2">
//                               <h6
//                                 className="fw-bold mb-0"
//                                 style={{ color: "#2c3e50" }}
//                               >
//                                 {weather.name || "Unknown Location"}
//                               </h6>
//                               <img
//                                 src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
//                                 alt="weather icon"
//                                 style={{ width: "40px", height: "40px" }}
//                               />
//                             </div>

//                             <div
//                               className="p-2 rounded shadow-sm"
//                               style={{ backgroundColor: "#f8f9fa" }}
//                             >
//                               <p className="mb-1 d-flex justify-content-between">
//                                 <span className="text-muted small">
//                                   Temperature:
//                                 </span>
//                                 <span className="fw-bold text-primary">
//                                   {Math.round(weather.main.temp)}°C
//                                 </span>
//                               </p>
//                               <p className="mb-1 d-flex justify-content-between">
//                                 <span className="text-muted small">
//                                   Feels Like:
//                                 </span>
//                                 <span className="fw-bold text-secondary">
//                                   {Math.round(weather.main.feels_like)}°C
//                                 </span>
//                               </p>
//                               <p className="mb-1 d-flex justify-content-between">
//                                 <span className="text-muted small">
//                                   Humidity:
//                                 </span>
//                                 <span className="fw-bold text-info">
//                                   {weather.main.humidity}%
//                                 </span>
//                               </p>
//                               <p className="mb-1 d-flex justify-content-between">
//                                 <span className="text-muted small">
//                                   Wind Speed:
//                                 </span>
//                                 <span className="fw-bold text-dark">
//                                   {weather.wind.speed} m/s
//                                 </span>
//                               </p>
//                               <hr className="my-2" />
//                               <p className="mb-0 text-capitalize text-center small fw-bold text-success">
//                                 {weather.weather[0].description}
//                               </p>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-danger small">
//                             Weather data not available.
//                           </div>
//                         )}
//                       </div>
//                     </InfoWindow>
//                   )}
//                 </GoogleMap>
//               ) : (
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                   <div
//                     className="spinner-grow text-primary"
//                     role="status"
//                   ></div>
//                   <span className="ms-3 text-muted">Loading Maps...</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapScreen;


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
  if (value >= 200) return { color: "#f87171", label: "High Risk" };
  if (value >= 100) return { color: "#fbbf24", label: "Medium Risk" };
  return { color: "#4ade80", label: "Low Risk" };
};

const metersToLat = (m) => m / 111320;
const metersToLng = (m, lat) => m / (111320 * Math.cos((lat * Math.PI) / 180));

const getCirclePath    = (lat, lng, r = 1000, pts = 60) => Array.from({ length: pts }, (_, i) => { const a = (2 * Math.PI * i) / pts; return { lat: lat + metersToLat(r * Math.sin(a)), lng: lng + metersToLng(r * Math.cos(a), lat) }; });
const getRectanglePath = (lat, lng, w = 1800, h = 1800) => { const dLat = metersToLat(h / 2), dLng = metersToLng(w / 2, lat); return [{ lat: lat + dLat, lng: lng - dLng }, { lat: lat + dLat, lng: lng + dLng }, { lat: lat - dLat, lng: lng + dLng }, { lat: lat - dLat, lng: lng - dLng }]; };
const getDiamondPath   = (lat, lng, s = 1200) => [{ lat: lat + metersToLat(s), lng }, { lat, lng: lng + metersToLng(s, lat) }, { lat: lat - metersToLat(s), lng }, { lat, lng: lng - metersToLng(s, lat) }];
const getTrianglePath  = (lat, lng, s = 1300) => [{ lat: lat + metersToLat(s), lng }, { lat: lat - metersToLat(s * 0.8), lng: lng - metersToLng(s * 0.9, lat) }, { lat: lat - metersToLat(s * 0.8), lng: lng + metersToLng(s * 0.9, lat) }];
const getHexagonPath   = (lat, lng, s = 1100) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i; return { lat: lat + metersToLat(s * Math.sin(a)), lng: lng + metersToLng(s * Math.cos(a), lat) }; });

const ShapeOverlay = ({ sensor, severity, selectedShape }) => {
  const opts = { fillColor: severity.color, fillOpacity: 0.2, strokeColor: severity.color, strokeOpacity: 0.9, strokeWeight: 1.5, clickable: false };
  const paths = {
    circle: getCirclePath(sensor.lat, sensor.lng),
    rectangle: getRectanglePath(sensor.lat, sensor.lng),
    diamond: getDiamondPath(sensor.lat, sensor.lng),
    triangle: getTrianglePath(sensor.lat, sensor.lng),
    hexagon: getHexagonPath(sensor.lat, sensor.lng),
  }[selectedShape] || getHexagonPath(sensor.lat, sensor.lng);
  return <Polygon key={`${sensor.id}-${selectedShape}`} paths={paths} options={opts} />;
};

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0a1628" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#042535" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#546e7a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#0d2137" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#051523" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#3d5a6b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#041830" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "var(--dot)" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#061d2e" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#071d25" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#051523" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "var(--accent)" }, { weight: 0.5 }] },
];

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
    const unsubscribe = onValue(ref(realDb, "/"), (snapshot) => {
      const data = snapshot.val();
      if (!data || data.lat === undefined || data.lon === undefined) { setSensors([]); return; }
      setSensors([{
        id: "sensor-1", name: "Live Sensor",
        lat: Number(data.lat), lng: Number(data.lon),
        CO2_Levels: Number(data.CO2_Levels ?? 0),
        Humidity_Sensor: Number(data.Humidity_Sensor ?? 0),
        Tempature_Sensor: Number(data.Tempature_Sensor ?? 0),
        MQ135: Number(data.MQ135 ?? 0),
      }]);
    }, (err) => console.error("Realtime DB error:", err));
    return () => unsubscribe();
  }, []);

  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat(), lng = e.latLng.lng();
    setWeatherPoint({ lat, lng });
    setSelectedSensor(null);
    setWeatherLoading(true);
    setWeather(null);
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`);
      setWeather(res.data);
    } catch (err) {
      console.error("Weather error:", err);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const mapCenter = sensors.length > 0 ? { lat: sensors[0].lat, lng: sensors[0].lng } : DEFAULT_CENTER;

  const font = "'Inter','Segoe UI',sans-serif";

  const infoCard = {
    background: "var(--card)",
    borderRadius: "10px",
    padding: "14px",
    minWidth: "220px",
    fontFamily: font,
    color: "#fff",
  };

  const infoRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    fontSize: "13px",
  };

  const shapes = ["circle", "rectangle", "diamond", "triangle", "hexagon"];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden",
      background: "var(--bg)",
      fontFamily: font,
    }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div style={{
          flex: 1,
          marginLeft: "240px",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          gap: "16px",
          overflow: "hidden",
        }}>

          {/* ── Header bar ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: 0 }}>
                Live Map
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
                Real-time sensor location &amp; region risk overlay
              </p>
            </div>

            {/* Shape selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                Risk Shape:
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedShape(s)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "7px",
                      fontSize: "11px",
                      fontWeight: "600",
                      fontFamily: font,
                      textTransform: "capitalize",
                      cursor: "pointer",
                      border: selectedShape === s
                        ? "0.5px solid rgba(74,158,255,0.6)"
                        : "0.5px solid rgba(255,255,255,0.1)",
                      background: selectedShape === s
                        ? "var(--border)"
                        : "rgba(255,255,255,0.04)",
                      color: selectedShape === s ? "var(--dot)" : "rgba(255,255,255,0.45)",
                      transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Map container ── */}
          <div style={{
            flex: 1,
            borderRadius: "14px",
            overflow: "hidden",
            border: "0.5px solid rgba(74,158,255,0.2)",
            position: "relative",
            minHeight: 0,
          }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={12}
                onClick={onMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControlOptions: { position: 3 },
                  styles: MAP_STYLES,
                }}
              >
                {sensors.map((sensor) => {
                  const severity = getSeverity(sensor.CO2_Levels);
                  return (
                    <React.Fragment key={sensor.id}>
                      <Marker
                        position={{ lat: sensor.lat, lng: sensor.lng }}
                        onClick={() => setSelectedSensor(sensor)}
                        icon={{
                          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                          fillColor: "var(--dot)",
                          fillOpacity: 1,
                          strokeColor: "#fff",
                          strokeWeight: 1.5,
                          scale: 1.4,
                          anchor: { x: 12, y: 22 },
                        }}
                      />
                      <ShapeOverlay sensor={sensor} severity={severity} selectedShape={selectedShape} />
                    </React.Fragment>
                  );
                })}

                {/* Sensor InfoWindow */}
                {selectedSensor && (
                  <InfoWindow
                    position={{ lat: selectedSensor.lat, lng: selectedSensor.lng }}
                    onCloseClick={() => setSelectedSensor(null)}
                    options={{ pixelOffset: { width: 0, height: -32 } }}
                  >
                    <div style={infoCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: "#4ade80", boxShadow: "0 0 6px #4ade80",
                        }} />
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
                          {selectedSensor.name}
                        </span>
                      </div>
                      {[
                        { label: "CO₂",         val: `${selectedSensor.CO2_Levels} ppm`, color: "#a78bfa" },
                        { label: "Humidity",     val: `${selectedSensor.Humidity_Sensor}%`, color: "var(--dot)" },
                        { label: "Temperature",  val: `${selectedSensor.Tempature_Sensor}°C`, color: "#fbbf24" },
                        { label: "MQ135",        val: `${selectedSensor.MQ135}`, color: "#4ade80" },
                      ].map((r) => (
                        <div key={r.label} style={infoRow}>
                          <span style={{ color: "rgba(255,255,255,0.45)" }}>{r.label}</span>
                          <span style={{ fontWeight: "600", color: r.color }}>{r.val}</span>
                        </div>
                      ))}
                      {/* Risk badge */}
                      <div style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        textAlign: "center",
                        background: `${getSeverity(selectedSensor.CO2_Levels).color}20`,
                        border: `0.5px solid ${getSeverity(selectedSensor.CO2_Levels).color}50`,
                        color: getSeverity(selectedSensor.CO2_Levels).color,
                      }}>
                        {getSeverity(selectedSensor.CO2_Levels).label}
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {/* Weather marker */}
                {weatherPoint && (
                  <Marker
                    position={weatherPoint}
                    icon={{
                      path: "M12 2a10 10 0 100 20A10 10 0 0012 2z",
                      fillColor: "#fbbf24",
                      fillOpacity: 0.9,
                      strokeColor: "#fff",
                      strokeWeight: 1.5,
                      scale: 0.9,
                      anchor: { x: 12, y: 12 },
                    }}
                  />
                )}

                {weatherPoint && (
                  <InfoWindow
                    position={weatherPoint}
                    onCloseClick={() => { setWeatherPoint(null); setWeather(null); }}
                    options={{ pixelOffset: { width: 0, height: -20 } }}
                  >
                    <div style={infoCard}>
                      {weatherLoading ? (
                        <div style={{ textAlign: "center", padding: "12px 0" }}>
                          <div style={{
                            width: "24px", height: "24px", borderRadius: "50%",
                            border: "2px solid rgba(74,158,255,0.3)",
                            borderTopColor: "var(--dot)",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 8px",
                          }} />
                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                            Fetching weather...
                          </p>
                        </div>
                      ) : weather ? (
                        <>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
                              {weather.name || "Unknown"}
                            </span>
                            <img
                              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                              alt="icon" style={{ width: "36px", height: "36px" }}
                            />
                          </div>
                          {[
                            { label: "Temperature", val: `${Math.round(weather.main.temp)}°C`,        color: "#fbbf24" },
                            { label: "Feels Like",  val: `${Math.round(weather.main.feels_like)}°C`,  color: "#f87171" },
                            { label: "Humidity",    val: `${weather.main.humidity}%`,                  color: "var(--dot)" },
                            { label: "Wind Speed",  val: `${weather.wind.speed} m/s`,                 color: "#4ade80" },
                          ].map((r) => (
                            <div key={r.label} style={infoRow}>
                              <span style={{ color: "rgba(255,255,255,0.45)" }}>{r.label}</span>
                              <span style={{ fontWeight: "600", color: r.color }}>{r.val}</span>
                            </div>
                          ))}
                          <div style={{
                            marginTop: "10px", padding: "5px 10px", borderRadius: "6px",
                            background: "rgba(74,158,255,0.1)", border: "0.5px solid rgba(74,158,255,0.2)",
                            fontSize: "11px", fontWeight: "600", textAlign: "center",
                            color: "var(--dot)", textTransform: "capitalize",
                          }}>
                            {weather.weather[0].description}
                          </div>
                        </>
                      ) : (
                        <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>
                          Weather data not available.
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "100%", flexDirection: "column", gap: "14px",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: "2px solid rgba(74,158,255,0.3)",
                  borderTopColor: "var(--dot)",
                  animation: "spin 0.8s linear infinite",
                }} />
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Loading Maps...</span>
              </div>
            )}

            {/* Legend overlay */}
            <div style={{
              position: "absolute", bottom: "16px", left: "16px",
              background: "var(--card)",
              backdropFilter: "blur(12px)",
              border: "0.5px solid rgba(74,158,255,0.2)",
              borderRadius: "10px", padding: "10px 14px",
              display: "flex", flexDirection: "column", gap: "6px",
            }}>
              <span style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "1px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "2px" }}>
                Risk Level
              </span>
              {[
                { color: "#4ade80", label: "Low Risk  (CO₂ < 100)" },
                { color: "#fbbf24", label: "Medium Risk (100–200)" },
                { color: "#f87171", label: "High Risk  (> 200)" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Click hint */}
            <div style={{
              position: "absolute", bottom: "16px", right: "16px",
              background: "rgba(4,18,40,0.75)", backdropFilter: "blur(12px)",
              border: "0.5px solid var(--border)",
              borderRadius: "8px", padding: "7px 12px",
              fontSize: "11px", color: "rgba(255,255,255,0.35)",
            }}>
              Click map for weather info
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .gm-style-iw { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
        .gm-style-iw-d { overflow: visible !important; }
        .gm-style-iw-c { background: transparent !important; padding: 0 !important; box-shadow: none !important; border: none !important; }
        .gm-style-iw-tc::after { display: none; }
        .gm-ui-hover-effect { filter: invert(1) !important; top: 4px !important; right: 4px !important; }
      `}</style>
    </div>
  );
};

export default MapScreen;