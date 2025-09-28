import SessionService from "../services/session.services.js";

export const checkSession = async (req, res) => {
    try {
        // Lấy tất cả sessions theo session_id
        const sessions = await SessionService.getSessions(req.sessionID);

        // Trả về danh sách các bank đã liên kết
        res.json({
            accounts: sessions.map(s => ({
                bankLinked: s.bankLinked,
                fiFullName: s.fiFullName,
                logo: s.logo,
                fiServiceId: s.fiServiceId,
                accountNumber: s.accountNumber
            }))
        });
    } catch (err) {
        console.error("Check session failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};