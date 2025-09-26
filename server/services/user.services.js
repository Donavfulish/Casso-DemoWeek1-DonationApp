import axiosInstance from "../config/axiosInstance.js";

class TransactionService {
    static async getTransaction(accessToken) {
        try {
            const {transactions} = await axiosInstance("/transactions", {
                headers: { Authorization: `${accessToken}` }
            })
            return 
        } catch (error) {
            console.error()

        }
    }
}
