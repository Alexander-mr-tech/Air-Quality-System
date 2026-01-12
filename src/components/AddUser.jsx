import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig } from "../firebase"; 

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name && email && password) {
      setLoading(true);
      try {
        // Create user in secondary app to avoid logging out admin
        const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const newUser = userCredential.user;
        await signOut(secondaryAuth);

        // Save to Firestore
        await setDoc(doc(db, "users", newUser.uid), {
          uid: newUser.uid,
          name: name,
          email: email,
          role: role, 
          createdAt: new Date()
        });

        alert(`User '${name}' created successfully!`);
        navigate("/view-users");
      } catch (error) {
        console.error("Error adding user: ", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    // 1. LOCK SCREEN HEIGHT (No outer scroll)
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        
        {/* MAIN CONTENT WRAPPER */}
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
          {/* COMPACT CARD */}
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "95vh", // Allow it to fit on screen
              overflowY: "auto", // Scroll only if absolutely needed
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              padding: "30px", // Reduced padding (was 40px)
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Header Section (Compacted) */}
            <div className="text-center mb-3">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm" style={{width: '50px', height: '50px'}}>
                 <i className="fas fa-user-plus fa-lg"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">Register New User</h3>
              <p className="text-muted small mb-0">Create access credentials for a new client.</p>
            </div>

            <form onSubmit={handleSubmit}>
              
              <div className="row g-2"> {/* g-2 for tighter spacing */}
                
                {/* Name Field */}
                <div className="col-md-8">
                   <label className="form-label fw-bold small mb-1">Full Name</label>
                   <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light"><i className="fas fa-user"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                   </div>
                </div>

                {/* Role Field */}
                <div className="col-md-4">
                   <label className="form-label fw-bold small mb-1">Role</label>
                   <select 
                     className="form-select form-select-sm" 
                     value={role} 
                     onChange={(e) => setRole(e.target.value)}
                   >
                     <option value="User">User</option>
                     <option value="Admin">Admin</option>
                   </select>
                </div>

                {/* Email Field */}
                <div className="col-12 mt-2">
                   <label className="form-label fw-bold small mb-1">Email Address</label>
                   <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light"><i className="fas fa-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                   </div>
                </div>

                {/* Password Field */}
                <div className="col-12 mt-2">
                   <label className="form-label fw-bold small mb-1">Password</label>
                   <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light"><i className="fas fa-lock"></i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                   </div>
                   <div className="form-text small" style={{fontSize: '0.75rem'}}>Must be at least 6 characters long.</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary shadow-sm" disabled={loading}>
                  {loading ? (
                    <span><i className="fas fa-spinner fa-spin me-2"></i> Creating...</span>
                  ) : (
                    "Create User Account"
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate("/admin-dashboard")}
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

export default AddUser;