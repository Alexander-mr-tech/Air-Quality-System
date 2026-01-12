// // import { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { auth, db } from "../firebase"; 
// // import { doc, getDoc } from "firebase/firestore";
// // import { signOut, onAuthStateChanged } from "firebase/auth";

// // const Sidebar = () => {
// //   const [hoveredLink, setHoveredLink] = useState(null);
// //   const navigate = useNavigate();

// //   // Initial State
// //   const [userData, setUserData] = useState({
// //     name: "Loading...",
// //     email: "...",
// //     role: "User", 
// //     photoURL: "/assets/profile.png"
// //   });

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
// //       if (currentUser) {
// //         // 1. Setup Default Data from Login
// //         let newUserData = {
// //           name: currentUser.displayName || "User", 
// //           email: currentUser.email,
// //           role: "User",
// //           photoURL: currentUser.photoURL || "/assets/profile.png"
// //         };

// //         try {
// //           console.log("Fetching profile for UID:", currentUser.uid); // DEBUG LOG

// //           // 2. Fetch from Firestore
// //           const docRef = doc(db, "users", currentUser.uid);
// //           const docSnap = await getDoc(docRef);

// //           if (docSnap.exists()) {
// //             const dbData = docSnap.data();
// //             console.log("Database Data Found:", dbData); // DEBUG LOG

// //             // 3. Smart Merge: Check 'name', 'username', or 'fullName'
// //             newUserData = {
// //               ...newUserData,
// //               // Check all common variations of name
// //               name: dbData.name || dbData.username || dbData.fullName || newUserData.name,
// //               role: dbData.role || "User",
// //             };
// //           } else {
// //             console.warn("No document found in 'users' collection with ID:", currentUser.uid);
// //           }
// //         } catch (error) {
// //           console.error("Error fetching user data:", error);
// //         }

// //         // 4. Update State
// //         setUserData(newUserData);

// //       } else {
// //         setUserData({ name: "Guest", email: "", role: "", photoURL: "/assets/profile.png" });
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   const handleSignOut = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await signOut(auth);
// //       navigate("/signin");
// //     } catch (error) {
// //       console.error("Error signing out:", error);
// //     }
// //   };

// //   // Styles
// //   const hoverStyle = { backgroundColor: "#34495e", color: "white", borderRadius: "4px" };
// //   const linkStyle = { padding: "10px 15px", fontSize: "1rem", fontWeight: "500", borderBottom: "2px solid #34495e", textDecoration: "none", color: "white", width: "100%", textAlign: "center", display: "block", cursor: "pointer" };

// //   return (
// //     <div
// //       style={{
// //         height: "100vh",
// //         width: "250px",
// //         backgroundColor: "#2c3e50",
// //         color: "white",
// //         position: "fixed",
// //         left: 0,
// //         top: 66,
// //         zIndex: 1000,
// //         borderRight: "2px solid #34495e",
// //         boxShadow: "4px 0 8px rgba(0, 0, 0, 0.1)",
// //       }}
// //     >
// //       {/* Profile Section */}
// //       <div className="text-center" style={{ padding: "10px" }}>
// //         <img
// //           src={userData.photoURL}
// //           alt="Profile"
// //           style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "10px", border: "5px solid #ecf0f1", padding: "3px" }}
// //         />
// //         <h5 style={{ margin: "0", fontSize: "1.2rem", fontWeight: "bold" }}>{userData.name}</h5>
// //         <p style={{ fontSize: "0.9rem", color: "#ecf0f1", marginBottom: "5px" }}>{userData.email}</p>
        
// //         {/* Role Badge */}
// //         <span className={`badge ${userData.role === 'Admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
// //           {userData.role}
// //         </span>
// //       </div>

// //       <ul className="nav flex-column" style={{ paddingLeft: 0, marginTop: "20px" }}>
        
// //         <li className="nav-item">
// //           <Link
// //             to={userData.role === "Admin" ? "/admin-dashboard" : "/user-dashboard"}
// //             className="nav-link text-light"
// //             style={hoveredLink === "dashboard" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //             onMouseEnter={() => setHoveredLink("dashboard")}
// //             onMouseLeave={() => setHoveredLink(null)}
// //           >
// //             Dashboard
// //           </Link>
// //         </li>

// //         {/* ADMIN LINKS - Only show if role is exactly 'Admin' */}
// //         {userData.role === "Admin" && (
// //           <>
// //             <li className="nav-item">
// //               <Link
// //                 to="/add-user"
// //                 className="nav-link text-light"
// //                 style={hoveredLink === "add-user" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //                 onMouseEnter={() => setHoveredLink("add-user")}
// //                 onMouseLeave={() => setHoveredLink(null)}
// //               >
// //                 Add User
// //               </Link>
// //             </li>
// //             <li className="nav-item">
// //               <Link
// //                 to="/view-users"
// //                 className="nav-link text-light"
// //                 style={hoveredLink === "users" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //                 onMouseEnter={() => setHoveredLink("users")}
// //                 onMouseLeave={() => setHoveredLink(null)}
// //               >
// //                 View Users
// //               </Link>
// //             </li>
// //           </>
// //         )}

// //           {/* User LINKS - Only show if role is exactly 'User' */}
// //         {userData.role === "Admin" && (
// //           <>
// //             <li className="nav-item">
// //               <Link
// //                 to="/sensor-data"
// //                 className="nav-link text-light"
// //                 style={hoveredLink === "add-user" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //                 onMouseEnter={() => setHoveredLink("add-user")}
// //                 onMouseLeave={() => setHoveredLink(null)}
// //               >
// //                 Sensor Data
// //               </Link>
// //             </li>
// //             <li className="nav-item">
// //               <Link
// //                 to="/Machine-Learning Models"
// //                 className="nav-link text-light"
// //                 style={hoveredLink === "users" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //                 onMouseEnter={() => setHoveredLink("users")}
// //                 onMouseLeave={() => setHoveredLink(null)}
// //               >
// //                 Machine-Learning Models
// //               </Link>
// //             </li>
// //           </>
// //         )}

// //         <li className="nav-item">
// //           <Link
// //             to="/profile"
// //             className="nav-link text-light"
// //             style={hoveredLink === "profile" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //             onMouseEnter={() => setHoveredLink("profile")}
// //             onMouseLeave={() => setHoveredLink(null)}
// //           >
// //             Update Profile
// //           </Link>
// //         </li>
// //         <li className="nav-item">
// //           <Link
// //             to="/change-password"
// //             className="nav-link text-light"
// //             style={hoveredLink === "change-password" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //             onMouseEnter={() => setHoveredLink("change-password")}
// //             onMouseLeave={() => setHoveredLink(null)}
// //           >
// //             Change Password
// //           </Link>
// //         </li>
        
// //         <li className="nav-item">
// //           <a
// //             href="#signout"
// //             onClick={handleSignOut}
// //             className="nav-link text-light"
// //             style={hoveredLink === "signin" ? { ...linkStyle, ...hoverStyle } : linkStyle}
// //             onMouseEnter={() => setHoveredLink("signin")}
// //             onMouseLeave={() => setHoveredLink(null)}
// //           >
// //             Sign Out
// //           </a>
// //         </li>
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Sidebar;


// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { auth, db } from "../firebase"; 
// import { doc, getDoc } from "firebase/firestore";
// import { signOut, onAuthStateChanged } from "firebase/auth";

// const Sidebar = () => {
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const navigate = useNavigate();

//   // Initial State
//   const [userData, setUserData] = useState({
//     name: "Loading...",
//     email: "...",
//     role: "User", 
//     photoURL: "/assets/profile.png"
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         let newUserData = {
//           name: currentUser.displayName || "User", 
//           email: currentUser.email,
//           role: "User",
//           photoURL: currentUser.photoURL || "/assets/profile.png"
//         };

//         try {
//           const docRef = doc(db, "users", currentUser.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const dbData = docSnap.data();
//             newUserData = {
//               ...newUserData,
//               name: dbData.name || dbData.username || newUserData.name,
//               role: dbData.role || "User",
//             };
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//         setUserData(newUserData);
//       } else {
//         setUserData({ name: "Guest", email: "", role: "", photoURL: "/assets/profile.png" });
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async (e) => {
//     e.preventDefault();
//     try {
//       await signOut(auth);
//       navigate("/signin");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   // Styles
//   const hoverStyle = { backgroundColor: "#34495e", color: "white", borderRadius: "4px" };
//   const linkStyle = { padding: "10px 15px", fontSize: "1rem", fontWeight: "500", borderBottom: "2px solid #34495e", textDecoration: "none", color: "white", width: "100%", textAlign: "center", display: "block", cursor: "pointer" };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         width: "250px",
//         backgroundColor: "#2c3e50",
//         color: "white",
//         position: "fixed",
//         left: 0,
//         top: 66,
//         zIndex: 1000,
//         borderRight: "2px solid #34495e",
//         boxShadow: "4px 0 8px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       {/* Profile Section */}
//       <div className="text-center" style={{ padding: "10px" }}>
//         <img
//           src={userData.photoURL}
//           alt="Profile"
//           style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "10px", border: "5px solid #ecf0f1", padding: "3px" }}
//         />
//         <h5 style={{ margin: "0", fontSize: "1.2rem", fontWeight: "bold" }}>{userData.name}</h5>
//         <p style={{ fontSize: "0.9rem", color: "#ecf0f1", marginBottom: "5px" }}>{userData.email}</p>
        
//         <span className={`badge ${userData.role === 'Admin' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
//           {userData.role}
//         </span>
//       </div>

//       <ul className="nav flex-column" style={{ paddingLeft: 0, marginTop: "20px" }}>
        
//         <li className="nav-item">
//           <Link
//             to={userData.role === "Admin" ? "/admin-dashboard" : "/user-dashboard"}
//             className="nav-link text-light"
//             style={hoveredLink === "dashboard" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//             onMouseEnter={() => setHoveredLink("dashboard")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             Dashboard
//           </Link>
//         </li>

//         {/* --- ADMIN LINKS --- */}
//         {userData.role === "Admin" && (
//           <>
//             <li className="nav-item">
//               <Link
//                 to="/add-user"
//                 className="nav-link text-light"
//                 style={hoveredLink === "add-user" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//                 onMouseEnter={() => setHoveredLink("add-user")}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Add User
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link
//                 to="/view-users"
//                 className="nav-link text-light"
//                 style={hoveredLink === "users" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//                 onMouseEnter={() => setHoveredLink("users")}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 View Users
//               </Link>
//             </li>
//           </>
//         )}

//         {/* --- USER LINKS (Sensor, Map, Predictions) --- */}
//         {userData.role === "User" && (
//           <>
//             <li className="nav-item">
//               <Link
//                 to="/sensor-data"
//                 className="nav-link text-light"
//                 style={hoveredLink === "sensor" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//                 onMouseEnter={() => setHoveredLink("sensor")}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Sensor Data
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link
//                 to="/google-map"
//                 className="nav-link text-light"
//                 style={hoveredLink === "map" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//                 onMouseEnter={() => setHoveredLink("map")}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Live Weather Data
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link
//                 to="/predictions"
//                 className="nav-link text-light"
//                 style={hoveredLink === "predict" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//                 onMouseEnter={() => setHoveredLink("predict")}
//                 onMouseLeave={() => setHoveredLink(null)}
//               >
//                 Predictions
//               </Link>
//             </li>
//           </>
//         )}

//         {/* --- COMMON LINKS --- */}
//         <li className="nav-item">
//           <Link
//             to="/profile"
//             className="nav-link text-light"
//             style={hoveredLink === "profile" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//             onMouseEnter={() => setHoveredLink("profile")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             Update Profile
//           </Link>
//         </li>
//         <li className="nav-item">
//           <Link
//             to="/change-password"
//             className="nav-link text-light"
//             style={hoveredLink === "change-password" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//             onMouseEnter={() => setHoveredLink("change-password")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             Change Password
//           </Link>
//         </li>
        
//         <li className="nav-item">
//           <a
//             href="#signout"
//             onClick={handleSignOut}
//             className="nav-link text-light"
//             style={hoveredLink === "signin" ? { ...linkStyle, ...hoverStyle } : linkStyle}
//             onMouseEnter={() => setHoveredLink("signin")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             Sign Out
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;


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