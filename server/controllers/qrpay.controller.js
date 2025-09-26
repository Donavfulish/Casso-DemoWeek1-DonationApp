import QRService from "../services/qrpay.services.js";

export const getQRCode = async (req, res, next) => {
    try {
        const sessionId = req.sessionID;

        // 1️⃣ Lấy accessToken từ Service
        const accessToken = await QRService.getAcessTokenBySession(sessionId);

        const data = req.body;
        console.log(data);
        const result = await QRService.createQRPay(data, accessToken);

        const qr = result.qrPay;
        const { bin, amount, description, accountNumber, accountName } = qr
        const template = "compact2";
        const link = `https://img.vietqr.io/image/${bin}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`
        
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