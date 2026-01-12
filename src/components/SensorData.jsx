import { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { realDb } from "../firebase"; 
import { ref, onValue } from "firebase/database"; 

const SensorData = () => {
  const [data, setData] = useState({
    temp: 0,
    humidity: 0,
    co2: 0,
    mq135: 0,
    isConnected: false 
  });

  useEffect(() => {
    const dbRef = ref(realDb, '/');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const dbData = snapshot.val();
        setData({
          temp: dbData.Tempature_Sensor || 0, 
          humidity: dbData.Humidity_Sensor || 0,
          co2: dbData.CO2_Levels || 0,
          mq135: dbData.MQ135 || 0,
          isConnected: true
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const getStatus = (value, type) => {
    if (type === "co2") {
      if (value > 1000) return { color: "danger", text: "Hazardous" };
      if (value > 600) return { color: "warning", text: "Moderate" };
      return { color: "success", text: "Good" };
    }
    if (type === "mq135") {
      if (value > 200) return { color: "danger", text: "Poor" };
      if (value > 100) return { color: "warning", text: "Fair" };
      return { color: "success", text: "Excellent" };
    }
    return { color: "primary", text: "Normal" };
  };

  return (
    // 1. FIX: Use height: "100vh" and overflow: "hidden" to lock screen size
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* MAIN CONTENT WRAPPER */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px",
            background: "linear-gradient(to bottom, #ecf0f1, #bdc3c7)",
            padding: "20px", // 2. FIX: Reduced padding to save space
            display: "flex",  // 3. FIX: Use Flex column to manage vertical space
            flexDirection: "column"
          }}
        >
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="fw-bold text-dark mb-0">Sensor Dashboard</h2>
                <small className="text-muted">
                   Status: {data.isConnected ? <span className="text-success fw-bold">Live</span> : <span className="text-danger fw-bold">Connecting...</span>}
                </small>
              </div>
            </div>

            {/* Sensor Grid - Keeps its height based on content */}
            <div className="row g-3 mb-3">
              {/* Temp */}
              <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3">
                    <div className="icon-box mb-2 mx-auto bg-soft-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#ffebee" }}>
                      <i className="fas fa-temperature-high fa-lg text-danger"></i>
                    </div>
                    <h6 className="text-muted mb-1">Temperature</h6>
                    <h3 className="fw-bold mb-0">{data.temp}°C</h3>
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3">
                    <div className="icon-box mb-2 mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#e3f2fd" }}>
                      <i className="fas fa-tint fa-lg text-primary"></i>
                    </div>
                    <h6 className="text-muted mb-1">Humidity</h6>
                    <h3 className="fw-bold mb-0">{data.humidity}%</h3>
                  </div>
                </div>
              </div>

              {/* CO2 */}
              <div className="col-md-6 col-lg-3">
                {(() => {
                  const status = getStatus(data.co2, "co2");
                  return (
                    <div className={`card border-0 shadow-sm h-100 border-bottom border-4 border-${status.color}`}>
                      <div className="card-body text-center p-3">
                        <div className="icon-box mb-2 mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#e8f5e9" }}>
                          <i className={`fas fa-cloud fa-lg text-${status.color}`}></i>
                        </div>
                        <h6 className="text-muted mb-1">CO2 Levels</h6>
                        <h3 className="fw-bold mb-0">{data.co2}</h3>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* MQ135 */}
              <div className="col-md-6 col-lg-3">
                {(() => {
                  const status = getStatus(data.mq135, "mq135");
                  return (
                    <div className={`card border-0 shadow-sm h-100 border-bottom border-4 border-${status.color}`}>
                      <div className="card-body text-center p-3">
                        <div className="icon-box mb-2 mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", backgroundColor: "#f3e5f5" }}>
                          <i className={`fas fa-biohazard fa-lg text-${status.color}`}></i>
                        </div>
                        <h6 className="text-muted mb-1">MQ135</h6>
                        <h3 className="fw-bold mb-0">{data.mq135}</h3>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* CHART SECTION - 4. FIX: Use flex: 1 to fill remaining space without scrolling */}
            <div className="card border-0 shadow-sm" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div className="card-header bg-white border-0 py-2">
                <h6 className="mb-0 fw-bold">Live Trends</h6>
              </div>
              <div className="card-body d-flex justify-content-center align-items-center" style={{ backgroundColor: "#fafafa", flex: 1 }}>
                <p className="text-muted text-center mb-0">
                  <i className="fas fa-chart-line fa-2x mb-2 d-block text-center"></i>
                  Chart fills remaining space automatically
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorData;