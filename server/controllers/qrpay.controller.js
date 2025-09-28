import QRService from "../services/qrpay.services.js";
import TokenService from "../services/token.services.js";
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
        const { bin, amount: qrAmount, description: qrDesc, accountNumber: qrAccNo, accountName, qrCode } = qr;

        const template = "compact2";
        const link = `https://img.vietqr.io/image/${bin}-${qrAccNo}-${template}.png?amount=${qrAmount}&addInfo=${qrDesc}&accountName=${accountName}`;
        const dynamicQRBase64 = await QRCode.toDataURL(qrCode, { width: 300 });
        
        console.log(qrCode);
        res.json({
            success: true,
            message: "QR code generated successfully",
            qrData: result,
            link: link,
            dynamicLink: dynamicQRBase64
        });

    } catch (error) {
        console.error("[getQRCode] error:", error.response?.data || error.message);

        res.status(400).json({
            success: false,
            message: error.response?.data?.message || error.message || "Failed to generate QR code",
        });
    }
} 