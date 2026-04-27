// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";
// import { db } from "../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState(""); 
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const docRef = doc(db, "users", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setName(data.name || "");
//           setEmail(data.email || "");
//           setRole(data.role || "User");
//         } else {
//           alert("User not found!");
//           navigate("/view-users");
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id, navigate]);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const docRef = doc(db, "users", id);
//       await updateDoc(docRef, {
//         name: name,
//         email: email,
//         role: role
//       });
//       alert("User updated successfully!");
//       navigate("/view-users");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       alert("Failed to update user.");
//     }
//   };

//   // ❌ REMOVED THE EARLY RETURN HERE

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       {/* 1. Navbar is always visible */}
//       <Navbar />

//       <div style={{ display: "flex", flex: 1 }}>
//         {/* 2. Sidebar is always visible */}
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
//           {/* 3. Loading check is NOW inside the content area */}
//           {loading ? (
//              <div className="text-white text-center">
//                 <div className="spinner-border text-light" role="status"></div>
//                 <div className="mt-2">Loading User...</div>
//              </div>
//           ) : (
//             /* Form Card (Only shows when loading is false) */
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 backgroundColor: "rgba(255, 255, 255, 0.95)",
//                 padding: "40px",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//               }}
//             >
//               <h2 className="text-center mb-4">Edit User</h2>
//               <p className="text-center text-muted small mb-4">ID: {id}</p>

//               <form onSubmit={handleUpdate}>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="role" className="form-label">Role</label>
//                   <select 
//                     className="form-select" 
//                     value={role} 
//                     onChange={(e) => setRole(e.target.value)}
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="User">User</option>
//                   </select>
//                 </div>

//                 <div className="d-flex gap-2">
//                   <button type="submit" className="btn btn-success flex-grow-1">
//                     Save Changes
//                   </button>
//                   <button 
//                     type="button" 
//                     className="btn btn-secondary"
//                     onClick={() => navigate("/view-users")}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditUser;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setEmail(data.email || "");
          setRole(data.role || "User");
        } else {
          navigate("/view-users");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, { name, email, role });
      alert("Success: Account updated.");
      navigate("/view-users");
    } catch (error) {
      alert("Error updating record.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, marginTop: "66px" }}> {/* Navbar height ki space */}
        <Sidebar />

        {/* Main Workspace */}
        <div
          style={{
            flex: 1,
            marginLeft: "260px", // Sidebar width ke barabar margin
            backgroundColor: "#f4f7f6",
            padding: "40px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div style={{ width: "100%", maxWidth: "550px" }}>
            
            {/* Breadcrumb / Path */}
            <div className="mb-4 text-muted small">
              <i className="fas fa-home me-2"></i> Management / <span className="text-primary">Edit User</span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
                
                {/* Visual Header */}
                <div className="p-4 bg-primary text-white text-center">
                  <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{width: "70px", height: "70px"}}>
                     <i className="fas fa-user-edit text-primary fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Update Credentials</h4>
                  <p className="opacity-75 small mb-0">Record ID: {id}</p>
                </div>

                <div className="card-body p-4 p-lg-5">
                  <form onSubmit={handleUpdate}>
                    
                    {/* Input Field */}
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary small">FULL NAME</label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 bg-light"
                        style={{ borderRadius: "12px", fontSize: "1rem" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary small">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        className="form-control form-control-lg border-0 bg-light"
                        style={{ borderRadius: "12px", fontSize: "1rem" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small">ACCESS LEVEL</label>
                      <select 
                        className="form-select form-select-lg border-0 bg-light"
                        style={{ borderRadius: "12px", fontSize: "1rem" }}
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Admin">Administrator</option>
                        <option value="User">Standard User</option>
                      </select>
                    </div>

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary btn-lg fw-bold shadow-sm" style={{ borderRadius: "12px" }}>
                        SAVE CHANGES
                      </button>
                      <button type="button" className="btn btn-light btn-lg text-muted fw-bold" style={{ borderRadius: "12px" }} onClick={() => navigate("/view-users")}>
                        CANCEL
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;