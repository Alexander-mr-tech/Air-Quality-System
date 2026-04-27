import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current route for highlighting

  // State
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "", // Start empty to prevent wrong menu flash
    photoURL: "/assets/profile.png"
  });
  const [loading, setLoading] = useState(true); // Loading state control

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Check LocalStorage for instant load (prevents flicker)
        const cachedRole = localStorage.getItem("userRole");
        const cachedName = localStorage.getItem("userName");
        
        if (cachedRole && cachedName) {
           setUserData(prev => ({ ...prev, role: cachedRole, name: cachedName, email: currentUser.email }));
           setLoading(false); 
        }

        // 2. Fetch fresh data from Firestore to ensure accuracy
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const dbData = docSnap.data();
            const role = dbData.role || "User";
            const name = dbData.name || dbData.username || currentUser.displayName || "User";

            // Update State
            setUserData({
              name: name,
              email: currentUser.email,
              role: role,
              photoURL: currentUser.photoURL || "/assets/profile.png"
            });

            // Update Cache
            localStorage.setItem("userRole", role);
            localStorage.setItem("userName", name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData({ name: "Guest", email: "", role: "", photoURL: "" });
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
      }
      setLoading(false); // Stop loading spinner
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.clear(); // Clear cache on logout
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- STYLES ---
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: isActive(path) ? "#ffffff" : "rgba(255,255,255,0.7)",
    backgroundColor: isActive(path) ? "rgba(255,255,255,0.1)" : "transparent",
    borderLeft: isActive(path) ? "4px solid #3498db" : "4px solid transparent",
    transition: "all 0.3s ease",
    cursor: "pointer"
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "250px",
        background: "linear-gradient(to bottom, #2c3e50, #34495e)", // Professional Gradient
        color: "white",
        position: "fixed",
        left: 0,
        top: 66, // Adjust based on your Navbar height
        zIndex: 900,
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto"
      }}
    >
      {/* 1. Profile Section */}
      <div className="text-center py-4 border-bottom border-secondary">
        {loading ? (
           // Skeleton Loader while fetching
           <div className="spinner-border text-light" role="status"></div>
        ) : (
          <>
            <img
              src={userData.photoURL}
              alt="Profile"
              className="rounded-circle shadow-sm"
              style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)", marginBottom: "10px" }}
            />
            <h6 className="mb-0 fw-bold">{userData.name}</h6>
            <small className="text-white-50 d-block mb-2" style={{fontSize: "0.75rem"}}>{userData.email}</small>
            <span className={`badge ${userData.role === 'Admin' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
              {userData.role}
            </span>
          </>
        )}
      </div>

      {/* 2. Navigation Links */}
      <div className="flex-grow-1 py-3">
        
        {/* COMMON: Dashboard */}
        <Link to={userData.role === "Admin" ? "/admin-dashboard" : "/user-dashboard"} style={linkStyle(userData.role === "Admin" ? "/admin-dashboard" : "/user-dashboard")}>
          <i className="fas fa-tachometer-alt me-3" style={{width: "20px"}}></i> Dashboard
        </Link>

        {/* LOADING CHECK: Don't show menus until role is known */}
        {!loading && (
          <>
            {/* ADMIN LINKS */}
            {userData.role === "Admin" && (
              <>
                <div className="text-uppercase text-white-50 px-3 mt-3 mb-1" style={{fontSize: "0.75rem", letterSpacing: "1px"}}>Management</div>
                
                <Link to="/add-user" style={linkStyle("/add-user")}>
                  <i className="fas fa-user-plus me-3" style={{width: "20px"}}></i> Add User
                </Link>
                <Link to="/view-users" style={linkStyle("/view-users")}>
                  <i className="fas fa-users me-3" style={{width: "20px"}}></i> View Users
                </Link>
              </>
            )}

            {/* USER LINKS */}
            {userData.role === "User" && (
              <>
                <div className="text-uppercase text-white-50 px-3 mt-3 mb-1" style={{fontSize: "0.75rem", letterSpacing: "1px"}}>Monitoring</div>
                
                <Link to="/sensor-data" style={linkStyle("/sensor-data")}>
                  <i className="fas fa-microchip me-3" style={{width: "20px"}}></i> Sensor Data
                </Link>
                <Link to="/google-map" style={linkStyle("/google-map")}>
                  <i className="fas fa-map-marked-alt me-3" style={{width: "20px"}}></i> Live Map
                </Link>
                <Link to="/predictions" style={linkStyle("/predictions")}>
                  <i className="fas fa-chart-line me-3" style={{width: "20px"}}></i> Predictions
                </Link>
                <Link to="/history" style={linkStyle("/history")}>
                  <i className="fas fa-history me-3" style={{width: "20px"}}></i> History
                </Link>
              </>
            )}
          </>
        )}

        {/* COMMON: Settings */}
        <div className="text-uppercase text-white-50 px-3 mt-3 mb-1" style={{fontSize: "0.75rem", letterSpacing: "1px"}}>Settings</div>
        
        <Link to="/profile" style={linkStyle("/profile")}>
          <i className="fas fa-user-circle me-3" style={{width: "20px"}}></i> Profile
        </Link>
        <Link to="/change-password" style={linkStyle("/change-password")}>
          <i className="fas fa-key me-3" style={{width: "20px"}}></i> Password
        </Link>
      </div>

      {/* 3. Footer / Logout */}
      <div className="p-3 border-top border-secondary bg-dark bg-opacity-25">
        <a
          href="#signout"
          onClick={handleSignOut}
          className="d-flex align-items-center text-light text-decoration-none"
          style={{ transition: "0.3s" }}
        >
          <i className="fas fa-sign-out-alt me-3 text-danger"></i>
          <span className="fw-bold">Sign Out</span>
        </a>
      </div>

    </div>
  );
};

export default Sidebar;