import QRService from "../services/qrpay.services.js";
import TokenService from "../services/token.services.js";

export const getQRCode = async (req, res, next) => {
    try {
        const sessionId = req.sessionID;
        const { fiServiceId, accountNumber, amount, description, referenceNumber } = req.body;

        const accessToken = await TokenService.getAccessTokenBySession(
            sessionId,
            fiServiceId,
            accountNumber
        );

        const qrPayload = { amount, description, referenceNumber };

        const result = await QRService.getQRCode(qrPayload, accessToken);

         const qr = result.qrPay;
        const { bin, amount: qrAmount, description: qrDesc, accountNumber: qrAccNo, accountName } = qr;

        const template = "compact2";
        const link = `https://img.vietqr.io/image/${bin}-${qrAccNo}-${template}.png?amount=${qrAmount}&addInfo=${qrDesc}&accountName=${accountName}`;

        res.json({
            success: true,
            qrData: result,
            link: link
        });

    } catch (error) {
        console.error("[getQRCode] error:", error.response?.data || error.message);
        next(error)
    }
} 