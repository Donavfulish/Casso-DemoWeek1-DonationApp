import api from "./index.js";

export const getTransactionList = () => api.get("transaction/list");
