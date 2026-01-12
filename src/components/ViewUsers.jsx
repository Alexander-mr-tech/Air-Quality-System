// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";
// import { db } from "../firebase"; // 1. Import Firebase DB
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // 2. Import Firestore functions

// const ViewUsers = () => {
//   // 3. Use State instead of hardcoded array
//   const [users, setUsers] = useState([]); 
//   const [loading, setLoading] = useState(true); // Add loading state

//   // 4. Fetch Users from Firestore on Load
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const userList = querySnapshot.docs.map((doc) => ({
//           id: doc.id, // Get the Document ID
//           ...doc.data(), // Get the data (name, email, etc.)
//         }));
//         setUsers(userList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // 5. Delete User Function
//   const handleDelete = async (id) => {
//     // Confirm before deleting
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         // Delete from Firestore
//         await deleteDoc(doc(db, "users", id));
        
//         // Remove from UI immediately (so page doesn't need reload)
//         setUsers(users.filter((user) => user.id !== id));
//         alert("User deleted successfully.");
//       } catch (error) {
//         console.error("Error deleting user:", error);
//         alert("Failed to delete user.");
//       }
//     }
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
//             alignItems: "flex-start",
//             padding: "40px",
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)",
//             overflowY: "auto",
//           }}
//         >
//           <div
//             style={{
//               padding: "30px",
//               backgroundColor: "rgba(255, 255, 255, 0.95)",
//               borderRadius: "10px",
//               boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
//               width: "100%",
//               maxWidth: "1000px",
//             }}
//           >
//             <h2 className="text-center mb-4">View Users</h2>
//             <p className="text-center mb-4">
//               Below is the list of all users currently in the system. You can manage them here.
//             </p>

//             {/* Show Loading Spinner or Table */}
//             {loading ? (
//               <div className="text-center">Loading users...</div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover">
//                   <thead className="table-light">
//                     <tr>
//                       {/* Removed # ID column as Firebase IDs are long and ugly */}
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Role</th> {/* Added Role column if you have it */}
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.length > 0 ? (
//                       users.map((user) => (
//                         <tr key={user.id}>
//                           <td>{user.name || "No Name"}</td>
//                           <td>{user.email}</td>
//                           <td>{user.role || "User"}</td>
//                           <td>
//                             <Link
//                               to={`/edit-user/${user.id}`}
//                               className="btn btn-warning btn-sm me-2"
//                             >
//                               Edit
//                             </Link>
//                             <button
//                               className="btn btn-danger btn-sm"
//                               onClick={() => handleDelete(user.id)} // Call delete function
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No users found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="mt-4">
//               <Link to="/admin-dashboard" className="btn btn-secondary w-100">
//                 Back to Dashboard
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewUsers;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { db } from "../firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; 

const ViewUsers = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(), 
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((user) => user.id !== id));
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    // 3. FIX: Lock Screen Height (No Body Scroll)
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* MAIN CONTENT WRAPPER */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px", // 4. FIX: Align next to Sidebar
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start", // Start content from top
            padding: "30px", // Comfortable padding
            background: "linear-gradient(to bottom, #3498db, #2c3e50)",
            overflow: "hidden" // Prevent outer scrolling
          }}
        >
          {/* SCROLLABLE CARD CONTAINER */}
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              maxHeight: "90vh", // 5. FIX: Restrict height so only this card scrolls
              overflowY: "auto", // Enable internal scrolling
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0 fw-bold">User Management</h2>
              <span className="badge bg-primary rounded-pill px-3 py-2">
                Total: {users.length}
              </span>
            </div>
            
            <p className="text-muted mb-4">
              Manage all registered users in the system. Use the actions column to edit details or remove access.
            </p>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading user database...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="fw-bold text-primary">
                            <i className="fas fa-user-circle me-2 text-secondary"></i>
                            {user.name || "No Name"}
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge bg-${user.role === 'Admin' ? 'dark' : 'info'}`}>
                              {user.role || "User"}
                            </span>
                          </td>
                          <td className="text-center">
                            <Link
                              to={`/edit-user/${user.id}`}
                              className="btn btn-outline-warning btn-sm me-2"
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(user.id)}
                              title="Delete User"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          <i className="fas fa-users-slash fa-3x mb-3"></i>
                          <p>No users found in the database.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 pt-3 border-top">
              <Link to="/admin-dashboard" className="btn btn-secondary w-100">
                <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;