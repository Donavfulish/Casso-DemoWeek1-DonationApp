import axiosInstance from "../config/axiosInstance.js";

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
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response;
        } catch (error) {
            throw new Error(error.message || "Failed to remove grant");
        }
    }
}

export default TokenService