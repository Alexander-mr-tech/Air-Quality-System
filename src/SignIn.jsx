// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Mock user authentication
//     if (email === "admin@gmail.com" && password === "admin") {
//       navigate("/admin-dashboard");
//     } else if (email === "user@gmail.com" && password === "user") {
//       navigate("/user-dashboard");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div
//       style={{
//         background: "url('/assets/background.jpg') no-repeat center center fixed",
//         backgroundSize: "cover",
//         height: "100vh",
//         fontFamily: "Arial, sans-serif",
//         // color: "white",
//       }}
//       className="d-flex justify-content-center align-items-center"
//     >
//       {/* Semi-transparent overlay */}
//       <div
//         style={{
//           position: "absolute",
//           top: "0",
//           left: "0",
//           right: "0",
//           bottom: "0",
//           background: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
//           zIndex: "-1",
//         }}
//       ></div>

//       {/* Card for the form */}
//       <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
//         <h2 className="text-center mb-4">Sign In</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">Email</label>
//             <input
//               type="email"
//               id="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">Password</label>
//             <input
//               type="password"
//               id="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-success w-100">Sign In</button>
//         </form>
//         <div className="mt-3 text-center">
//           <p>Don't have an account? <a href="/signup">Sign Up</a></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Changed 'a' tag to 'Link'
import { auth, db } from "./firebase"; // Import Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Disable button while loading

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch User Role from Firestore Database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // 3. Redirect based on Role
        if (userData.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        // Fallback: If user has no database record, send to user dashboard
        navigate("/user-dashboard");
      }

    } catch (err) {
      console.error(err);
      // Show user-friendly error message
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div
      style={{
        background: "url('/assets/background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: "-1",
        }}
      ></div>

      {/* Card for the form */}
      <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <h2 className="text-center mb-4">Sign In</h2>
        
        {/* Error Alert */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-3 text-center">
          {/* Changed <a> to <Link> for better React performance */}
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;