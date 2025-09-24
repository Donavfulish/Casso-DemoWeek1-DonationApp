import QRService from "../services/qrpay.services.js";

export const getQRCode = async (req, res, next) => {
    try {
        // 1️⃣ Lấy accessToken từ session
        const accessToken = req.session.accessToken;
        console.log(req.session)
        if (!accessToken || !req.session.bankLinked) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản chưa verified hoặc accessToken không tồn tại"
            });
        }
        const data = req.body;
        const result = await QRService.createQRPay(data, accessToken);

        const qr = result.qrPay;
        const {bin,  amount, description, accountNumber, accountName, qrCode, referenceNumber, virtualAccountNumber} = qr
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