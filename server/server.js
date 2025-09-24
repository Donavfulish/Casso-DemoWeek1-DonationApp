// import express from "express";
// import cors from "cors";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const { CLIENT_ID, SECRET_KEY, REDIRECT_URI } = process.env;
// // Tạo grantToken
// app.get("/create-grant-token", async (req, res) => {
//   try {
//     let data = JSON.stringify({
//       "scopes": "transaction",
//       "redirectUri": "http://localhost:3000/success",
//       "fiServiceId": "433d2323-efb5-11ed-8620-0ae7e48c82d8",
//       "language": "vi"
//     });

//     const response = await axios.post(
//       "https://sandbox.bankhub.dev/grant/token",
//       data,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'x-client-id': CLIENT_ID,
//           'x-secret-key': SECRET_KEY
//         }
//       }
//     );

//     console.log(response.data)
//     // Sửa typo: grantToken
//     res.json({ grantToken: response.data.grantToken });
//   } catch (error) { // dùng "error" đúng
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to create grant token" });
//   }
// });

// // Exchange publicToken lấy accessToken
// app.post("/exchange-public-token", async (req, res) => {
//   const { publicToken } = req.body;
//   try {
//     const response = await axios.post(
//       "https://sandbox.bankhub.dev/grant/exchange",
//       { publicToken },
//       {
//         headers: {
//           "x-client-id": CLIENT_ID,
//           "x-secret-key": SECRET_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     res.json(response.data);
//   } catch (error) { // dùng "error" đúng
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to exchange public token" });
//   }
// });

// app.listen(4000, () => {
//   console.log("Backend running on http://localhost:4000");
// });


import dotenv from "dotenv";
dotenv.config({path: "./server/.env"});
import app from "./app.js"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});