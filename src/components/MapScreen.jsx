// import { useState, useEffect, useCallback } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   InfoWindow,
//   Marker,
// } from "@react-google-maps/api";
// import axios from "axios";
// import { getDatabase, ref, onValue } from "firebase/database"; // Firebase Realtime DB imports
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";

// // OpenWeatherMap API Key
// const WEATHER_API_KEY = "680b8cb55955b2fe1d1f2837cd8101ad"; // Replace with your OpenWeatherMap API key

// // Google Maps API Key
// const GOOGLE_MAPS_API_KEY = "AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"; // Replace with your Google Maps API key

// const MapScreen = () => {
//   const [selectedLocation, setSelectedLocation] = useState(null); // Location for clicked points on the map
//   const [sensorLocation, setSensorLocation] = useState(null); // Sensor location from Firebase
//   const [weather, setWeather] = useState(null); // Weather data for clicked location
//   const [sensorData, setSensorData] = useState(null); // Sensor data to show in InfoWindow
//   const [loading, setLoading] = useState(false);

//   // Load Google Maps script
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//   });

//   // Fetch sensor data from Firebase Realtime Database
//   useEffect(() => {
//     const fetchSensorData = async () => {
//       const db = getDatabase(); // Get Firebase Realtime Database instance
//       const sensorRef = ref(db, "/"); // Reference to the root of the database

//       // Listen for changes at the root of the database
//       onValue(sensorRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           // Extract lat, lon, and other sensor details from Firebase data
//           setSensorLocation({
//             lat: data.lat,
//             lng: data.lon,
//           });
//           setSensorData(data); // Set all sensor data to show in InfoWindow
//         }
//       });
//     };

//     fetchSensorData();
//   }, []);

//   // Handle map click event to show weather data for clicked location
//   const onMapClick = useCallback(async (e) => {
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
//     setSelectedLocation({ lat, lng });
//     setLoading(true);
//     setWeather(null);

//     try {
//       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
//       const response = await axios.get(url);
//       setWeather(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

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

//         {/* MAIN CONTENT WRAPPER */}
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
//           {/* Inner Container */}
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
//             {/* Header Card */}
//             <div className="card shadow-sm border-0">
//               <div className="card-body py-2 text-center">
//                 <h2 className="card-title fw-bold text-dark mb-1">
//                   Live Weather Data and Sensor Info
//                 </h2>
//                 <p className="text-muted mb-0 small">
//                   Click anywhere on the map to see weather details. Click on the
//                   sensor marker to see sensor data.
//                 </p>
//               </div>
//             </div>

//             {/* Map Card */}
//             <div
//               className="card shadow-lg border-0"
//               style={{
//                 flex: 1,
//                 padding: "5px",
//                 borderRadius: "15px",
//                 overflow: "hidden",
//               }}
//             >
//               {/* Only render map if script is loaded */}
//               {isLoaded ? (
//                 <GoogleMap
//                   mapContainerStyle={{ width: "100%", height: "100%" }} // Fill the card
//                   center={sensorLocation || { lat: 33.6844, lng: 73.0479 }} // Default center if sensor location is not available
//                   zoom={11}
//                   onClick={onMapClick}
//                   options={{
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                   }}
//                 >
//                   {/* Marker for Sensor Location */}
//                   {sensorLocation && (
//                     <Marker
//                       position={sensorLocation}
//                       label="Sensors"
//                       onClick={() => setSelectedLocation(sensorLocation)}
//                     />
//                   )}

//                   {/* Marker for Selected Location (where user clicks) */}
//                   {selectedLocation && <Marker position={selectedLocation} />}

//                   {/* InfoWindow for Weather Data */}
//                   {selectedLocation && weather && (
//                     <InfoWindow
//                       position={selectedLocation}
//                       onCloseClick={() => {
//                         setSelectedLocation(null);
//                         setWeather(null);
//                       }}
//                     >
//                       <div
//                         className="text-center p-2"
//                         style={{ minWidth: "220px" }}
//                       >
//                         {loading ? (
//                           <div
//                             className="spinner-border text-primary"
//                             role="status"
//                           >
//                             <span className="visually-hidden">Loading...</span>
//                           </div>
//                         ) : weather ? (
//                           <div>
//                             {/* Location & Icon */}
//                             <h6 className="fw-bold mb-0">
//                               {weather.name}, {weather.sys.country}
//                             </h6>
//                             <div className="d-flex justify-content-center align-items-center my-2">
//                               <img
//                                 src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
//                                 alt={weather.weather[0].description}
//                                 style={{ width: "60px", height: "60px" }}
//                               />
//                               <div className="text-start ms-2">
//                                 <h2 className="mb-0 fw-bold">
//                                   {Math.round(weather.main.temp)}°
//                                 </h2>
//                                 <p
//                                   className="text-capitalize text-muted mb-0 small"
//                                   style={{ lineHeight: "1" }}
//                                 >
//                                   {weather.weather[0].description}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Stats Grid */}
//                             <div
//                               className="container p-0 border-top pt-2"
//                               style={{ fontSize: "0.8rem", textAlign: "left" }}
//                             >
//                               <div className="row g-1">
//                                 <div className="col-6">
//                                   <span className="text-muted">🌡️ Feels:</span>{" "}
//                                   <strong>
//                                     {Math.round(weather.main.feels_like)}°C
//                                   </strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">
//                                     💧 Humidity:
//                                   </span>{" "}
//                                   <strong>{weather.main.humidity}%</strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">🌬️ Wind:</span>{" "}
//                                   <strong>{weather.wind.speed} m/s</strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">👁️ Vis:</span>{" "}
//                                   <strong>
//                                     {(weather.visibility / 1000).toFixed(1)} km
//                                   </strong>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <span>No Data Available</span>
//                         )}
//                       </div>
//                     </InfoWindow>
//                   )}

//                   {/* InfoWindow for Sensor Data (when sensor marker is clicked) */}
//                   {sensorLocation &&
//                     selectedLocation === sensorLocation &&
//                     sensorData && (
//                       <InfoWindow
//                         position={sensorLocation}
//                         onCloseClick={() => setSensorLocation(null)}
//                       >
//                         <div
//                           className="text-center"
//                           style={{ minWidth: "220px" }}
//                         >
//                           <h6 className="fw-bold mb-0">Sensor Information</h6>
//                           <p>
//                             <strong>CO2 Levels:</strong> {sensorData.CO2_Levels}
//                           </p>
//                           <p>
//                             <strong>Humidity:</strong>{" "}
//                             {sensorData.Humidity_Sensor}%
//                           </p>
//                           <p>
//                             <strong>Temperature:</strong>{" "}
//                             {sensorData.Tempature_Sensor}°C
//                           </p>
//                           <p>
//                             <strong>MQ135 Levels:</strong> {sensorData.MQ135}
//                           </p>
//                         </div>
//                       </InfoWindow>
//                     )}
//                 </GoogleMap>
//               ) : (
//                 // Loading State while script fetches
//                 <div className="d-flex justify-content-center align-items-center h-100">
//                   <div className="spinner-grow text-primary" role="status">
//                     <span className="visually-hidden">Loading Map...</span>
//                   </div>
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



import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database"; // Firebase Realtime DB imports
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

// OpenWeatherMap API Key
const WEATHER_API_KEY = "680b8cb55955b2fe1d1f2837cd8101ad"; // Replace with your OpenWeatherMap API key

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"; // Replace with your Google Maps API key

const MapScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null); // Location for clicked points on the map
  const [sensorLocation, setSensorLocation] = useState(null); // Sensor location from Firebase
  const [weather, setWeather] = useState(null); // Weather data for clicked location
  const [sensorData, setSensorData] = useState(null); // Sensor data to show in InfoWindow
  const [loading, setLoading] = useState(false);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Fetch sensor data from Firebase Realtime Database
  useEffect(() => {
    const fetchSensorData = async () => {
      const db = getDatabase(); // Get Firebase Realtime Database instance
      const sensorRef = ref(db, "/"); // Reference to the root of the database

      // Listen for changes at the root of the database
      onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Extract lat, lon, and other sensor details from Firebase data
          setSensorLocation({
            lat: data.lat,
            lng: data.lon,
          });
          setSensorData(data); // Set all sensor data to show in InfoWindow
        }
      });
    };

    fetchSensorData();
  }, []);

  // Handle map click event to show weather data for clicked location
  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });
    setLoading(true);
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkerClick = () => {
    if (selectedLocation === sensorLocation) {
      // If already selected, unselect it (close the InfoWindow)
      setSelectedLocation(null);
    } else {
      // Otherwise, select the sensor marker
      setSelectedLocation(sensorLocation);
    }
  };

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

        {/* MAIN CONTENT WRAPPER */}
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
          {/* Inner Container */}
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
            {/* Header Card */}
            <div className="card shadow-sm border-0">
              <div className="card-body py-2 text-center">
                <h2 className="card-title fw-bold text-dark mb-1">
                  Live Weather Data and Sensor Info
                </h2>
                <p className="text-muted mb-0 small">
                  Click anywhere on the map to see weather details. Click on the
                  sensor marker to see sensor data.
                </p>
              </div>
            </div>

            {/* Map Card */}
            <div
              className="card shadow-lg border-0"
              style={{
                flex: 1,
                padding: "5px",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              {/* Only render map if script is loaded */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }} // Fill the card
                  center={sensorLocation || { lat: 33.6844, lng: 73.0479 }} // Default center if sensor location is not available
                  zoom={11}
                  onClick={onMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {/* Marker for Sensor Location */}
                  {sensorLocation && (
                    <Marker
                      position={sensorLocation}
                      label="Sensor"
                      onClick={handleMarkerClick}
                    />
                  )}

                  {/* Marker for Selected Location (where user clicks) */}
                  {selectedLocation && <Marker position={selectedLocation} />}

                  {/* InfoWindow for Weather Data */}
                  {selectedLocation && weather && (
                    <InfoWindow
                      position={selectedLocation}
                      onCloseClick={() => {
                        setSelectedLocation(null);
                        setWeather(null);
                      }}
                    >
                      <div
                        className="text-center p-2"
                        style={{ minWidth: "220px" }}
                      >
                        {loading ? (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : weather ? (
                          <div>
                            {/* Location & Icon */}
                            <h6 className="fw-bold mb-0">
                              {weather.name}, {weather.sys.country}
                            </h6>
                            <div className="d-flex justify-content-center align-items-center my-2">
                              <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                style={{ width: "60px", height: "60px" }}
                              />
                              <div className="text-start ms-2">
                                <h2 className="mb-0 fw-bold">
                                  {Math.round(weather.main.temp)}°
                                </h2>
                                <p
                                  className="text-capitalize text-muted mb-0 small"
                                  style={{ lineHeight: "1" }}
                                >
                                  {weather.weather[0].description}
                                </p>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div
                              className="container p-0 border-top pt-2"
                              style={{ fontSize: "0.8rem", textAlign: "left" }}
                            >
                              <div className="row g-1">
                                <div className="col-6">
                                  <span className="text-muted">🌡️ Feels:</span>{" "}
                                  <strong>
                                    {Math.round(weather.main.feels_like)}°C
                                  </strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">
                                    💧 Humidity:
                                  </span>{" "}
                                  <strong>{weather.main.humidity}%</strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">🌬️ Wind:</span>{" "}
                                  <strong>{weather.wind.speed} m/s</strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">👁️ Vis:</span>{" "}
                                  <strong>
                                    {(weather.visibility / 1000).toFixed(1)} km
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span>No Data Available</span>
                        )}
                      </div>
                    </InfoWindow>
                  )}

                  {/* InfoWindow for Sensor Data (when sensor marker is clicked) */}
                  {sensorLocation &&
                    selectedLocation === sensorLocation &&
                    sensorData && (
                      <InfoWindow
                        position={sensorLocation}
                        onCloseClick={() => setSensorLocation(null)}
                      >
                        <div
                          className="text-center"
                          style={{ minWidth: "220px" }}
                        >
                          <h6 className="fw-bold mb-0">Sensor Information</h6>
                          <p>
                            <strong>CO2 Levels:</strong> {sensorData.CO2_Levels}
                          </p>
                          <p>
                            <strong>Humidity:</strong>{" "}
                            {sensorData.Humidity_Sensor}%
                          </p>
                          <p>
                            <strong>Temperature:</strong>{" "}
                            {sensorData.Tempature_Sensor}°C
                          </p>
                          <p>
                            <strong>MQ135 Levels:</strong> {sensorData.MQ135}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                </GoogleMap>
              ) : (
                // Loading State while script fetches
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading Map...</span>
                  </div>
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
