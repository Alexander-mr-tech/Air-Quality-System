import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Import Firestore

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();

  const [role, setRole] = useState(null); // Store user role
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Role on Mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Optional: Check local storage for speed
        const cachedRole = localStorage.getItem("userRole");
        if (cachedRole) {
           setRole(cachedRole);
           setLoading(false);
        }

        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().role || "User";
            setRole(userRole);
            localStorage.setItem("userRole", userRole); // Cache it
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Clear cache on logout
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#fff" : "rgba(255,255,255,0.7)",
    fontWeight: isActive(path) ? "600" : "400",
    textDecoration: "none",
    fontSize: "0.95rem",
    margin: "0 15px",
    padding: "8px 0",
    borderBottom: isActive(path) ? "2px solid #3498db" : "2px solid transparent",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  });

  // Determine Dashboard Path based on Role
  const dashboardPath = role === "Admin" ? "/admin-dashboard" : "/user-dashboard";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(to right, #2c3e50, #34495e)",
        padding: "0 30px",
        height: "70px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <div className="container-fluid px-0">
        
        {/* LEFT: Logo & Brand */}
        <div className="d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center bg-white rounded-circle me-3" 
            style={{ width: "40px", height: "40px", boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
          >
             <i className="fas fa-wind text-primary fs-5"></i>
          </div>
          
          <Link
            to={dashboardPath} // Smart Link
            className="navbar-brand d-flex flex-column"
            style={{ fontWeight: "700", letterSpacing: "0.5px", lineHeight: "1.2" }}
          >
            <span style={{ fontSize: "1.1rem", color: "#fff" }}>Air Quality Monitor</span>
            <span style={{ fontSize: "0.75rem", color: "#3498db", textTransform: "uppercase" }}>& Predictor System</span>
          </Link>
        </div>

        {/* RIGHT: Navigation Links & Actions */}
        <div className="d-flex align-items-center">
          
          {/* Nav Links (Hidden while loading to prevent flicker) */}
          {!loading && (
            <div className="d-none d-md-flex align-items-center me-4">
              
              {/* Common Link */}
              <Link to={dashboardPath} style={linkStyle(dashboardPath)}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>       
               
              {/* Common Profile Link */}
              <Link to="/profile" style={linkStyle("/profile")}>
                <i className="fas fa-user-circle"></i> Profile
              </Link>
            </div>
          )}

          {/* Vertical Separator */}
          <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.2)", marginRight: "20px" }} className="d-none d-md-block"></div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="btn btn-danger d-flex align-items-center gap-2"
            style={{
              borderRadius: "30px",
              padding: "8px 20px",
              fontSize: "0.9rem",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(231, 76, 60, 0.2)",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Sign Out <i className="fas fa-sign-out-alt"></i>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;