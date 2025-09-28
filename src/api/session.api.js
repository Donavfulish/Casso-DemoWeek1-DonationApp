import api from "./index";

export const checkSession = () => api.get("/sessions/check-session");
