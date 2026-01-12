import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { auth, db, realDb } from "./firebase"; // Import Firebase
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore
import { ref, onValue } from "firebase/database"; // Realtime DB
import adminProfile from "./assets/admin.png"; // Admin profile image

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState("Admin");
  
  // 1. STATE: Holds counts and system status
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSensors: 0, // Will update based on real data
    systemStatus: "Normal",
    alertCount: 0
  });

  useEffect(() => {
    // A. Fetch Admin Name
    if (auth.currentUser) {
      setAdminName(auth.currentUser.displayName || "Administrator");
    }

    // B. Fetch Total Users Count (Firestore)
    const fetchUserCount = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "User"));
        const querySnapshot = await getDocs(q);
        setStats(prev => ({ ...prev, totalUsers: querySnapshot.size }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUserCount();

    // C. Monitor 4 Specific Sensors (Realtime DB)
    const dbRef = ref(realDb, "/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // 1. Get values (using your exact Firebase spelling)
        const co2 = data.CO2_Levels || 0;         // Note: C02 (zero) based on your screenshot
        const mq135 = data.MQ135 || 0;
        const temp = data.Tempature_Sensor || 0;  // Note: Tempature (misspelled in DB)
        const humid = data.Humidity_Sensor || 0;

        // 2. Count Active Sensors
        // We assume if a value exists (even 0), the sensor is connected.
        let sensorCount = 0;
        if (data.CO2_Levels !== undefined) sensorCount++;
        if (data.MQ135 !== undefined) sensorCount++;
        if (data.Tempature_Sensor !== undefined) sensorCount++;
        if (data.Humidity_Sensor !== undefined) sensorCount++;

        // 3. Determine System Status & Alerts
        let status = "Normal";
        let alerts = 0;

        // CRITICAL Conditions
        if (co2 > 1000 || mq135 > 200) {
          status = "Critical";
          alerts += 1;
        } 
        // WARNING Conditions
        else if (co2 > 600 || mq135 > 100 || temp > 35) {
          status = "Warning";
          alerts += 1;
        }

        // 4. Update State
        setStats(prev => ({
          ...prev,
          activeSensors: sensorCount,
          systemStatus: status,
          alertCount: alerts
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper for Status Color
  const getStatusColor = (status) => {
    if (status === "Critical") return "danger"; // Red
    if (status === "Warning") return "warning"; // Yellow
    return "success"; // Green
  };

  return (
    // Lock Screen Height (No Scroll)
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px", // Align next to Sidebar
            background: "#f4f6f9",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", height: "100%" }}>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold text-dark mb-0">Admin Dashboard</h2>
                <p className="text-muted mb-0">Overview of system performance and user management.</p>
              </div>
              <div className="text-end">
                <span className={`badge bg-${getStatusColor(stats.systemStatus)} fs-6`}>
                  System: {stats.systemStatus}
                </span>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="row g-3 mb-4">
              
              {/* Card 1: Total Users */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 border-start border-4 border-primary">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted text-uppercase mb-1">Total Users</h6>
                      <h2 className="fw-bold mb-0">{stats.totalUsers}</h2>
                    </div>
                    <div className="icon-box bg-soft-primary rounded-circle p-3 text-primary" style={{backgroundColor: "#e3f2fd"}}>
                      <i className="fas fa-users fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Active Sensors (REAL COUNT) */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted text-uppercase mb-1">Active Sensors</h6>
                      <h2 className="fw-bold mb-0">{stats.activeSensors}</h2>
                      <small className="text-muted" style={{fontSize: "0.75rem"}}>Temp, Hum, CO2, MQ135</small>
                    </div>
                    <div className="icon-box bg-soft-info rounded-circle p-3 text-info" style={{backgroundColor: "#e1f5fe"}}>
                      <i className="fas fa-microchip fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Active Alerts (REAL LOGIC) */}
              <div className="col-md-4">
                <div className={`card border-0 shadow-sm h-100 border-start border-4 border-${stats.alertCount > 0 ? "danger" : "success"}`}>
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted text-uppercase mb-1">System Alerts</h6>
                      <h2 className="fw-bold mb-0">{stats.alertCount}</h2>
                      <small className="text-muted" style={{fontSize: "0.75rem"}}>
                        {stats.alertCount > 0 ? "Thresholds Exceeded" : "All Systems Stable"}
                      </small>
                    </div>
                    <div className={`icon-box rounded-circle p-3 text-${stats.alertCount > 0 ? "danger" : "success"}`} style={{backgroundColor: stats.alertCount > 0 ? "#ffebee" : "#e8f5e9"}}>
                      <i className={`fas ${stats.alertCount > 0 ? "fa-exclamation-triangle" : "fa-check-circle"} fa-2x`}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Section (Fills remaining space) */}
            <div className="row g-3" style={{ flex: 1 }}>
              
              {/* Quick Actions Panel */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold">User Management</h5>
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="row w-100">
                      
                      {/* Action 1: Add User */}
                      <div className="col-md-6 mb-3">
                        <div className="card h-100 border-primary border-1 shadow-none" style={{borderStyle: 'dashed'}}>
                          <div className="card-body text-center p-4 hover-bg-light">
                            <div className="mb-3 text-primary">
                              <i className="fas fa-user-plus fa-3x"></i>
                            </div>
                            <h5 className="fw-bold">Register New User</h5>
                            <p className="text-muted small">Create account for a new client.</p>
                            <Link to="/add-user" className="btn btn-primary btn-sm stretched-link">
                              Add User
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Action 2: View Users */}
                      <div className="col-md-6 mb-3">
                        <div className="card h-100 border-dark border-1 shadow-none" style={{borderStyle: 'dashed'}}>
                          <div className="card-body text-center p-4">
                            <div className="mb-3 text-dark">
                              <i className="fas fa-users-cog fa-3x"></i>
                            </div>
                            <h5 className="fw-bold">Manage Users</h5>
                            <p className="text-muted small">View, Edit, or Delete existing users.</p>
                            <Link to="/view-users" className="btn btn-dark btn-sm stretched-link">
                              View All Users
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info Panel */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100 bg-dark text-white">
                  <div className="card-body p-4 d-flex flex-column justify-content-center text-center">
                    <div className="mb-4">
                      <img 
                        src={adminProfile}
                        alt="Admin" 
                        className="rounded-circle border border-3 border-white mb-3"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                      <h4>{adminName}</h4>
                      <p className="text-white-50">Super Admin</p>
                    </div>
                    <hr className="border-secondary"/>
                    <div className="d-grid gap-3">
                      <Link to="/profile" className="btn btn-outline-light">
                        <i className="fas fa-user-edit me-2"></i> Edit Profile
                      </Link>
                      <Link to="/change-password" className="btn btn-outline-light">
                        <i className="fas fa-key me-2"></i> Change Password
                      </Link>
                    </div>
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

export default AdminDashboard;