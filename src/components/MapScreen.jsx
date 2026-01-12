// import { useState, useCallback } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   InfoWindow,
//   Marker,
// } from "@react-google-maps/api";
// import axios from "axios";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";

// // Settings
// const containerStyle = {
//   width: "100%",
//   height: "600px", // Fixed height for consistency
//   borderRadius: "10px",
// };

// const defaultCenter = {
//   lat: 33.6844,
//   lng: 73.0479,
// };

// const GOOGLE_MAPS_API_KEY = "AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA";
// const WEATHER_API_KEY = "680b8cb55955b2fe1d1f2837cd8101ad"; // Get free from openweathermap.org

// const MapScreen = () => {
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(false);

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
//       style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
//     >
//       {/* 1. Navbar at the top */}
//       <Navbar />

//       <div style={{ display: "flex", flex: 1 }}>
//         {/* 2. Sidebar Fixed on Left */}
//         <Sidebar />

//         {/* 3. MAIN CONTENT WRAPPER - This fixes the alignment */}
//         <div
//           style={{
//             flex: 1,
//             marginLeft: "250px", // <--- CRITICAL FIX: Pushes content to the right of the sidebar
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center", // Horizontally center the inner container
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)",
//             padding: "30px",
//             overflowY: "auto", // Allows scrolling if map is tall
//           }}
//         >
//           {/* 4. INNER CONTAINER - Keeps Header and Map aligned together */}
//           <div
//             style={{
//               width: "100%",
//               maxWidth: "1200px", // Prevents it from getting too wide on huge screens
//               display: "flex",
//               flexDirection: "column",
//               gap: "20px", // Space between Header and Map
//             }}
//           >
//             {/* Header Card */}
//             <div className="card shadow-sm border-0">
//               <div className="card-body py-2 text-center">
//                 <h2 className="card-title fw-bold text-dark mb-1">
//                   Live Weather Data
//                 </h2>
//                 <p className="text-muted mb-0">
//                   Click anywhere on the map to see local weather details
//                 </p>
//               </div>
//             </div>

//             {/* Map Card */}
//             <div
//               className="card shadow-lg border-0"
//               style={{ padding: "10px", borderRadius: "15px" }}
//             >
//               <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//                 <GoogleMap
//                   mapContainerStyle={containerStyle}
//                   center={defaultCenter}
//                   zoom={11}
//                   onClick={onMapClick}
//                 >
//                   {selectedLocation && <Marker position={selectedLocation} />}

//                   {selectedLocation && (
//                     <InfoWindow
//                       position={selectedLocation}
//                       onCloseClick={() => {
//                         setSelectedLocation(null);
//                         setWeather(null);
//                       }}
//                     >
//                       {/* ... inside InfoWindow ... */}

//                       <div
//                         className="text-center p-2"
//                         style={{ minWidth: "220px" }}
//                       >
//                         {loading ? (
//                           <div
//                             className="spinner-border text-primary"
//                             role="status"
//                           ></div>
//                         ) : weather ? (
//                           <div>
//                             {/* 1. Location Name */}
//                             <h6 className="fw-bold mb-0">
//                               {weather.name}, {weather.sys.country}
//                             </h6>

//                             {/* 2. ICON & TEMPERATURE ROW */}
//                             <div className="d-flex justify-content-center align-items-center my-2">
//                               {/* Weather Icon from OpenWeatherMap */}
//                               <img
//                                 src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
//                                 alt={weather.weather[0].description}
//                                 style={{ width: "80px", height: "80px" }}
//                               />
//                               {/* Temperature */}
//                               <div className="text-start">
//                                 <h1 className="mb-0 fw-bold">
//                                   {Math.round(weather.main.temp)}°
//                                 </h1>
//                                 <p className="text-capitalize text-muted mb-0 small">
//                                   {weather.weather[0].description}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* 3. DETAILED STATS GRID */}
//                             <div
//                               className="container p-0 border-top pt-2"
//                               style={{ fontSize: "0.85rem", textAlign: "left" }}
//                             >
//                               <div className="row g-2">
//                                 <div className="col-6">
//                                   <span className="text-muted">
//                                     🌡️ Feels Like:
//                                   </span>
//                                   <br />
//                                   <strong>
//                                     {Math.round(weather.main.feels_like)}°C
//                                   </strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">
//                                     💧 Humidity:
//                                   </span>
//                                   <br />
//                                   <strong>{weather.main.humidity}%</strong>
//                                 </div>

//                                 <div className="col-6">
//                                   <span className="text-muted">🌬️ Wind:</span>
//                                   <br />
//                                   <strong>{weather.wind.speed} m/s</strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">
//                                     ⏲️ Pressure:
//                                   </span>
//                                   <br />
//                                   <strong>{weather.main.pressure} hPa</strong>
//                                 </div>

//                                 <div className="col-6">
//                                   <span className="text-muted">
//                                     👁️ Visibility:
//                                   </span>
//                                   <br />
//                                   <strong>
//                                     {(weather.visibility / 1000).toFixed(1)} km
//                                   </strong>
//                                 </div>
//                                 <div className="col-6">
//                                   <span className="text-muted">☁️ Clouds:</span>
//                                   <br />
//                                   <strong>{weather.clouds.all}%</strong>
//                                 </div>

//                                 {/* Sunrise / Sunset */}
//                                 <div className="col-12 mt-2 pt-2 border-top text-center text-muted small">
//                                   <span>
//                                     ☀️ Rise:{" "}
//                                     {new Date(
//                                       weather.sys.sunrise * 1000
//                                     ).toLocaleTimeString([], {
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                     })}
//                                   </span>
//                                   <span className="mx-2">|</span>
//                                   <span>
//                                     🌑 Set:{" "}
//                                     {new Date(
//                                       weather.sys.sunset * 1000
//                                     ).toLocaleTimeString([], {
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                     })}
//                                   </span>
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
//                 </GoogleMap>
//               </LoadScript>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapScreen;


import React, { useState, useCallback } from "react";
// 1. Import 'useJsApiLoader' instead of LoadScript for better stability
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from "@react-google-maps/api";
import axios from "axios";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

// Settings
const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479,
};

const GOOGLE_MAPS_API_KEY = "AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA";
const WEATHER_API_KEY = "680b8cb55955b2fe1d1f2837cd8101ad"; 

const MapScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. FIX: Use the Hook to load the script (Prevents "Map not loading" errors)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

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

  return (
    // 3. FIX: Lock Screen Height
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
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
            padding: "20px", // Reduced padding
            overflow: "hidden" // Prevent scroll
          }}
        >
          {/* Inner Container */}
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", height: "100%", gap: "15px" }}>
            
            {/* Header Card */}
            <div className="card shadow-sm border-0">
              <div className="card-body py-2 text-center">
                <h2 className="card-title fw-bold text-dark mb-1">
                  Live Weather Data
                </h2>
                <p className="text-muted mb-0 small">
                  Click anywhere on the map to see local weather details
                </p>
              </div>
            </div>

            {/* Map Card - 4. FIX: Use flex: 1 to fill remaining space */}
            <div className="card shadow-lg border-0" style={{ flex: 1, padding: "5px", borderRadius: "15px", overflow: "hidden" }}>
              
              {/* 5. Only render map if script is loaded */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }} // Fill the card
                  center={defaultCenter}
                  zoom={11}
                  onClick={onMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {selectedLocation && <Marker position={selectedLocation} />}

                  {selectedLocation && (
                    <InfoWindow
                      position={selectedLocation}
                      onCloseClick={() => {
                        setSelectedLocation(null);
                        setWeather(null);
                      }}
                    >
                      <div className="text-center p-2" style={{ minWidth: "220px" }}>
                        {loading ? (
                          <div className="spinner-border text-primary" role="status"></div>
                        ) : weather ? (
                          <div>
                            {/* Location & Icon */}
                            <h6 className="fw-bold mb-0">{weather.name}, {weather.sys.country}</h6>
                            <div className="d-flex justify-content-center align-items-center my-2">
                              <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                style={{ width: "60px", height: "60px" }}
                              />
                              <div className="text-start ms-2">
                                <h2 className="mb-0 fw-bold">{Math.round(weather.main.temp)}°</h2>
                                <p className="text-capitalize text-muted mb-0 small" style={{lineHeight: "1"}}>
                                  {weather.weather[0].description}
                                </p>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="container p-0 border-top pt-2" style={{ fontSize: "0.8rem", textAlign: "left" }}>
                              <div className="row g-1">
                                <div className="col-6">
                                  <span className="text-muted">🌡️ Feels:</span> <strong>{Math.round(weather.main.feels_like)}°C</strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">💧 Humidity:</span> <strong>{weather.main.humidity}%</strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">🌬️ Wind:</span> <strong>{weather.wind.speed} m/s</strong>
                                </div>
                                <div className="col-6">
                                  <span className="text-muted">👁️ Vis:</span> <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
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