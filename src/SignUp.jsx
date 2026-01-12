// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [username, setUsername] = useState(""); // State for username
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add sign up logic here (e.g., API call)
//     console.log("User signed up:", { username, email, password });
//     navigate("/signin"); // Redirect to sign-in page after sign-up
//   };

//   const togglePassword = () => {
//     setShowPassword(!showPassword); // Toggle password visibility
//   };

//   return (
//     <div
//       style={{
//         background: "url('/assets/background.jpg') no-repeat center center fixed", // Local image path in public/assets
//         backgroundSize: "cover", // Ensure the image covers the whole background
//         height: "100vh", // Full viewport height
//         display: "flex", // Use Flexbox to center the content
//         justifyContent: "center", // Center horizontally
//         alignItems: "center", // Center vertically
//         fontFamily: "Arial, sans-serif", // Set font
//         color: "white", // White text on dark background
//       }}
//     >
//       <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
//         <h2 className="text-center mb-4">Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="username" className="form-label">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               className="form-control"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3 position-relative">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"} // Toggle the input type based on the state
//               id="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               className="position-absolute"
//               style={{
//                 top: "72%",
//                 right: "10px",
//                 transform: "translateY(-50%)",
//                 cursor: "pointer",
//               }}
//               onClick={togglePassword}
//             >
//               <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> {/* Eye icon */}
//             </span>
//           </div>
//           <button type="submit" className="btn btn-success w-100">
//             Sign Up
//           </button>
//         </form>
//         <div className="mt-3 text-center">
//           <p>
//             Already have an account? <a href="/signin">Sign In</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Use Link for SPA navigation
import { auth, db } from "./firebase"; // Import Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

const SignUp = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(""); // To show error messages
  const [loading, setLoading] = useState(false); // To disable button during submit

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      // 1. Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save User Details (Username, Role) to Firestore Database
      // We use the 'uid' from Auth as the document ID to link them perfectly
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: username, // Saving the username here
        email: email,
        role: "User",   // Default role is 'User'
        createdAt: new Date().toISOString()
      });

      console.log("User signed up:", user);
      alert("Account created successfully!");
      
      // Redirect to dashboard (or signin page if you prefer)
      navigate("/user-dashboard"); 

    } catch (err) {
      console.error(err);
      // specific error handling for common issues
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div
      style={{
        background: "url('/assets/background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div
        style={{
          position: "absolute",
          top: "0", left: "0", right: "0", bottom: "0",
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: "0",
        }}
      ></div>

      <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: "1" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        
        {/* Error Alert */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="position-absolute"
              style={{
                top: "72%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "black" // Ensure icon is visible against white input
              }}
              onClick={togglePassword}
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </span>
          </div>
          
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-3 text-center">
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;