import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign-out logic if needed (e.g., clear tokens)
    navigate("/signin");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: "#2c3e50",
        padding: "10px 20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo & Title */}
        <div className="d-flex align-items-center">
          <img
            src="/assets/icon.png" // <-- Place your logo image in public/assets/
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: "50%" }}
          />
          <Link
            to="/admin-dashboard"
            className="navbar-brand"
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ecf0f1" }}
          >
            Air Quality Monitor & Predictor
          </Link>
        </div>

        {/* Navbar Links (Optional) */}
        <div className="d-flex align-items-center">
          <Link
            to="/admin-dashboard"
            className="nav-link text-light mx-2"
            style={{ fontSize: "1rem" }}
          >
            Dashboard
          </Link>
          <Link
            to="/manage-users"
            className="nav-link text-light mx-2"
            style={{ fontSize: "1rem" }}
          >
            Users
          </Link>
          <Link
            to="/profile"
            className="nav-link text-light mx-2"
            style={{ fontSize: "1rem" }}
          >
            Profile
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="btn btn-danger"
            style={{
              marginLeft: "15px",
              borderRadius: "20px",
              fontWeight: "500",
              padding: "6px 15px",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
