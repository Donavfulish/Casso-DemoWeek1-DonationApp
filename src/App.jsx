// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // App chính
// function App() {
//   const [grantToken, setGrantToken] = React.useState(null);

//   // Lấy grantToken từ backend
//   const fetchGrantToken = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/create-grant-token");
//       const data = await res.json();
//       setGrantToken(data.grantToken);
//     } catch (err) {
//       console.error("Failed to fetch grantToken:", err);
//     }
//   };

//   // Mở popup CasLink iframe
//   const openCasLink = () => {
//     if (!grantToken) {
//       alert("Chưa có grantToken, vui lòng thử lại!");
//       return;
//     }

//     const CasLinkConfigs = {
//       redirectUri: "http://localhost:3000/success",
//       iframe: true, // iframe trong app
//       grantToken: grantToken,
//       feature: "qrpay",
//       fiServiceType: "ALL",
//       onSuccess: (publicToken, state) => {
//         console.log("CasLink success:", publicToken);
//       },
//       onExit: () => {
//         console.log("CasLink exit");
//       },
//     };

//     // Gọi open trực tiếp từ click handler
//     const { open } = BankHub.useBankHubLink(CasLinkConfigs);
//     open();
//   };

//   React.useEffect(() => {
//     fetchGrantToken();
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div style={{ padding: 50 }}>
//               <button onClick={openCasLink}>Liên kết tài khoản ngân hàng</button>
//               {!grantToken && <p>Đang lấy grantToken...</p>}
//             </div>
//           }
//         />
//         <Route path="/callback" element={<Callback />} />
//       </Routes>
//     </Router>
//   );
// }

// // Component callback xử lý publicToken
// function Callback() {
//   const [message, setMessage] = React.useState("");

//   React.useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const publicToken = params.get("publicToken");

//     if (publicToken) {
//       fetch("http://localhost:4000/exchange-public-token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ publicToken }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           setMessage("Tài khoản ngân hàng đã liên kết thành công!");
//           console.log("Access Token:", data.accessToken);
//         })
//         .catch((err) => {
//           setMessage("Có lỗi xảy ra khi liên kết tài khoản.");
//           console.error(err);
//         });
//     }
//   }, []);

//   return <div style={{ padding: 50 }}>{message}</div>;
// }

// export default App;

import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashBoardPage"
import DonationPage from "./pages/DonationPage"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/:username" element={<DonationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}