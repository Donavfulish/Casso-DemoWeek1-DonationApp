import axiosInstance from "../config/axiosInstance.js";

class QRService {
    static async createQRPay(data, accessToken) {
        try {
            const payload = {
                amount: data.amount,
                description: data.description,
                referenceNumber: data.referenceNumber
            }
            const res = await axiosInstance.post("/qr-pay", payload, {
                headers: { Authorization: `${accessToken}` } // thêm Bearer
            });
            return res;
        } catch (error) {
            console.error("[QRService] createQRPay error:", error.response?.data || error.message);
            throw error; // nên throw ra để controller xử lý
        }
    }
}
export default QRService