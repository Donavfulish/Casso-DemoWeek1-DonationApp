// src/shared/api.js
import axios from "axios";

const API_BASE = "http://localhost:4000"; // đổi thành process.env.REACT_APP_API_BASE khi deploy

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 👈 bắt buộc cho session cross-origin
});

export const getGrantToken = (id) => {
  const payload = {
    fiServiceId: id,
    scopes: "transaction",
    redirectUri: "http://localhost:3000/success",
    language: "vi",
  }
  return api.post("/token/grant", payload)
}
// export const createQrCode = (payload) => api.post("/qr/create", payload);
export const getListServices = () => api.get("/services/list");
export const exchangeToken = (publicToken) => {
  return api.post("/token/exchange", { publicToken })
}
export const checkSession = () => {
  return api.get("/token/check-session");
};

export const getQRCode = (data) => {
  return api.post("pay/qr-pay", data)
}
export default api;

