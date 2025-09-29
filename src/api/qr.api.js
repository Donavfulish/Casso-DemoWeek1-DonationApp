import api from "./index";

export const getQRCode = (data) => api.post("/pay/qr-pay", data);
export const getQRCodeForUser = (data) => api.post("/pay/qr-pay-user", data);
