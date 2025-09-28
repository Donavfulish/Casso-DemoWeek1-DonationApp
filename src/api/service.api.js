import api from "./index";

export const getListServices = () => api.get("/services/list");
