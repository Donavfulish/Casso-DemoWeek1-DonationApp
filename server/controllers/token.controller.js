import TokenService from "../services/token.services.js";
import SessionService from "../services/session.services.js";


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
        const { publicToken } = req.body;
        const result = await TokenService.exchangePublicToken(publicToken);
        const { accessToken, grantId, requestId } = result;
        console.log('getbyexchange:', accessToken)
        // Lưu vào PostgreSQL session (server-side)
        await SessionService.createOrUpdateSession(req.sessionID, {
            accessToken,
            grantId,
            requestId,
            bankLinked: true
        });

        // Kiểm tra account info
        const accountInfo = await TokenService.getAccountInfo(accessToken);
        if (!accountInfo || accountInfo.fiService?.type !== "PERSONAL") {
            await TokenService.removeGrant(grantId, accessToken);
            await SessionService.createOrUpdateSession(req.sessionID, {
                accessToken: null,
                grantId: null,
                requestId: null,
                bankLinked: false
            });
            return res.status(400).json({
                success: false,
                message: "Tài khoản không hợp lệ, quyền đã bị thu hồi."
            });
        }

        res.json({
            success: true,
            message: "Tạo tài khoản thành công"
        });
    } catch (err) {
        next(err);
    }
};

export const checkSession = async (req, res) => {
    const session = await SessionService.getSession(req.sessionID);
    res.json({
        bankLinked: session?.bankLinked || false
    });
};