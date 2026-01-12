import React, { useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const Predictions = () => {
  // 1. State for Inputs
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [co2, setCo2] = useState("");
  const [mq135, setMq135] = useState("");

  // 2. State for Result
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 3. Handle Prediction (Simulated Logic)
  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    // SIMULATION: In a real app, you would send this data to your Python/Flask API
    // axios.post('http://localhost:5000/predict', { temp, humidity, co2, mq135 })
    
    setTimeout(() => {
      // Mock Logic for demonstration
      const co2Val = parseFloat(co2);
      const mqVal = parseFloat(mq135);
      
      let resultText = "Good";
      let resultColor = "success"; // Green
      let resultDesc = "Air quality is safe for outdoor activities.";

      if (co2Val > 1000 || mqVal > 200) {
        resultText = "Hazardous";
        resultColor = "danger"; // Red
        resultDesc = "Warning: Air quality is toxic. Avoid outdoor exposure.";
      } else if (co2Val > 600 || mqVal > 100) {
        resultText = "Moderate";
        resultColor = "warning"; // Yellow/Orange
        resultDesc = "Air quality is acceptable but sensitive groups should take care.";
      }

      setPrediction({
        status: resultText,
        color: resultColor,
        description: resultDesc
      });
      setLoading(false);
    }, 1500); // Fake delay to look like an API call
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        {/* Main Content Wrapper */}
        <div
          style={{
            flex: 1,
            marginLeft: "250px", // Align next to Sidebar
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to bottom, #3498db, #2c3e50)",
            padding: "40px",
          }}
        >
          {/* Form Card */}
          <div
            className="card shadow-lg border-0"
            style={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "15px",
              padding: "30px",
            }}
          >
            <h2 className="text-center mb-4 fw-bold text-dark">
              <i className="fas fa-robot me-2 text-primary"></i>
              AI Air Quality Predictor
            </h2>
            <p className="text-center text-muted mb-4">
              Enter current sensor readings to predict future air quality levels.
            </p>

            <form onSubmit={handlePredict}>
              <div className="row g-3">
                
                {/* Temperature */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Temperature (°C)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 25"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    required
                  />
                </div>

                {/* Humidity */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Humidity (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 55"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    required
                  />
                </div>

                {/* CO2 Sensor */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">CO2 Level (ppm)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 400"
                    value={co2}
                    onChange={(e) => setCo2(e.target.value)}
                    required
                  />
                </div>

                {/* MQ135 Sensor */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">MQ135 (Air Quality)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 150"
                    value={mq135}
                    onChange={(e) => setMq135(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={loading}
                  style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none" }}
                >
                  {loading ? (
                    <span><i className="fas fa-spinner fa-spin me-2"></i> Analyzing Data...</span>
                  ) : (
                    "Predict Air Quality"
                  )}
                </button>
              </div>
            </form>

            {/* 4. Result Display Area */}
            {prediction && (
              <div className={`alert alert-${prediction.color} mt-4 text-center border-2`} role="alert">
                <h4 className="alert-heading fw-bold mb-1">
                  Prediction: {prediction.status}
                </h4>
                <p className="mb-0">{prediction.description}</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;