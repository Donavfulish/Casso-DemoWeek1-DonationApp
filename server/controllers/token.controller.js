import TokenService from "../services/token.services.js";

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

        // 2️⃣ Lưu session tạm
        req.session.accessToken = accessToken;
        req.session.grantId = grantId;
        req.session.requestId = requestId;
        console.log(req)
        // 3️⃣ Lấy thông tin tài khoản
        const accountInfo = await TokenService.getAccountInfo(accessToken);
        const isValid = accountInfo &&
            accountInfo.fiService?.type === "PERSONAL"
        if (!isValid) {
            await TokenService.removeGrant(grantId, accessToken);

            req.session.accessToken = null;
            req.session.grantId = null;
            req.session.requestId = null;
            req.session.bankLinked = false;

            return res.status(400).json({
                success: false,
                message: "Tài khoản không hợp lệ, quyền đã bị thu hồi."
            });
        }

        req.session.bankLinked = true;
        res.json({
            success: true,
            message: "Tạo tài khoản thành công"
        });
    } catch (err) {
        next(err)
    }
}

export const checkSession = async (req, res) => {
    console.log(req.session);
    res.json({
        bankLinked: req.session.backLinked || false
    })
}