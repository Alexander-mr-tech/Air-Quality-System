import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock user authentication
    if (email === "admin@example.com" && password === "admin") {
      navigate("/admin-dashboard");
    } else if (email === "user@example.com" && password === "user") {
      navigate("/user-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        background: "url('/assets/background.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        // color: "white",
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
          background: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
          zIndex: "-1",
        }}
      ></div>

      {/* Card for the form */}
      <div className="card shadow-lg p-4" style={{ width: "22rem", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <h2 className="text-center mb-4">Sign In</h2>
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
          <button type="submit" className="btn btn-success w-100">Sign In</button>
        </form>
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
