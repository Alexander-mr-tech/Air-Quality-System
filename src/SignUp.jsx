// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const SignUp = () => {
//   const [username, setUsername] = useState(""); // New state for username
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add sign up logic here (e.g., API call)
//     console.log("User signed up:", { username, email, password });
//     navigate("/signin"); // Redirect to sign-in page after sign-up
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
//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
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
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState(""); // State for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add sign up logic here (e.g., API call)
    console.log("User signed up:", { username, email, password });
    navigate("/signin"); // Redirect to sign-in page after sign-up
  };

  const togglePassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div
      style={{
        background: "url('/assets/background.jpg') no-repeat center center fixed", // Local image path in public/assets
        backgroundSize: "cover", // Ensure the image covers the whole background
        height: "100vh", // Full viewport height
        display: "flex", // Use Flexbox to center the content
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        fontFamily: "Arial, sans-serif", // Set font
        color: "white", // White text on dark background
      }}
    >
      <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
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
              type={showPassword ? "text" : "password"} // Toggle the input type based on the state
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
              }}
              onClick={togglePassword}
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> {/* Eye icon */}
            </span>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
