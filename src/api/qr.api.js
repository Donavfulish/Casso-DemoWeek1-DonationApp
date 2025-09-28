import api from "./index";

export const getQRCode = (data) => api.post("/pay/qr-pay", data);
