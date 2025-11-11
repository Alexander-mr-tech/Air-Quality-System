// import React from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./components/NavBar"; // Navbar Component
// import Sidebar from "./components/UserSidebar"; // Sidebar Component

// const UserDashboard = () => {
//   return (
//     <div
//       style={{
//         display: "flex", // Flexbox layout for the sidebar and content
//         minHeight: "100vh", // Full height of the screen
//         flexDirection: "column", // Keep Navbar on top
//       }}
//     >
//       {/* Navbar */}
//       <Navbar />

//       <div style={{ display: "flex", flex: 1 }}>
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <div
//           style={{
//             marginLeft: "250px", // Create space for the sidebar (250px)
//             padding: "20px",
//             width: "calc(100% - 250px)", // Take up the remaining space for content
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)", // Gradient background
//           }}
//         >
//           <div
//             className="card p-4"
//             style={{
//               width: "100%",
//               backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
//               borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h2 className="text-center mb-4">User Dashboard</h2>
//             <p>Welcome to the user dashboard! Here you can view reports, and more.</p>

//             {/* Add User, View Users, Remove User Sections */}
//             <div className="container mt-4">
//               <div className="row">
//                 {/* Add User Section */}
//                 <div className="col-md-4 mb-4">
//                   <div
//                     className="card"
//                     style={{
//                       backgroundColor: "rgba(255, 255, 255, 0.8)",
//                       borderRadius: "10px",
//                       padding: "20px",
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     }}
//                   >
//                     <h5 className="text-center">Add User</h5>
//                     <p className="text-center">
//                       Add a new user to the system. Fill out the form to create a user.
//                     </p>
//                     <Link to="/add-user" className="btn btn-primary w-100">
//                       Go to Add User
//                     </Link>
//                   </div>
//                 </div>

//                 {/* View Users Section */}
//                 <div className="col-md-4 mb-4">
//                   <div
//                     className="card"
//                     style={{
//                       backgroundColor: "rgba(255, 255, 255, 0.8)",
//                       borderRadius: "10px",
//                       padding: "20px",
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     }}
//                   >
//                     <h5 className="text-center">View Users</h5>
//                     <p className="text-center">
//                       View a list of all users in the system. You can manage and edit them here.
//                     </p>
//                     <Link to="/view-users" className="btn btn-info w-100">
//                       Go to View Users
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Remove User Section */}
//                 <div className="col-md-4 mb-4">
//                   <div
//                     className="card"
//                     style={{
//                       backgroundColor: "rgba(255, 255, 255, 0.8)",
//                       borderRadius: "10px",
//                       padding: "20px",
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     }}
//                   >
//                     <h5 className="text-center">Remove User</h5>
//                     <p className="text-center">
//                       Remove a user from the system. Select the user to delete them.
//                     </p>
//                     <Link to="/remove-user" className="btn btn-danger w-100">
//                       Go to Remove User
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/NavBar"; // Navbar Component
import Sidebar from "./components/UserSidebar"; // Sidebar Component
import { Line } from "react-chartjs-2"; // For sensor data graph
import Chart from "chart.js/auto"; // Chart.js for rendering graphs

// OpenWeatherMap API key and URL
const API_KEY = "680b8cb55955b2fe1d1f2837cd8101ad"; // Replace with your OpenWeatherMap API Key
const CITY = "Islamabad"; // Replace with the city you want to fetch weather data for
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

const UserDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sensor data state
  const [sensorData, setSensorData] = useState({
    temperature: [],
    humidity: [],
    mq135: [],
    mq7: [],
  });

  // Generate dummy sensor data
  const generateDummySensorValues = () => {
    const temperature = (Math.random() * 60 - 10).toFixed(2);  // Temperature range: -10°C to 50°C
    const humidity = (Math.random() * 60 + 30).toFixed(2);  // Humidity range: 30% to 90%
    const mq135 = (Math.random() * 1000).toFixed(2);  // MQ-135 air quality range: 0 to 1000 ppm
    const mq7 = (Math.random() * 100).toFixed(2);  // MQ-7 CO range: 0 to 100 ppm
    return { temperature, humidity, mq135, mq7 };
  };

  // Fetch weather data from API
  useEffect(() => {
    fetch(WEATHER_URL)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  }, []);

  // Simulate sensor data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newSensorValues = generateDummySensorValues();
      setSensorData((prevData) => {
        return {
          temperature: [...prevData.temperature, newSensorValues.temperature],
          humidity: [...prevData.humidity, newSensorValues.humidity],
          mq135: [...prevData.mq135, newSensorValues.mq135],
          mq7: [...prevData.mq7, newSensorValues.mq7],
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  // Chart.js data for sensor graph
  const sensorChartData = {
    labels: Array.from({ length: sensorData.temperature.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Temperature (°C)",
        data: sensorData.temperature,
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Humidity (%)",
        data: sensorData.humidity,
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "MQ-135 (Air Quality)",
        data: sensorData.mq135,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "MQ-7 (CO Sensor)",
        data: sensorData.mq7,
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex", // Flexbox layout for the sidebar and content
        minHeight: "100vh", // Full height of the screen
        flexDirection: "column", // Keep Navbar on top
      }}
    >
      {/* Navbar */}
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          style={{
            marginLeft: "250px", // Create space for the sidebar (250px)
            padding: "20px",
            width: "calc(100% - 250px)", // Take up the remaining space for content
            background: "linear-gradient(to bottom, #3498db, #2c3e50)", // Gradient background
          }}
        >
          <div
            className="card p-4"
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-center mb-4">User Dashboard</h2>
            <p>Welcome to the user dashboard! Here you can view reports, and more.</p>

            {/* Weather data */}
            {loading ? (
              <p>Loading weather data...</p>
            ) : weather ? (
              <div className="mb-4">
                <h5>Weather Information:</h5>
                <p>City: {weather.name}</p>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Weather: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </div>
            ) : (
              <p>Error fetching weather data</p>
            )}

            {/* Sensor Data Graph */}
            <div className="mb-4">
              <h5>Sensor Data</h5>
              <Line data={sensorChartData} />
            </div>

            {/* Sign Out Button */}
            <Link to="/signin" className="btn btn-danger w-100">
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
