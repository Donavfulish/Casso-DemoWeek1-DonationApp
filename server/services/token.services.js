import axiosInstance from "../config/axiosInstance.js";
import pool from "../config/db.js";

class TokenService {
    static async createGrantToken(fiServiceId) {
        try {
            const payload = {
                fiServiceId,
                scopes: "qrpay",
                redirectUri: "http://localhost:5173/dashboard",
                language: "vi",
            };
            const response = await axiosInstance.post("/grant/token", payload);
            return response;
        } catch (error) {
            throw new Error(error.message || "Failed to create grant token")
        }
    }

    static async exchangePublicToken(publicToken) {
        try {
            const response = await axiosInstance.post("/grant/exchange", { publicToken });
            return response;
        } catch (error) {
            throw new Error(error.message || "Failed to exchange access token");
        }
    }

    static async getAccountInfo(accessToken) {
        try {
            const response = await axiosInstance.get("/qr-pay/identity", {
                headers: { Authorization: `${accessToken}` }
            });
            return response;
        } catch (error) {
            throw new Error(error.message || "Failed to get account info");
        }
    }

    static async removeGrant(grantId, accessToken) {
        try {
            const response = await axiosInstance.post("/grant/remove", { grantId }, {
                headers: { Authorization: `${accessToken}` }
            });
            return response;
        } catch (error) {
            throw new Error(error.message || "Failed to remove grant");
        }
    }

    static async deleteAccessTokenBySessionId(sessionId) {
        try {
            const result = await pool.query(
                "DELETE FROM sessions WHERE session_id = $1 RETURNING *",
                [sessionId]
            );

            if (result.rowCount === 0) {
                throw new Error(`No session found with sessionId: ${sessionId}`);
            }

            return { success: true, message: "Session deleted successfully", data: result.rows[0] };
        } catch (err) {
            console.error("Failed to delete session:", err);
            return { success: false, message: err.message };
        }
    }
}

export default TokenService