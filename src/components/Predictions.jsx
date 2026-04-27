// import { useState } from "react";
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";

// const PredictionScreen = () => {
//   const [inputs, setInputs] = useState({
//     temp: "",
//     humidity: "",
//     co2: "",
//     mq135: ""
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [showModal, setShowModal] = useState(false); // Modal control state

//   const handlePredict = async () => {
//     if (!inputs.temp || !inputs.mq135) {
//       alert("Please enter all values first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           temp: parseFloat(inputs.temp),
//           humidity: parseFloat(inputs.humidity),
//           co2: parseFloat(inputs.co2),
//           mq135: parseFloat(inputs.mq135)
//         }),
//       });

//       const resultData = await response.json();

//       if (resultData.status === "success") {
//         const svmLower = resultData.svm.toLowerCase();
//         const knnLower = resultData.knn.toLowerCase();
        
//         const isHazardous = svmLower.includes("hazardous") || knnLower.includes("hazardous");
//         const isWarning = svmLower.includes("warning") || knnLower.includes("warning");

//         setResult({
//           svm: resultData.svm,
//           knn: resultData.knn,
//           color: isHazardous ? "danger" : (isWarning ? "warning" : "success"),
//           icon: isHazardous ? "fa-skull-crossbones" : (isWarning ? "fa-exclamation-triangle" : "fa-check-circle"),
//           message: isHazardous 
//             ? "Critical levels detected! Immediate ventilation required." 
//             : (isWarning ? "Air quality is moderate. Be cautious." : "AI confirms the air is fresh and safe.")
//         });
//         setShowModal(true); // Open Pop-up
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       alert("Connection Error: Flask server is not responding.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//       <Navbar />
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar />

//         <div style={{ flex: 1, marginLeft: "250px", background: "#f8f9fa", padding: "40px", overflowY: "auto", position: "relative" }}>
          
//           <div style={{ maxWidth: "800px", margin: "0 auto" }}>
//             <div className="text-center mb-5">
//               <h1 className="fw-bold text-dark">AI Air Quality Predictor</h1>
//               <p className="text-muted">Enter sensor parameters for real-time AI analysis</p>
//             </div>

//             {/* Input Card */}
//             <div className="card border-0 shadow-lg p-5" style={{ borderRadius: "25px" }}>
//               <div className="row g-4">
//                 <div className="col-md-6">
//                   <label className="form-label fw-bold text-secondary small text-uppercase">Temperature (°C)</label>
//                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.temp} onChange={(e) => setInputs({...inputs, temp: e.target.value})} />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-bold text-secondary small text-uppercase">Humidity (%)</label>
//                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.humidity} onChange={(e) => setInputs({...inputs, humidity: e.target.value})} />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-bold text-secondary small text-uppercase">CO2 Level (PPM)</label>
//                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.co2} onChange={(e) => setInputs({...inputs, co2: e.target.value})} />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-bold text-secondary small text-uppercase">MQ135 Gas Index</label>
//                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.mq135} onChange={(e) => setInputs({...inputs, mq135: e.target.value})} />
//                 </div>
//               </div>

//               <button 
//                 className={`btn btn-primary w-100 mt-5 py-3 fw-bold rounded-pill shadow-lg transition-all ${loading ? 'disabled' : ''}`}
//                 onClick={handlePredict}
//               >
//                 {loading ? "AI Model Processing..." : "Run Prediction Analysis"}
//               </button>
//             </div>
//           </div>

//           {/* --- POP-UP MODAL --- */}
//           {showModal && result && (
//             <div style={{
//               position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
//               backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
//               display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
//             }}>
//               <div className={`card border-0 shadow-2xl animate__animated animate__zoomIn`} style={{ width: "90%", maxWidth: "500px", borderRadius: "25px", overflow: "hidden" }}>
//                 <div className={`bg-${result.color} p-4 text-center text-white`}>
//                   <i className={`fas ${result.icon} fa-4x mb-3`}></i>
//                   <h2 className="fw-bold mb-0">Analysis Complete</h2>
//                 </div>
//                 <div className="card-body p-4 text-center">
//                   <p className="text-muted text-uppercase small fw-bold mb-1">Status Message</p>
//                   <h4 className={`text-${result.color} fw-bold mb-4`}>{result.message}</h4>
                  
//                   <div className="row g-2 mb-4">
//                     <div className="col-6">
//                       <div className="p-3 bg-light rounded-4">
//                         <small className="text-muted d-block">SVM Model</small>
//                         <strong className="fs-5">{result.svm}</strong>
//                       </div>
//                     </div>
//                     <div className="col-6">
//                       <div className="p-3 bg-light rounded-4">
//                         <small className="text-muted d-block">KNN Model</small>
//                         <strong className="fs-5">{result.knn}</strong>
//                       </div>
//                     </div>
//                   </div>

//                   <button className="btn btn-dark w-100 py-2 rounded-pill fw-bold" onClick={() => setShowModal(false)}>
//                     Close Result
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* --- END POP-UP MODAL --- */}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default PredictionScreen;

import { useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const PredictionScreen = () => {
  const [inputs, setInputs] = useState({
    temp: "",
    humidity: "",
    co2: "",
    mq135: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePredict = async () => {
    if (!inputs.temp || !inputs.humidity || !inputs.co2 || !inputs.mq135) {
      alert("Please fill all sensor parameters!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temp: parseFloat(inputs.temp),
          humidity: parseFloat(inputs.humidity),
          co2: parseFloat(inputs.co2),
          mq135: parseFloat(inputs.mq135)
        }),
      });

      const resultData = await response.json();

      if (resultData.status === "success") {
        const svmLower = resultData.svm.toLowerCase();
        const knnLower = resultData.knn.toLowerCase();
        
        const isHazardous = svmLower.includes("hazardous") || knnLower.includes("hazardous");
        const isWarning = svmLower.includes("warning") || knnLower.includes("warning");

        setResult({
          svm: resultData.svm,
          knn: resultData.knn,
          color: isHazardous ? "#dc3545" : (isWarning ? "#ffc107" : "#198754"),
          bgClass: isHazardous ? "danger" : (isWarning ? "warning" : "success"),
          icon: isHazardous ? "fa-biohazard" : (isWarning ? "fa-exclamation-triangle" : "fa-leaf"),
          message: isHazardous 
            ? "Hazardous Air Quality Detected!" 
            : (isWarning ? "Air Quality is Moderate." : "Air Quality is Excellent!")
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Backend server not connected!");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <main style={{ flex: 1, marginLeft: "250px", padding: "40px", overflowY: "auto" }}>
          
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {/* Header Section */}
            <div className="mb-5">
              <h2 className="fw-bold" style={{ color: "#1a202c" }}>
                <i className="fas fa-brain text-primary me-2"></i>AI Prediction Hub
              </h2>
              <p className="text-muted">Use SVM & KNN algorithms to forecast air quality status based on current environmental data.</p>
            </div>

            <div className="row g-4">
              {/* Left Side: Illustration or Info */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                  <h5 className="fw-bold mb-3">System Info</h5>
                  <p className="small opacity-75">Enter the values manually to test how the AI models categorize the current environment.</p>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2 small"><i className="fas fa-microchip me-2"></i> SVM Acc: 98%</div>
                    <div className="d-flex align-items-center small"><i className="fas fa-network-wired me-2"></i> KNN Acc: 92%</div>
                  </div>
                </div>
              </div>

              {/* Right Side: Input Form */}
              <div className="col-md-8">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                  <div className="row g-3">
                    {[
                      { id: "temp", label: "Temperature", icon: "fa-thermometer-half", unit: "°C" },
                      { id: "humidity", label: "Humidity", icon: "fa-tint", unit: "%" },
                      { id: "co2", label: "CO2 Level", icon: "fa-cloud", unit: "ppm" },
                      { id: "mq135", label: "MQ135 Gas", icon: "fa-wind", unit: "index" },
                    ].map((input) => (
                      <div className="col-md-6" key={input.id}>
                        <label className="form-label small fw-bold text-muted text-uppercase">{input.label}</label>
                        <div className="input-group">
                          <span className="input-group-text border-0 bg-light"><i className={`fas ${input.icon} text-primary`}></i></span>
                          <input 
                            type="number" 
                            className="form-control border-0 bg-light py-2" 
                            placeholder={`Enter ${input.unit}`}
                            value={inputs[input.id]} 
                            onChange={(e) => setInputs({...inputs, [input.id]: e.target.value})} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className={`btn btn-primary w-100 mt-5 py-3 fw-bold rounded-pill shadow-sm transition-all ${loading ? 'disabled' : ''}`}
                    onClick={handlePredict}
                    style={{ background: "#4e73df", border: "none" }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Computing...</>
                    ) : "START AI ANALYSIS"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- RESULTS MODAL --- */}
          {showModal && result && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
            }}>
              <div className="card border-0 shadow-lg" style={{ width: "95%", maxWidth: "550px", borderRadius: "30px", overflow: "hidden" }}>
                <div className={`text-white p-5 text-center bg-${result.bgClass}`}>
                  <i className={`fas ${result.icon} fa-5x mb-3 animate__animated animate__pulse animate__infinite`}></i>
                  <h2 className="fw-bold">{result.message}</h2>
                </div>
                
                <div className="card-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="p-3 rounded-4 text-center" style={{ backgroundColor: "#f8f9fc", border: `2px solid ${result.color}` }}>
                        <small className="text-muted fw-bold d-block text-uppercase">SVM Result</small>
                        <span className="fw-bold fs-5" style={{ color: result.color }}>{result.svm}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-4 text-center" style={{ backgroundColor: "#f8f9fc", border: `2px solid ${result.color}` }}>
                        <small className="text-muted fw-bold d-block text-uppercase">KNN Result</small>
                        <span className="fw-bold fs-5" style={{ color: result.color }}>{result.knn}</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow" onClick={() => setShowModal(false)}>
                    ACKNOWLEDGE & CLOSE
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PredictionScreen;