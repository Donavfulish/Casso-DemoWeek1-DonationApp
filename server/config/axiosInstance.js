import axios from "axios";
import dotenv from "dotenv";
dotenv.config({path: "./server/.env"});

const axiosInstance = axios.create({
  baseURL: process.env.BANKHUB_API_URL || "https://sandbox.bankhub.dev",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-client-id": process.env.CLIENT_ID,
    "x-secret-key": process.env.SECRET_KEY,
  },
});

// Request logger
axiosInstance.interceptors.request.use((config) => {
  console.log(`[BANKHUB] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("[BANKHUB ERROR]", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
