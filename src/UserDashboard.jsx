import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db, realDb } from "./firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { ref, onValue } from "firebase/database"; 
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  // 1. STATE FOR REAL SENSOR DATA
  const [sensorData, setSensorData] = useState({
    temp: 0,
    humidity: 0,
    co2: 0,
    mq135: 0,
    active: false,
  });

  useEffect(() => {
    // A. Fetch User Name
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || auth.currentUser.displayName);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setLoading(false);
    };
    fetchUserData();

    // B. Fetch Realtime Sensor Data
    const dbRef = ref(realDb, "/"); 
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          temp: data.Tempature_Sensor || 0,
          humidity: data.Humidity_Sensor || 0,
          co2: data.CO2_Levels || 0,
          mq135: data.MQ135 || 0,
          active: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatus = () => {
    if (sensorData.co2 > 1000 || sensorData.mq135 > 150) return "Poor";
    if (sensorData.co2 > 600) return "Moderate";
    return "Good";
  };

  const getStatusColor = (status) => {
    if (status === "Poor") return "danger";
    if (status === "Moderate") return "warning";
    return "success";
  };

  const currentStatus = getStatus();

  return (
    // 1. FIX: Lock Height to 100vh and hide main scrollbar
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            marginLeft: "250px",
            background: "#f4f6f9",
            padding: "20px", // Reduced padding
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden" // Prevent body scroll
          }}
        >
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* 1. WELCOME SECTION (Compact) */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="fw-bold text-dark mb-0">
                  Welcome back, {loading ? "..." : userName}! 👋
                </h2>
                <small className="text-muted">
                  Live monitoring from your connected devices.
                </small>
              </div>
              <div className="text-end">
                {sensorData.active ? (
                  <span className="badge bg-success border p-2">
                    <i className="fas fa-circle me-1 fa-fade"></i> Live
                  </span>
                ) : (
                  <span className="badge bg-secondary border p-2">
                    Connecting...
                  </span>
                )}
              </div>
            </div>

            {/* 2. REAL DATA CARDS (Compact Row) */}
            <div className="row g-3 mb-3">
              {/* Card 1: Air Quality */}
              <div className="col-md-4">
                <div className={`card text-white bg-${getStatusColor(currentStatus)} shadow-sm h-100`}>
                  <div className="card-body p-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-uppercase mb-1" style={{ opacity: 0.9 }}>Air Quality</h6>
                      <h2 className="fw-bold mb-0">{currentStatus}</h2>
                      <small>CO2: {sensorData.co2} ppm</small>
                    </div>
                    <i className="fas fa-wind fa-3x" style={{ opacity: 0.5 }}></i>
                  </div>
                </div>
              </div>

              {/* Card 2: Temperature */}
              <div className="col-md-4">
                <div className="card bg-white border-0 shadow-sm h-100">
                  <div className="card-body p-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted text-uppercase mb-1">Temperature</h6>
                      <h2 className="fw-bold text-dark mb-0">{sensorData.temp}°C</h2>
                      <small className="text-muted">Humidity: {sensorData.humidity}%</small>
                    </div>
                    <div className="icon-box bg-light rounded-circle p-3 text-primary">
                      <i className="fas fa-temperature-high fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: MQ135 */}
              <div className="col-md-4">
                <div className="card bg-white border-0 shadow-sm h-100">
                  <div className="card-body p-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted text-uppercase mb-1">Toxins (MQ135)</h6>
                      <h2 className="fw-bold text-dark mb-0">{sensorData.mq135}</h2>
                      <small className="text-muted">Particulate Level</small>
                    </div>
                    <div className="icon-box bg-light rounded-circle p-3 text-info">
                      <i className="fas fa-biohazard fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ALERTS & ACTIONS (Fills remaining space) */}
            <div className="row g-3" style={{ flex: 1, minHeight: 0 }}>
              
              {/* Alerts Column */}
              <div className="col-lg-8 h-100">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-bottom py-2">
                    <h6 className="mb-0 fw-bold"><i className="fas fa-bell text-warning me-2"></i>Live Alerts</h6>
                  </div>
                  {/* Internal Scroll ONLY for this list */}
                  <div className="card-body p-0" style={{ overflowY: "auto" }}>
                    <ul className="list-group list-group-flush">
                      
                      {/* Alert 1: CO2 */}
                      {sensorData.co2 > 1000 ? (
                        <li className="list-group-item p-3 d-flex align-items-center bg-soft-danger">
                            <div className="text-danger me-3"><i className="fas fa-exclamation-triangle"></i></div>
                            <div>
                                <h6 className="mb-0 fw-bold text-danger">Warning: High CO2 Detected</h6>
                                <small>Value is {sensorData.co2}, which exceeds safe limit.</small>
                            </div>
                        </li>
                      ) : (
                        <li className="list-group-item p-3 d-flex align-items-center">
                            <div className="text-success me-3"><i className="fas fa-check-circle"></i></div>
                            <div>
                                <h6 className="mb-0 fw-bold">CO2 Levels Normal</h6>
                                <small>Current value ({sensorData.co2}) is safe.</small>
                            </div>
                        </li>
                      )}

                      {/* Alert 2: Temp */}
                      {sensorData.temp > 35 && (
                         <li className="list-group-item p-3 d-flex align-items-center">
                            <div className="text-warning me-3"><i className="fas fa-thermometer-full"></i></div>
                            <div>
                                <h6 className="mb-0 fw-bold">High Temperature</h6>
                                <small>Consider checking cooling systems.</small>
                            </div>
                        </li>
                      )}

                       {/* Alert 3: MQ135 */}
                       {sensorData.mq135 > 150 ? (
                        <li className="list-group-item p-3 d-flex align-items-center">
                            <div className="text-warning me-3"><i className="fas fa-smog"></i></div>
                            <div>
                                <h6 className="mb-0 fw-bold">Poor Air Quality</h6>
                                <small>MQ135 levels are elevated.</small>
                            </div>
                        </li>
                      ) : (
                        <li className="list-group-item p-3 d-flex align-items-center">
                            <div className="text-success me-3"><i className="fas fa-check"></i></div>
                            <div>
                                <h6 className="mb-0 fw-bold">Air Quality Normal</h6>
                                <small>No significant toxins detected.</small>
                            </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Actions Column */}
              <div className="col-lg-4 h-100">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-bottom py-2">
                    <h6 className="mb-0 fw-bold">Quick Actions</h6>
                  </div>
                  {/* Flex column to space buttons evenly */}
                  <div className="card-body d-flex flex-column justify-content-center gap-3">
                    <Link to="/sensor-data" className="btn btn-outline-primary text-start p-3 d-flex align-items-center">
                      <i className="fas fa-chart-bar fa-lg me-3"></i>
                      <div>
                        <span className="d-block fw-bold">View Live Data</span>
                        <small className="text-muted">Real-time streams</small>
                      </div>
                    </Link>

                    <Link to="/google-map" className="btn btn-outline-success text-start p-3 d-flex align-items-center">
                      <i className="fas fa-map-marked-alt fa-lg me-3"></i>
                      <div>
                        <span className="d-block fw-bold">Map View</span>
                        <small className="text-muted">Device locations</small>
                      </div>
                    </Link>

                    <Link to="/predictions" className="btn btn-outline-dark text-start p-3 d-flex align-items-center">
                      <i className="fas fa-robot fa-lg me-3"></i>
                      <div>
                        <span className="d-block fw-bold">Run Predictions</span>
                        <small className="text-muted">AI forecasting</small>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;