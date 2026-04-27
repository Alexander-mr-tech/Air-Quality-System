import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { realDb } from "../firebase";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar, Search, Download, FileSpreadsheet, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Navigation ke liye

import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  // Aapke case mein path 'history' hai
  const historyRef = ref(realDb, 'history'); 
  
  const unsubscribe = onValue(historyRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // AGAR DATA DIRECT KEYS MEIN HAI (Object format):
      // Hum isay array mein convert karenge taake .map() kaam kare
      const formattedData = [{
        id: "record_1",
        co2: data.CO2_Levels,
        humidity: data.Humidity_Sensor,
        mq135: data.MQ135,
        temp: data.Tempature_Sensor,
        // Kyunke database mein date nahi hai, hum aaj ki date de rahe hain
        timestamp: new Date().toLocaleString(),
        formattedDate: new Date().toISOString().split('T')[0] // Filter ke liye
      }];

      setHistoryData(formattedData);
      setFilteredData(formattedData);
    } else {
      console.log("No data found at /history");
      setHistoryData([]);
      setFilteredData([]);
    }
  });
  return () => unsubscribe();
}, []);

  // --- Filtering Logic ---
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    const filtered = historyData.filter(item => {
      const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
  };

  const resetFilter = () => {
    setFilteredData(historyData);
    setStartDate("");
    setEndDate("");
  };

  // --- Export Functions ---
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HistoricalData");
    XLSX.writeFile(wb, `History_Report_${startDate || 'all'}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Historical Air Quality Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Date/Time', 'Temp (C)', 'Hum (%)', 'CO2 (ppm)', 'MQ135']],
      body: filteredData.map(d => [d.timestamp || d.time, d.temp, d.humidity, d.co2, d.mq135]),
    });
    doc.save("Historical_Data.pdf");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "250px", padding: "25px", overflowY: "auto" }}>
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold">Data History Logs</h3>
            </div>
            <div className="d-flex gap-2">
              <button onClick={downloadExcel} className="btn btn-outline-success btn-sm d-flex align-items-center gap-2">
                <FileSpreadsheet size={16} /> Export Excel
              </button>
              <button onClick={downloadPDF} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
                <FileText size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* Filters Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label small fw-bold">From Date</label>
                  <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">To Date</label>
                  <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button onClick={handleFilter} className="btn btn-primary px-4 d-flex align-items-center gap-2">
                    <Search size={16} /> Filter
                  </button>
                  <button onClick={resetFilter} className="btn btn-light px-4">Reset</button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Timestamp</th>
                    <th>Temp (°C)</th>
                    <th>Humidity (%)</th>
                    <th>CO2 (ppm)</th>
                    <th>MQ135 Index</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 fw-medium text-muted">{row.timestamp || row.time}</td>
                      <td>{row.temp}°C</td>
                      <td>{row.humidity}%</td>
                      <td>
                        <span className={`fw-bold ${row.co2 > 1000 ? 'text-danger' : 'text-dark'}`}>
                          {row.co2}
                        </span>
                      </td>
                      <td>{row.mq135}</td>
                      <td>
                        <span className={`badge rounded-pill ${row.co2 > 1000 ? 'bg-danger' : 'bg-success'}-subtle ${row.co2 > 1000 ? 'text-danger' : 'text-success'} px-3`}>
                          {row.co2 > 1000 ? 'Poor' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">No records found for the selected range.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default HistoryScreen;

// after update harware pervious code uncomment

// import { useState, useEffect } from "react";
// import { ref, onValue, query, limitToLast } from "firebase/database";
// import { realDb } from "../firebase";
// import * as XLSX from 'xlsx';
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { Search, FileSpreadsheet, FileText, RotateCcw } from 'lucide-react';
// import Navbar from "./NavBar";
// import Sidebar from "./Sidebar";

// const HistoryScreen = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const historyRef = query(ref(realDb, 'history'), limitToLast(500)); 
    
//     const unsubscribe = onValue(historyRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const dataArr = [];
//         snapshot.forEach((child) => {
//           const val = child.val();
//           dataArr.push({ 
//             id: child.key, 
//             ...val,
//             // Date formatting for comparison
//             formattedDate: val.timestamp ? new Date(val.timestamp).toISOString().split('T')[0] : ""
//           });
//         });
//         const sorted = dataArr.reverse();
//         setHistoryData(sorted);
//         setFilteredData(sorted);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleFilter = () => {
//     if (!startDate || !endDate) {
//       alert("Please select both dates.");
//       return;
//     }

//     const filtered = historyData.filter(item => {
//       // Agar hardware timestamp nahi bhej raha to manual filter kaam nahi karega
//       if (!item.formattedDate) return false;
//       return item.formattedDate >= startDate && item.formattedDate <= endDate;
//     });

//     setFilteredData(filtered);
//   };

//   const resetFilter = () => {
//     setFilteredData(historyData);
//     setStartDate("");
//     setEndDate("");
//   };

//   // --- Export Functions ---
//   const downloadExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "History");
//     XLSX.writeFile(wb, "Sensor_History.xlsx");
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f8f9fa" }}>
//       <Navbar />
//       <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         <Sidebar />
//         <main style={{ flex: 1, marginLeft: "250px", padding: "25px", overflowY: "auto" }}>
          
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h3 className="fw-bold">Data History Logs</h3>
//             <div className="d-flex gap-2">
//               <button onClick={downloadExcel} className="btn btn-outline-success btn-sm"><FileSpreadsheet size={16} /> Excel</button>
//             </div>
//           </div>

//           <div className="card border-0 shadow-sm mb-4 p-3">
//             <div className="row g-3 align-items-end">
//               <div className="col-md-3">
//                 <label className="small fw-bold">From</label>
//                 <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//               </div>
//               <div className="col-md-3">
//                 <label className="small fw-bold">To</label>
//                 <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//               </div>
//               <div className="col-md-4 d-flex gap-2">
//                 <button onClick={handleFilter} className="btn btn-primary px-4"><Search size={16} /> Filter</button>
//                 <button onClick={resetFilter} className="btn btn-light"><RotateCcw size={16} /></button>
//               </div>
//             </div>
//           </div>

//           <div className="card border-0 shadow-sm overflow-hidden">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>Timestamp</th>
//                   <th>Temperature (°C)</th>
//                   <th>Humidity (%)</th>
//                   <th>CO2 (ppm)</th>
//                   <th>MQ135 Index</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length > 0 ? filteredData.map((row) => (
//                   <tr key={row.id}>
//                     <td>{row.timestamp || "No Date"}</td>
//                     <td>{row.Tempature_Sensor || row.temp}°C</td>
//                     <td>{row.Humidity_Sensor || row.humidity}%</td>
//                     <td>{row.CO2_Levels || row.co2}</td>
//                     <td>{row.MQ135 || row.mq135}</td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan="4" className="text-center py-5">No history found. Ensure hardware is using <b>Firebase.push()</b> to /history</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default HistoryScreen;