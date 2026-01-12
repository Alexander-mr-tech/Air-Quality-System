import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { auth, db } from "../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 

const UpdateProfile = () => {
  const navigate = useNavigate();

  // State
  const [uid, setUid] = useState(null);
  const [role, setRole] = useState(""); // Store Role for smart navigation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Data & Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUid(currentUser.uid);
        setEmail(currentUser.email);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setAge(data.age || "");
            setGender(data.gender || "");
            setPhone(data.phone || "");
            setAddress(data.address || "");
            setRole(data.role || "User"); // Capture the role
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/signin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Smart Navigation Helper
  const handleNavigation = () => {
    if (role === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  // 3. Update Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid) return;
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        name, age, gender, phone, address
      });
      
      alert("Profile updated successfully!");
      handleNavigation(); // Redirect based on role

    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* MAIN WRAPPER */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px", 
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
              maxWidth: "800px", // Made slightly wider to fit fields better
              maxHeight: "95vh", // Ensure it fits on screen
              overflowY: "auto", // Scroll only if absolutely necessary
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              padding: "25px", // Reduced padding (was 40px)
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 className="text-center mb-3 fw-bold">General Information</h3>
            
            <div className="text-center mb-3">
               <img 
                src="https://via.placeholder.com/100" 
                alt="Profile" 
                className="rounded-circle shadow-sm"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid #3498db" }} // Reduced size
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3"> {/* g-3 adds cleaner spacing than mb-3 */}
                
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm" // Smaller inputs
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Email (Read Only)</label>
                  <input
                    type="email"
                    className="form-control form-control-sm bg-light"
                    value={email}
                    disabled 
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Age</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">Gender</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold small">Address</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, Country"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-grow-1">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary flex-grow-1"
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

export default UpdateProfile;