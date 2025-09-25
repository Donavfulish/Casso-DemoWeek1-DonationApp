import { decrypt } from "../utils/crypto.js";
import axiosInstance from "../config/axiosInstance.js";
import pool from "../config/db.js";

class QRService {
    static async getAcessTokenBySession(sessionId) {
        const result = await pool.query(
            "SELECT access_token, bank_linked FROM sessions WHERE session_id = $1",
            [sessionId]
        );
        if (result.rowCount === 0 || !result.rows[0].bank_linked) {
            throw new Error("Tài khoản chưa verified hoặc accessToken không tồn tại");
        }

        const access_token = decrypt(result.rows[0].access_token)
        console.log('getbysession:', access_token)
        return access_token;
    }

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