// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Navbar from "./NavBar";
// // import Sidebar from "./Sidebar";

// // const ChangePassword = () => {
// //   const navigate = useNavigate();

// //   // State for password fields
// //   const [currentPassword, setCurrentPassword] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [error, setError] = useState("");

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setError(""); // Reset error message

// //     // 1. Basic Validation
// //     if (newPassword !== confirmPassword) {
// //       setError("New passwords do not match!");
// //       return;
// //     }

// //     if (newPassword.length < 6) {
// //       setError("Password must be at least 6 characters long.");
// //       return;
// //     }

// //     // 2. Simulate API Call
// //     console.log("Password Update Request:", { currentPassword, newPassword });
// //     alert("Password changed successfully!");
// //     navigate("/user-dashboard");
// //   };

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         minHeight: "100vh",
// //       }}
// //     >
// //       {/* Navbar */}
// //       <Navbar />

// //       <div style={{ display: "flex", flex: 1 }}>
// //         {/* Sidebar */}
// //         <Sidebar />

// //         {/* Main Content Area */}
// //         <div
// //           style={{
// //             flex: 1,
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             background: "linear-gradient(to bottom, #3498db, #2c3e50)",
// //             padding: "20px",
// //           }}
// //         >
// //           {/* Card */}
// //           <div
// //             style={{
// //               width: "100%",
// //               maxWidth: "500px", // Narrower card for password forms looks better
// //               backgroundColor: "rgba(255, 255, 255, 0.95)",
// //               padding: "40px",
// //               borderRadius: "10px",
// //               boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
// //             }}
// //           >
// //             <h2 className="text-center mb-4">Change Password</h2>

// //             {/* Error Message Alert */}
// //             {error && (
// //               <div className="alert alert-danger text-center" role="alert">
// //                 {error}
// //               </div>
// //             )}

// //             <form onSubmit={handleSubmit}>
// //               {/* Current Password */}
// //               <div className="mb-3">
// //                 <label htmlFor="currentPassword" style={{ fontWeight: "bold" }}>
// //                   Current Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   className="form-control"
// //                   id="currentPassword"
// //                   placeholder="Enter current password"
// //                   value={currentPassword}
// //                   onChange={(e) => setCurrentPassword(e.target.value)}
// //                   required
// //                 />
// //               </div>

// //               <hr className="my-4" />

// //               {/* New Password */}
// //               <div className="mb-3">
// //                 <label htmlFor="newPassword" style={{ fontWeight: "bold" }}>
// //                   New Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   className="form-control"
// //                   id="newPassword"
// //                   placeholder="Enter new password"
// //                   value={newPassword}
// //                   onChange={(e) => setNewPassword(e.target.value)}
// //                   required
// //                 />
// //               </div>

// //               {/* Confirm New Password */}
// //               <div className="mb-4">
// //                 <label htmlFor="confirmPassword" style={{ fontWeight: "bold" }}>
// //                   Confirm New Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   className="form-control"
// //                   id="confirmPassword"
// //                   placeholder="Re-enter new password"
// //                   value={confirmPassword}
// //                   onChange={(e) => setConfirmPassword(e.target.value)}
// //                   required
// //                 />
// //               </div>

// //               {/* Action Buttons */}
// //               <div className="d-grid gap-2">
// //                 <button type="submit" className="btn btn-primary">
// //                   Update Password
// //                 </button>
// //                 <button 
// //                   type="button" 
// //                   className="btn btn-outline-secondary"
// //                   onClick={() => navigate("/user-dashboard")}
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChangePassword;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";
// import { auth } from "../firebase"; // 1. Import Firebase Auth
// import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

// const ChangePassword = () => {
//   const navigate = useNavigate();

//   // Form States
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
  
//   // Visibility States (Show/Hide)
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // Status States
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // --- VALIDATION START ---

//     // 1. Check if passwords match
//     if (newPassword !== confirmPassword) {
//       setError("New passwords do not match!");
//       setLoading(false);
//       return;
//     }

//     // 2. Check password length
//     if (newPassword.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       setLoading(false);
//       return;
//     }

//     // 3. NEW CHECK: Current and New cannot be the same
//     if (currentPassword === newPassword) {
//       setError("New password cannot be the same as the current password.");
//       setLoading(false);
//       return;
//     }

//     // --- VALIDATION END ---

//     const user = auth.currentUser;

//     if (user) {
//       try {
//         // 4. Re-authenticate
//         const credential = EmailAuthProvider.credential(user.email, currentPassword);
//         await reauthenticateWithCredential(user, credential);

//         // 5. Update Password
//         await updatePassword(user, newPassword);

//         alert("Password changed successfully!");
//         navigate("/admin-dashboard");

//       } catch (err) {
//         console.error(err);
//         if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
//           setError("Incorrect current password.");
//         } else if (err.code === 'auth/requires-recent-login') {
//           setError("Please sign out and sign in again before changing password.");
//         } else {
//           setError("Failed to update password. " + err.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setError("No user logged in.");
//       setLoading(false);
//     }
//   };

//   // Helper to render the Eye Icon button
//   const toggleBtnStyle = {
//     top: "72%",
//     right: "10px",
//     transform: "translateY(-50%)",
//     cursor: "pointer",
//     color: "#333",
//     zIndex: 10
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       <Navbar />

//       <div style={{ display: "flex", flex: 1 }}>
//         <Sidebar />

//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)",
//             padding: "20px",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               backgroundColor: "rgba(255, 255, 255, 0.95)",
//               padding: "40px",
//               borderRadius: "10px",
//               boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
//             }}
//           >
//             <h2 className="text-center mb-4">Change Password</h2>

//             {error && <div className="alert alert-danger text-center">{error}</div>}

//             <form onSubmit={handleSubmit}>
              
//               {/* Current Password Field */}
//               <div className="mb-3 position-relative">
//                 <label className="form-label fw-bold">Current Password</label>
//                 <input
//                   type={showCurrent ? "text" : "password"}
//                   className="form-control"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   required
//                 />
//                 <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowCurrent(!showCurrent)}>
//                    <i className={showCurrent ? "fas fa-eye-slash" : "fas fa-eye"}></i>
//                 </span>
//               </div>

//               <hr className="my-4" />

//               {/* New Password Field */}
//               <div className="mb-3 position-relative">
//                 <label className="form-label fw-bold">New Password</label>
//                 <input
//                   type={showNew ? "text" : "password"}
//                   className="form-control"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//                 <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowNew(!showNew)}>
//                    <i className={showNew ? "fas fa-eye-slash" : "fas fa-eye"}></i>
//                 </span>
//               </div>

//               {/* Confirm Password Field */}
//               <div className="mb-4 position-relative">
//                 <label className="form-label fw-bold">Confirm New Password</label>
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   className="form-control"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//                 <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowConfirm(!showConfirm)}>
//                    <i className={showConfirm ? "fas fa-eye-slash" : "fas fa-eye"}></i>
//                 </span>
//               </div>

//               <div className="d-grid gap-2">
//                 <button type="submit" className="btn btn-primary" disabled={loading}>
//                   {loading ? "Updating..." : "Update Password"}
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn btn-outline-secondary"
//                   onClick={() => navigate("/admin-dashboard")}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { auth, db } from "../firebase"; // 1. Import db for Role Check
import { doc, getDoc } from "firebase/firestore"; // 2. Firestore imports
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const ChangePassword = () => {
  const navigate = useNavigate();

  // Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User"); // 3. State to store Role
  
  // Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 4. Fetch User Role on Mount
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role || "User");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };
    fetchUserRole();
  }, []);

  // 5. Smart Navigation Helper
  const handleNavigation = () => {
    if (role === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password cannot be the same as the current password.");
      setLoading(false);
      return;
    }

    const user = auth.currentUser;

    if (user) {
      try {
        // Re-authenticate
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update Password
        await updatePassword(user, newPassword);

        alert("Password changed successfully!");
        handleNavigation(); // <--- Redirect based on Role

      } catch (err) {
        console.error(err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          setError("Incorrect current password.");
        } else if (err.code === 'auth/requires-recent-login') {
          setError("Please sign out and sign in again before changing password.");
        } else {
          setError("Failed to update password. " + err.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("No user logged in.");
      setLoading(false);
    }
  };

  const toggleBtnStyle = {
    top: "72%",
    right: "10px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#333",
    zIndex: 10
  };

  return (
    // 6. FIX: Lock Screen Height & Layout
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* MAIN WRAPPER */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px", // Align next to sidebar
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to bottom, #3498db, #2c3e50)",
            padding: "20px",
            overflow: "hidden" 
          }}
        >
          {/* CARD CONTAINER */}
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              padding: "40px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2 className="text-center mb-4">Change Password</h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              
              {/* Current Password Field */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-bold">Current Password</label>
                <input
                  type={showCurrent ? "text" : "password"}
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowCurrent(!showCurrent)}>
                   <i className={showCurrent ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </span>
              </div>

              <hr className="my-4" />

              {/* New Password Field */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-bold">New Password</label>
                <input
                  type={showNew ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowNew(!showNew)}>
                   <i className={showNew ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4 position-relative">
                <label className="form-label fw-bold">Confirm New Password</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="position-absolute" style={toggleBtnStyle} onClick={() => setShowConfirm(!showConfirm)}>
                   <i className={showConfirm ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </span>
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={handleNavigation} // Smart Cancel
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;