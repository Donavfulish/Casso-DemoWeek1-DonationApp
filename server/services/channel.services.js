import axiosInstance from "../config/axiosInstance.js";


class ChannelServices {
    static async getListServices() {
        try {
            const res = await axiosInstance.get("/fi-services")
            return res;
        } catch (error) {
            throw new Error(error.message || "Failed to create grant token")
        }
    }
}

export default ChannelServices