import QRService from "../services/qrpay.services.js";
import TokenService from "../services/token.services.js";
import RoomService from "../services/room.services.js";
import QRCode from "qrcode";

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
        const { bin, amount: qrAmount, description: qrDesc, accountNumber: qrAccNo, accountName, qrCode, virtualAccountNumber: vAN } = qr;

        const template = "compact2";
        const link = `https://img.vietqr.io/image/${bin}-${vAN}-${template}.png?amount=${qrAmount}&addInfo=${qrDesc}&accountName=${accountName}`;
        const dynamicQRBase64 = await QRCode.toDataURL(qrCode, { width: 300 });

        console.log(qrCode);
        res.json({
            success: true,
            message: "QR code generated successfully",
            qrData: result,
            link: link,
            dynamicLink: link
        });

    } catch (error) {
        console.error("[getQRCode] error:", error.response?.data || error.message);

        res.status(400).json({
            success: false,
            message: error.response?.data?.message || error.message || "Failed to generate QR code",
        });
    }   
}

export const getQRCodeForUser = async (req, res, next) => {
    console.log("start")
    try {
        const resultSession = await RoomService.getSessionByCode(req.body.code);
        console.log("resultSession", resultSession)

        if (!resultSession.success) {
            return res.status(404).json(resultSession); // trả về luôn lỗi từ service
        }

        const sessionId = resultSession.data.session_id;
        const { amount, description, referenceNumber } = req.body;

        const accessToken = await TokenService.getAccessTokenBySession(
            sessionId,
            "",
            ""
        );  

        const qrPayload = { amount, description, referenceNumber };

        const result = await QRService.getQRCode(qrPayload, accessToken);

        const qr = result.qrPay;
        const { bin, amount: qrAmount, description: qrDesc, accountNumber: qrAccNo, accountName, qrCode, virtualAccountNumber: vAN } = qr;

        const template = "compact2";
        const link = `https://img.vietqr.io/image/${bin}-${vAN}-${template}.png?amount=${qrAmount}&addInfo=${qrDesc}&accountName=${accountName}`;
        const dynamicQRBase64 = await QRCode.toDataURL(qrCode, { width: 300 });

        res.json({
            success: true,
            message: "QR code generated successfully",
            qrData: result,
            link: link,
            dynamicLink: link
        });

    } catch (error) {
        console.error("[getQRCode] error:", error.response?.data || error.message);

        res.status(400).json({
            success: false,
            message: error.response?.data?.message || error.message || "Failed to generate QR code",
        });
    }
} 