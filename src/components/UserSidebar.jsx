import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  // Hover styles
  const hoverStyle = {
    backgroundColor: "#34495e", // Darken the background on hover
    color: "white", // Change the text color to white
    borderRadius: "4px", // Add rounded corners to the link
  };

  // Default styles for the link
  const linkStyle = {
    padding: "10px 15px",
    fontSize: "1rem",
    fontWeight: "500",
    borderBottom: "2px solid #34495e", // Border below each link
    textDecoration: "none",
    color: "white", // Default text color
    width: "100%", // Ensure links take full width inside the sidebar
    textAlign: "center", // Center align text inside links
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "250px",
        backgroundColor: "#2c3e50", // Dark background for sidebar
        color: "white",
        position: "fixed",
        left: 0,
        top: 66,
        zIndex: 1000,
        borderRight: "2px solid #34495e", // Adding a border to the sidebar
        boxShadow: "4px 0 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      }}
    >
      <div className="text-center" style={{ padding: "10px" }}>
        {/* Profile Section */}
        <img
          src="/assets/profile.png" // Update with the correct image path
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "10px",
            border: "5px solid #ecf0f1", // Adding a border around the profile image
            padding: "3px", // Adding some space between the border and the image
          }}
        />
        <h5 style={{ margin: "0", fontSize: "1.2rem", fontWeight: "bold" }}>
          John Doe
        </h5>
        <p style={{ fontSize: "0.9rem", color: "#ecf0f1" }}>
          user@example.com
        </p>
      </div>

      {/* Nav items centered */}
      <ul className="nav flex-column" style={{ paddingLeft: 0 }}>
        <li className="nav-item">
          <Link
            to="/user-dashboard"
            className="nav-link text-light"
            style={hoveredLink === "dashboard" ? { ...linkStyle, ...hoverStyle } : linkStyle}
            onMouseEnter={() => setHoveredLink("dashboard")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/profile"
            className="nav-link text-light"
            style={hoveredLink === "profile" ? { ...linkStyle, ...hoverStyle } : linkStyle}
            onMouseEnter={() => setHoveredLink("profile")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Update Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/change-password"
            className="nav-link text-light"
            style={hoveredLink === "change-password" ? { ...linkStyle, ...hoverStyle } : linkStyle}
            onMouseEnter={() => setHoveredLink("change-password")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Change Password
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/signin"
            className="nav-link text-light"
            style={hoveredLink === "signin" ? { ...linkStyle, ...hoverStyle } : linkStyle}
            onMouseEnter={() => setHoveredLink("signin")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
