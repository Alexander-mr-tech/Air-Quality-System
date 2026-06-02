// // import { useState } from "react";
// // import Navbar from "./NavBar";
// // import Sidebar from "./Sidebar";

// // const PredictionScreen = () => {
// //   const [inputs, setInputs] = useState({
// //     temp: "",
// //     humidity: "",
// //     co2: "",
// //     mq135: ""
// //   });
  
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [showModal, setShowModal] = useState(false); // Modal control state

// //   const handlePredict = async () => {
// //     if (!inputs.temp || !inputs.mq135) {
// //       alert("Please enter all values first!");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await fetch("http://localhost:5000/predict", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           temp: parseFloat(inputs.temp),
// //           humidity: parseFloat(inputs.humidity),
// //           co2: parseFloat(inputs.co2),
// //           mq135: parseFloat(inputs.mq135)
// //         }),
// //       });

// //       const resultData = await response.json();

// //       if (resultData.status === "success") {
// //         const svmLower = resultData.svm.toLowerCase();
// //         const knnLower = resultData.knn.toLowerCase();
        
// //         const isHazardous = svmLower.includes("hazardous") || knnLower.includes("hazardous");
// //         const isWarning = svmLower.includes("warning") || knnLower.includes("warning");

// //         setResult({
// //           svm: resultData.svm,
// //           knn: resultData.knn,
// //           color: isHazardous ? "danger" : (isWarning ? "warning" : "success"),
// //           icon: isHazardous ? "fa-skull-crossbones" : (isWarning ? "fa-exclamation-triangle" : "fa-check-circle"),
// //           message: isHazardous 
// //             ? "Critical levels detected! Immediate ventilation required." 
// //             : (isWarning ? "Air quality is moderate. Be cautious." : "AI confirms the air is fresh and safe.")
// //         });
// //         setShowModal(true); // Open Pop-up
// //       }
// //     } catch (error) {
// //       console.error("Fetch Error:", error);
// //       alert("Connection Error: Flask server is not responding.");
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
// //       <Navbar />
// //       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
// //         <Sidebar />

// //         <div style={{ flex: 1, marginLeft: "250px", background: "#f8f9fa", padding: "40px", overflowY: "auto", position: "relative" }}>
          
// //           <div style={{ maxWidth: "800px", margin: "0 auto" }}>
// //             <div className="text-center mb-5">
// //               <h1 className="fw-bold text-dark">AI Air Quality Predictor</h1>
// //               <p className="text-muted">Enter sensor parameters for real-time AI analysis</p>
// //             </div>

// //             {/* Input Card */}
// //             <div className="card border-0 shadow-lg p-5" style={{ borderRadius: "25px" }}>
// //               <div className="row g-4">
// //                 <div className="col-md-6">
// //                   <label className="form-label fw-bold text-secondary small text-uppercase">Temperature (°C)</label>
// //                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.temp} onChange={(e) => setInputs({...inputs, temp: e.target.value})} />
// //                 </div>
// //                 <div className="col-md-6">
// //                   <label className="form-label fw-bold text-secondary small text-uppercase">Humidity (%)</label>
// //                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.humidity} onChange={(e) => setInputs({...inputs, humidity: e.target.value})} />
// //                 </div>
// //                 <div className="col-md-6">
// //                   <label className="form-label fw-bold text-secondary small text-uppercase">CO2 Level (PPM)</label>
// //                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.co2} onChange={(e) => setInputs({...inputs, co2: e.target.value})} />
// //                 </div>
// //                 <div className="col-md-6">
// //                   <label className="form-label fw-bold text-secondary small text-uppercase">MQ135 Gas Index</label>
// //                   <input type="number" className="form-control form-control-lg bg-light border-0" value={inputs.mq135} onChange={(e) => setInputs({...inputs, mq135: e.target.value})} />
// //                 </div>
// //               </div>

// //               <button 
// //                 className={`btn btn-primary w-100 mt-5 py-3 fw-bold rounded-pill shadow-lg transition-all ${loading ? 'disabled' : ''}`}
// //                 onClick={handlePredict}
// //               >
// //                 {loading ? "AI Model Processing..." : "Run Prediction Analysis"}
// //               </button>
// //             </div>
// //           </div>

// //           {/* --- POP-UP MODAL --- */}
// //           {showModal && result && (
// //             <div style={{
// //               position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
// //               backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
// //               display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
// //             }}>
// //               <div className={`card border-0 shadow-2xl animate__animated animate__zoomIn`} style={{ width: "90%", maxWidth: "500px", borderRadius: "25px", overflow: "hidden" }}>
// //                 <div className={`bg-${result.color} p-4 text-center text-white`}>
// //                   <i className={`fas ${result.icon} fa-4x mb-3`}></i>
// //                   <h2 className="fw-bold mb-0">Analysis Complete</h2>
// //                 </div>
// //                 <div className="card-body p-4 text-center">
// //                   <p className="text-muted text-uppercase small fw-bold mb-1">Status Message</p>
// //                   <h4 className={`text-${result.color} fw-bold mb-4`}>{result.message}</h4>
                  
// //                   <div className="row g-2 mb-4">
// //                     <div className="col-6">
// //                       <div className="p-3 bg-light rounded-4">
// //                         <small className="text-muted d-block">SVM Model</small>
// //                         <strong className="fs-5">{result.svm}</strong>
// //                       </div>
// //                     </div>
// //                     <div className="col-6">
// //                       <div className="p-3 bg-light rounded-4">
// //                         <small className="text-muted d-block">KNN Model</small>
// //                         <strong className="fs-5">{result.knn}</strong>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <button className="btn btn-dark w-100 py-2 rounded-pill fw-bold" onClick={() => setShowModal(false)}>
// //                     Close Result
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //           {/* --- END POP-UP MODAL --- */}

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PredictionScreen;

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
//   const [showModal, setShowModal] = useState(false);

//   const handlePredict = async () => {
//     if (!inputs.temp || !inputs.humidity || !inputs.co2 || !inputs.mq135) {
//       alert("Please fill all sensor parameters!");
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
//           color: isHazardous ? "#dc3545" : (isWarning ? "#ffc107" : "#198754"),
//           bgClass: isHazardous ? "danger" : (isWarning ? "warning" : "success"),
//           icon: isHazardous ? "fa-biohazard" : (isWarning ? "fa-exclamation-triangle" : "fa-leaf"),
//           message: isHazardous 
//             ? "Hazardous Air Quality Detected!" 
//             : (isWarning ? "Air Quality is Moderate." : "Air Quality is Excellent!")
//         });
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       alert("Backend server not connected!");
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f0f2f5" }}>
//       <Navbar />
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar />

//         <main style={{ flex: 1, marginLeft: "250px", padding: "40px", overflowY: "auto" }}>
          
//           <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
//             {/* Header Section */}
//             <div className="mb-5">
//               <h2 className="fw-bold" style={{ color: "#1a202c" }}>
//                 <i className="fas fa-brain text-primary me-2"></i>AI Prediction Hub
//               </h2>
//               <p className="text-muted">Use SVM & KNN algorithms to forecast air quality status based on current environmental data.</p>
//             </div>

//             <div className="row g-4">
//               {/* Left Side: Illustration or Info */}
//               <div className="col-md-4">
//                 <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
//                   <h5 className="fw-bold mb-3">System Info</h5>
//                   <p className="small opacity-75">Enter the values manually to test how the AI models categorize the current environment.</p>
//                   <div className="mt-auto">
//                     <div className="d-flex align-items-center mb-2 small"><i className="fas fa-microchip me-2"></i> SVM Acc: 98%</div>
//                     <div className="d-flex align-items-center small"><i className="fas fa-network-wired me-2"></i> KNN Acc: 92%</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side: Input Form */}
//               <div className="col-md-8">
//                 <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
//                   <div className="row g-3">
//                     {[
//                       { id: "temp", label: "Temperature", icon: "fa-thermometer-half", unit: "°C" },
//                       { id: "humidity", label: "Humidity", icon: "fa-tint", unit: "%" },
//                       { id: "co2", label: "CO2 Level", icon: "fa-cloud", unit: "ppm" },
//                       { id: "mq135", label: "MQ135 Gas", icon: "fa-wind", unit: "index" },
//                     ].map((input) => (
//                       <div className="col-md-6" key={input.id}>
//                         <label className="form-label small fw-bold text-muted text-uppercase">{input.label}</label>
//                         <div className="input-group">
//                           <span className="input-group-text border-0 bg-light"><i className={`fas ${input.icon} text-primary`}></i></span>
//                           <input 
//                             type="number" 
//                             className="form-control border-0 bg-light py-2" 
//                             placeholder={`Enter ${input.unit}`}
//                             value={inputs[input.id]} 
//                             onChange={(e) => setInputs({...inputs, [input.id]: e.target.value})} 
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <button 
//                     className={`btn btn-primary w-100 mt-5 py-3 fw-bold rounded-pill shadow-sm transition-all ${loading ? 'disabled' : ''}`}
//                     onClick={handlePredict}
//                     style={{ background: "#4e73df", border: "none" }}
//                   >
//                     {loading ? (
//                       <><span className="spinner-border spinner-border-sm me-2"></span>Computing...</>
//                     ) : "START AI ANALYSIS"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* --- RESULTS MODAL --- */}
//           {showModal && result && (
//             <div style={{
//               position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
//               backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
//               display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
//             }}>
//               <div className="card border-0 shadow-lg" style={{ width: "95%", maxWidth: "550px", borderRadius: "30px", overflow: "hidden" }}>
//                 <div className={`text-white p-5 text-center bg-${result.bgClass}`}>
//                   <i className={`fas ${result.icon} fa-5x mb-3 animate__animated animate__pulse animate__infinite`}></i>
//                   <h2 className="fw-bold">{result.message}</h2>
//                 </div>
                
//                 <div className="card-body p-4">
//                   <div className="row g-3 mb-4">
//                     <div className="col-6">
//                       <div className="p-3 rounded-4 text-center" style={{ backgroundColor: "#f8f9fc", border: `2px solid ${result.color}` }}>
//                         <small className="text-muted fw-bold d-block text-uppercase">SVM Result</small>
//                         <span className="fw-bold fs-5" style={{ color: result.color }}>{result.svm}</span>
//                       </div>
//                     </div>
//                     <div className="col-6">
//                       <div className="p-3 rounded-4 text-center" style={{ backgroundColor: "#f8f9fc", border: `2px solid ${result.color}` }}>
//                         <small className="text-muted fw-bold d-block text-uppercase">KNN Result</small>
//                         <span className="fw-bold fs-5" style={{ color: result.color }}>{result.knn}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <button className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow" onClick={() => setShowModal(false)}>
//                     ACKNOWLEDGE & CLOSE
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PredictionScreen;

import { useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const PredictionScreen = () => {
  const [inputs, setInputs] = useState({ temp: "", humidity: "", co2: "", mq135: "" });
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
          mq135: parseFloat(inputs.mq135),
        }),
      });
      const resultData = await response.json();
      if (resultData.status === "success") {
        const svmL = resultData.svm.toLowerCase();
        const knnL = resultData.knn.toLowerCase();
        const isHazardous = svmL.includes("hazardous") || knnL.includes("hazardous");
        const isWarning   = svmL.includes("warning")   || knnL.includes("warning");
        setResult({
          svm: resultData.svm,
          knn: resultData.knn,
          color:   isHazardous ? "#f87171" : isWarning ? "#fbbf24" : "#4ade80",
          bgColor: isHazardous ? "rgba(248,113,113,0.1)" : isWarning ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)",
          border:  isHazardous ? "rgba(248,113,113,0.3)" : isWarning ? "rgba(251,191,36,0.3)" : "rgba(74,222,128,0.3)",
          message: isHazardous ? "Hazardous Air Quality Detected!" : isWarning ? "Air Quality is Moderate." : "Air Quality is Excellent!",
          sub:     isHazardous ? "Critical levels detected. Immediate ventilation required." : isWarning ? "Be cautious when going outside. Wear a mask." : "AI confirms the air is fresh and safe for activities.",
          iconPath: isHazardous
            ? "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            : isWarning
            ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11a1 1 0 01-1-1V8a1 1 0 012 0v4a1 1 0 01-1 1zm0 4a1 1 0 110-2 1 1 0 010 2z"
            : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        });
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      alert("Backend server not connected!");
    }
    setLoading(false);
  };

  const font = "'Inter','Segoe UI',sans-serif";

  const card = {
    background: "var(--card)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "0.5px solid var(--border)",
    borderRadius: "14px",
    fontFamily: font,
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    marginBottom: "7px",
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "9px",
    padding: "11px 13px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: font,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const fields = [
    { id: "temp",     label: "Temperature",  unit: "°C",    color: "#fbbf24",
      d: "M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" },
    { id: "humidity", label: "Humidity",     unit: "%",     color: "var(--dot)",
      d: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" },
    { id: "co2",      label: "CO₂ Level",    unit: "ppm",   color: "#a78bfa",
      d: "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" },
    { id: "mq135",    label: "MQ135 Gas",    unit: "index", color: "#4ade80",
      d: "M17 8.5c.38.38.62.9.62 1.5M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden",
      background: "var(--bg)",
      fontFamily: font,
    }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <main style={{ flex: 1, marginLeft: "240px", padding: "28px", overflowY: "auto" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── Header ── */}
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: 0 }}>
                AI Prediction Hub
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "6px 0 0" }}>
                Use SVM &amp; KNN algorithms to forecast air quality based on sensor parameters
              </p>
            </div>

            {/* ── Two-column layout ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", alignItems: "start" }}>

              {/* Info card */}
              <div style={{
                ...card,
                padding: "24px",
                background: "rgba(30,111,255,0.1)",
                border: "0.5px solid rgba(74,158,255,0.25)",
              }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#fff", margin: "0 0 10px" }}>
                  System Info
                </p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px", lineHeight: "1.6" }}>
                  Enter sensor values manually to test how the AI models categorize the current environment.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "SVM Accuracy", val: "98%", color: "#4ade80" },
                    { label: "KNN Accuracy", val: "92%", color: "var(--dot)" },
                  ].map((m) => (
                    <div key={m.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                    }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{m.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: m.color }}>{m.val}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative sensor icons */}
                <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {fields.map((f) => (
                    <div key={f.id} style={{
                      padding: "10px", borderRadius: "8px", textAlign: "center",
                      background: `${f.color}15`, border: `0.5px solid ${f.color}30`,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 4px", display: "block" }}>
                        <path d={f.d} stroke={f.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: "10px", color: f.color, fontWeight: "600" }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input form */}
              <div style={{ ...card, padding: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "24px" }}>
                  {fields.map((f) => (
                    <div key={f.id}>
                      <label style={labelStyle}>{f.label}</label>
                      <div style={{ position: "relative" }}>
                        <div style={{
                          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d={f.d} stroke={f.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          placeholder={`Enter ${f.unit}`}
                          value={inputs[f.id]}
                          onChange={(e) => setInputs({ ...inputs, [f.id]: e.target.value })}
                          style={{ ...inputStyle, paddingLeft: "36px" }}
                          onFocus={(e) => e.target.style.borderColor = f.color}
                          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.06)", margin: "4px 0 24px" }} />

                <button
                  onClick={handlePredict}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "13px",
                    background: loading ? "rgba(30,111,255,0.4)" : "var(--accent)",
                    border: "none", borderRadius: "10px",
                    color: "#fff", fontSize: "14px", fontWeight: "600",
                    fontFamily: font, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    transition: "background 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        animation: "spin 0.8s linear infinite",
                      }} />
                      Computing...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v10l5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Start AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Result Modal ── */}
      {showModal && result && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "20px",
        }}>
          <div style={{
            background: "var(--card)",
            border: `0.5px solid ${result.border}`,
            borderRadius: "18px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "480px",
            fontFamily: font,
          }}>
            {/* Modal header */}
            <div style={{
              background: result.bgColor,
              borderBottom: `0.5px solid ${result.border}`,
              padding: "32px 28px",
              textAlign: "center",
            }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: `${result.color}20`,
                border: `0.5px solid ${result.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d={result.iconPath} stroke={result.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: result.color, margin: "0 0 8px" }}>
                {result.message}
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {result.sub}
              </p>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 12px" }}>
                Model Results
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "SVM Model", val: result.svm },
                  { label: "KNN Model", val: result.knn },
                ].map((m) => (
                  <div key={m.label} style={{
                    padding: "14px", borderRadius: "10px", textAlign: "center",
                    background: result.bgColor,
                    border: `0.5px solid ${result.border}`,
                  }}>
                    <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: "600", letterSpacing: "1px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                      {m.label}
                    </p>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: result.color }}>
                      {m.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input summary */}
              <div style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px",
                marginBottom: "20px",
              }}>
                {fields.map((f) => (
                  <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>{f.label}</span>
                    <span style={{ color: f.color, fontWeight: "600" }}>{inputs[f.id]} {f.unit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: "100%", padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px", color: "rgba(255,255,255,0.7)",
                  fontSize: "13px", fontWeight: "600", fontFamily: font, cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default PredictionScreen;