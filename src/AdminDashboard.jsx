// import React from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./components/NavBar"; // Import Navbar component
// import Sidebar from "./components/Sidebar"; // Import Sidebar component

// const AdminDashboard = () => {
//   return (
//     <div
//       style={{
//         display: "flex", // Flexbox to make the layout side by side
//         minHeight: "100vh", // Full viewport height
//         flexDirection: "column", // Navbar stays at the top
//       }}
//     >
//       {/* Navbar Component (fixed at the top) */}
//       <Navbar />

//       <div style={{ display: "flex", flex: 1 }}>
//         {/* Sidebar (fixed on the left side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div
//           style={{
//             marginLeft: "250px", // Create space for the sidebar (250px for Sidebar width)
//             padding: "20px",
//             width: "calc(100% - 250px)", // Take up the rest of the space for content
//             background: "linear-gradient(to bottom, #3498db, #2c3e50)", // Gradient background
//           }}
//         >
//           <div
//             className="card p-4"
//             style={{
//               width: "100%",
//               backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent card background
//               borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h2 className="text-center mb-4">Admin Dashboard</h2>
//             <p>Welcome to the admin dashboard! Here you can manage users, view reports, and more.</p>

//             {/* Add more features here for managing users, etc. */}

//             {/* Sign Out Button */}
//             <Link to="/signin" className="btn btn-danger w-100">
//               Sign Out
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/NavBar"; // Navbar Component
import Sidebar from "./components/Sidebar"; // Sidebar Component

const AdminDashboard = () => {
  return (
    <div
      style={{
        display: "flex", // Flexbox layout for the sidebar and content
        minHeight: "100vh", // Full height of the screen
        flexDirection: "column", // Keep Navbar on top
      }}
    >
      {/* Navbar */}
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          style={{
            marginLeft: "250px", // Create space for the sidebar (250px)
            padding: "20px",
            width: "calc(100% - 250px)", // Take up the remaining space for content
            background: "linear-gradient(to bottom, #3498db, #2c3e50)", // Gradient background
          }}
        >
          <div
            className="card p-4"
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <p>Welcome to the admin dashboard! Here you can manage users, view reports, and more.</p>

            {/* Add User, View Users, Remove User Sections */}
            <div className="container mt-4">
              <div className="row">
                {/* Add User Section */}
                <div className="col-md-4 mb-4">
                  <div
                    className="card"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h5 className="text-center">Add User</h5>
                    <p className="text-center">
                      Add a new user to the system. Fill out the form to create a user.
                    </p>
                    <Link to="/add-user" className="btn btn-primary w-100">
                      Go to Add User
                    </Link>
                  </div>
                </div>

                {/* View Users Section */}
                <div className="col-md-4 mb-4">
                  <div
                    className="card"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h5 className="text-center">View Users</h5>
                    <p className="text-center">
                      View a list of all users in the system. You can manage and edit them here.
                    </p>
                    <Link to="/view-users" className="btn btn-info w-100">
                      Go to View Users
                    </Link>
                  </div>
                </div>

                {/* Remove User Section */}
                <div className="col-md-4 mb-4">
                  <div
                    className="card"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h5 className="text-center">Remove User</h5>
                    <p className="text-center">
                      Remove a user from the system. Select the user to delete them.
                    </p>
                    <Link to="/remove-user" className="btn btn-danger w-100">
                      Go to Remove User
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
