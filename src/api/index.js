import axios from "axios";

const API_BASE = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ interceptor để handle error / success chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || "Something went wrong!";
    return Promise.reject(new Error(msg));
  }
);

export default api;
