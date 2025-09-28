// src/shared/api.js
import axios from "axios";

const API_BASE = "http://localhost:4000"; // đổi thành process.env.REACT_APP_API_BASE khi deploy

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 👈 bắt buộc cho session cross-origin
});

// ------------------ Token ------------------
export const getGrantToken = (id) => {
  const payload = {
    fiServiceId: id,
    scopes: "transaction",
    redirectUri: "http://localhost:3000/success",
    language: "vi",
  };
  return api.post("/token/grant", payload);
};

export const exchangeToken = ({ publicToken, fiFullName, logo }) => {
  return api.post("/token/exchange", { publicToken, fiFullName, logo });
};

export const removeGrant = (fiServiceId, accountNumber) => {
  return api.post("/token/remove", { fiServiceId, accountNumber });
};

// ------------------ Services ------------------
export const getListServices = () => api.get("/services/list");

// ------------------ Session ------------------
export const checkSession = () => {
  return api.get("/sessions/check-session");
};

// ------------------ QR Pay ------------------
export const getQRCode = (data) => {
  // payload bắt buộc có fiServiceId + accountNumber
  return api.post("/pay/qr-pay", data);
};

export default api;

