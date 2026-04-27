// import { useState, useEffect } from "react";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable"; 
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";
// import { realDb } from "../firebase"; 
// import { ref, onValue } from "firebase/database"; 

// const SensorData = () => {
//   const [data, setData] = useState({
//     temp: 0,
//     humidity: 0,
//     co2: 0,
//     mq135: 0,
//     isConnected: false 
//   });

//   const [graphData, setGraphData] = useState([]);

//   useEffect(() => {
//     const dbRef = ref(realDb, '/');
//     const unsubscribe = onValue(dbRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const dbData = snapshot.val();
        
//         const newData = {
//           temp: dbData.Tempature_Sensor || 0, 
//           humidity: dbData.Humidity_Sensor || 0,
//           co2: dbData.CO2_Levels || 0,
//           mq135: dbData.MQ135 || 0, // Firebase se MQ135 fetch karna
//           isConnected: true
//         };

//         setData(newData);

//         setGraphData(prev => {
//           const newPoint = {
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
//             co2: newData.co2,
//             mq135: newData.mq135, // History mein MQ135 save karna
//             temp: newData.temp,
//             humidity: newData.humidity
//           };
//           const updated = [...prev, newPoint];
//           return updated.slice(-20); 
//         });
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const downloadPDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFillColor(44, 62, 80);
//       doc.rect(0, 0, 210, 30, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(18);
//       doc.text("AIR QUALITY INTELLIGENCE REPORT", 15, 20);
      
//       const columns = ["Time", "Temp (C)", "Hum (%)", "CO2 (ppm)", "MQ135 Index"];
//       const rows = graphData.map(item => [
//         item.time,
//         item.temp,
//         item.humidity,
//         item.co2,
//         item.mq135 // PDF Table mein MQ135 add kiya
//       ]);

//       autoTable(doc, {
//         startY: 40,
//         head: [columns],
//         body: rows,
//         theme: 'grid',
//         headStyles: { fillColor: [44, 62, 80] }
//       });

//       doc.save("AQI_Full_Report.pdf");
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
//       <Navbar />
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar />
//         <main style={{ flex: 1, marginLeft: "250px", padding: "25px", overflowY: "auto" }}>
          
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h3 className="fw-bold">Sensor Analytics</h3>
//             <button onClick={downloadPDF} className="btn btn-primary shadow-sm">
//               <i className="fas fa-file-pdf me-2"></i> Export Detailed PDF
//             </button>
//           </div>

//           {/* Stat Cards */}
//           <div className="row g-3 mb-4">
//             {[
//               { label: "CO2", val: data.co2, color: "#8e44ad" },
//               { label: "MQ135", val: data.mq135, color: "#27ae60" },
//               { label: "Temp", val: data.temp, color: "#e74c3c" },
//               { label: "Humidity", val: data.humidity, color: "#3498db" }
//             ].map((s, i) => (
//               <div className="col-md-3" key={i}>
//                 <div className="card border-0 shadow-sm p-3 text-center">
//                   <small className="text-muted fw-bold">{s.label}</small>
//                   <h4 className="fw-bold mb-0" style={{color: s.color}}>{s.val}</h4>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chart Section */}
//           <div className="card border-0 shadow-sm p-4">
//             <h5 className="fw-bold mb-4">Live Sensor Trends</h5>
//             <div style={{ height: "400px", width: "100%" }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={graphData}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="time" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
                  
//                   {/* Sab Sensors ke Areas yahan define hain */}
//                   <Area type="monotone" dataKey="co2" stroke="#8e44ad" fill="#8e44ad" fillOpacity={0.1} name="CO2 (ppm)" />
//                   <Area type="monotone" dataKey="temp" stroke="#e74c3c" fill="transparent" name="Temp (°C)" />
//                   <Area type="monotone" dataKey="humidity" stroke="#3498db" fill="#3498db" fillOpacity={0.1} name="Humidity (%)" />
                  
//                   {/* FIX: MQ135 Area jo missing tha */}
//                   <Area type="monotone" dataKey="mq135" stroke="#27ae60" fill="#27ae60" fillOpacity={0.1} name="MQ135 (Gas Index)" />
                  
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// };

// export default SensorData;

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import * as XLSX from 'xlsx'; 
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { realDb } from "../firebase"; 
import { ref, onValue } from "firebase/database"; 

const SensorData = () => {
  const [data, setData] = useState({ temp: 0, humidity: 0, co2: 0, mq135: 0, isConnected: false });
  const [graphData, setGraphData] = useState([]);
  const [prediction, setPrediction] = useState("Calculating...");
  const [healthAdvice, setHealthAdvice] = useState({ msg: "Monitoring...", color: "#3498db", icon: "fa-info-circle" });

  useEffect(() => {
    const dbRef = ref(realDb, '/');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const dbData = snapshot.val();
        const newData = {
          temp: dbData.Tempature_Sensor || 0, 
          humidity: dbData.Humidity_Sensor || 0,
          co2: dbData.CO2_Levels || 0,
          mq135: dbData.MQ135 || 0,
          isConnected: true
        };
        setData(newData);

        // --- MODULE: HEALTH ADVISOR LOGIC ---
        if (newData.co2 > 1200 || newData.mq135 > 300) {
          setHealthAdvice({ msg: "Hazardous: Stay indoors and use air purifiers.", color: "#c0392b", icon: "fa-exclamation-triangle" });
        } else if (newData.co2 > 700) {
          setHealthAdvice({ msg: "Unhealthy: Wear a mask if going outside.", color: "#d35400", icon: "fa-mask" });
        } else {
          setHealthAdvice({ msg: "Good: Air quality is healthy for outdoor activities.", color: "#27ae60", icon: "fa-check-circle" });
        }

        setGraphData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            co2: newData.co2,
            mq135: newData.mq135,
            temp: newData.temp,
            humidity: newData.humidity
          };
          const updatedData = [...prev, newPoint].slice(-20);

          // --- MODULE: AI PREDICTION LOGIC (Trend Analysis) ---
          if (updatedData.length > 5) {
            const lastThree = updatedData.slice(-3);
            if (lastThree[2].co2 > lastThree[0].co2) {
              setPrediction("Pollution Increasing (Rising Trend)");
            } else if (lastThree[2].co2 < lastThree[0].co2) {
              setPrediction("Condition Improving (Falling Trend)");
            } else {
              setPrediction("Stable Conditions");
            }
          }
          return updatedData;
        });
      } else {
        setData(prev => ({ ...prev, isConnected: false }));
      }
    });
    return () => unsubscribe();
  }, []);

  // --- EXPORT MODULES ---
  const downloadCSV = () => {
    const csvRows = [["Time", "Temp", "Humidity", "CO2", "MQ135"]];
    graphData.forEach(r => csvRows.push([r.time, r.temp, r.humidity, r.co2, r.mq135]));
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AQI_Report.csv";
    link.click();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(graphData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AirQualityData");
    XLSX.writeFile(wb, "Environmental_Report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Air Quality Intelligence Report", 15, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Time", "Temp (C)", "Hum (%)", "CO2 (ppm)", "MQ135"]],
      body: graphData.map(i => [i.time, i.temp, i.humidity, i.co2, i.mq135]),
    });
    doc.save("AQI_Analytics.pdf");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f4f7f6" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "250px", padding: "20px", overflowY: "auto" }}>
          
          {/* Header & Export Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">Sensor Analytics</h2>
              <span className={`badge ${data.isConnected ? 'bg-success' : 'bg-danger'}`}>
                {data.isConnected ? "LIVE SENSOR DATA" : "OFFLINE"}
              </span>
            </div>
            <div className="btn-group shadow-sm">
              <button onClick={downloadPDF} className="btn btn-dark"><i className="fas fa-file-pdf me-2"></i>PDF</button>
              <button onClick={downloadExcel} className="btn btn-success"><i className="fas fa-file-excel me-2"></i>Excel</button>
              <button onClick={downloadCSV} className="btn btn-primary"><i className="fas fa-file-csv me-2"></i>CSV</button>
            </div>
          </div>

          <div className="row mb-4">
            {/* AI Health Advisor Module */}
            <div className="col-md-8">
              <div className="card border-0 shadow-sm p-3 h-100" style={{ borderLeft: `10px solid ${healthAdvice.color}` }}>
                <div className="d-flex align-items-center">
                  <i className={`fas ${healthAdvice.icon} fa-3x me-3`} style={{ color: healthAdvice.color }}></i>
                  <div>
                    <h5 className="fw-bold mb-1">AI Health Advisor</h5>
                    <p className="mb-0 text-muted">{healthAdvice.msg}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prediction Module */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 h-100 bg-white">
                <h6 className="text-muted fw-bold small"><i className="fas fa-brain me-2"></i>SMOG PREDICTION</h6>
                <h5 className="fw-bold text-primary">{prediction}</h5>
                <small className="text-muted">Based on real-time trend analysis</small>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="row g-3 mb-4">
            {[
              { label: "CO2", val: data.co2, unit: "ppm", color: "#8e44ad", icon: "fa-cloud" },
              { label: "MQ135", val: data.mq135, unit: "idx", color: "#27ae60", icon: "fa-wind" },
              { label: "Temp", val: data.temp, unit: "°C", color: "#e74c3c", icon: "fa-thermometer-half" },
              { label: "Humidity", val: data.humidity, unit: "%", color: "#3498db", icon: "fa-tint" }
            ].map((s, i) => (
              <div className="col-md-3" key={i}>
                <div className="card border-0 shadow-sm p-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small fw-bold">{s.label}</span>
                    <i className={`fas ${s.icon}`} style={{color: s.color}}></i>
                  </div>
                  <h3 className="fw-bold mt-2 mb-0">{s.val}<small className="fs-6 fw-normal text-muted ms-1">{s.unit}</small></h3>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
            <h5 className="fw-bold mb-4">Multi-Sensor Trend Analysis</h5>
            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="co2" stroke="#8e44ad" fill="#8e44ad" fillOpacity={0.1} name="CO2" />
                  <Area type="monotone" dataKey="mq135" stroke="#27ae60" fill="#27ae60" fillOpacity={0.1} name="MQ135" />
                  <Area type="monotone" dataKey="humidity" stroke="#3498db" fill="transparent" name="Humidity" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default SensorData;
