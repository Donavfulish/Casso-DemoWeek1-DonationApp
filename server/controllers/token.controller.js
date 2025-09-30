import TokenService from "../services/token.services.js";
import SessionService from "../services/session.services.js";
import RoomService from "../services/room.services.js";

export const createGrantToken = async (req, res, next) => {
    try {
        const { fiServiceId } = req.body;
        const result = await TokenService.createGrantToken(fiServiceId);
        res.json({ grantToken: result.grantToken });
    } catch (err) {
        next(err);
    }
}

export const exchangeAccessToken = async (req, res, next) => {
    try {
        const { publicToken, fiFullName, logo } = req.body;
        const result = await TokenService.exchangeAccessToken(publicToken);
        const { accessToken, grantId, requestId } = result;

        // Lấy account info
        const accountInfo = await TokenService.getAccountInfo(accessToken);
        if (!accountInfo) {
            return res.status(400).json({
                success: false,
                message: "Không lấy được thông tin tài khoản",
            });
        }

        const fiServiceId = accountInfo.fiService?.id;
        const accountNumber = accountInfo.accountNumber;

        const existed = await SessionService.findByFiServiceAndAccount(
            fiServiceId,
            accountNumber
        );

        if (existed) {
            // Nếu đã có → xóa quyền của user này và clean DB
            await TokenService.removeGrant(existed.grantId, existed.accessToken)
            await TokenService.removeGrant(grantId, accessToken);
            await SessionService.deleteByFiServiceAndAccount(fiServiceId, accountNumber);

            return res.status(400).json({
                success: false,
                message: "Tài khoản đã được liên kết với một người dùng khác",
            });
        }

        // Lưu vào PostgreSQL session (server-side)
        await SessionService.createOrUpdateSession(req.sessionID, {
            accessToken,
            grantId,
            requestId,
            bankLinked: true,
            fiFullName,
            logo,
            fiServiceId,
            accountNumber,
        });

        res.json({
            success: true,
            message: "Tạo tài khoản thành công"
        });

    } catch (err) {
        next(err);
    }
};

export const removeGrant = async (req, res) => {
    try {
        const { fiServiceId, accountNumber } = req.body;

        if (!fiServiceId || !accountNumber) {
            return res.status(400).json({ message: "Thiếu fiServiceId hoặc accountNumber" });
        }

        const session = await SessionService.findByFiServiceAndAccount(fiServiceId, accountNumber);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        await TokenService.removeGrant(session.grantId, session.accessToken);
        await SessionService.deleteByFiServiceAndAccount(fiServiceId, accountNumber);
        await RoomService.deleteBySession(req.sessionID);
        
        return res.json({ message: "Successfully removed grant and session" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed remove" });
    }
};

