import { useState, useEffect } from "react";
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