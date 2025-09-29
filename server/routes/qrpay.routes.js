import express from "express"
import { getQRCode, getQRCodeForUser } from "../controllers/qrpay.controller.js"

const router = express.Router();

router.post("/qr-pay", getQRCode)
router.post("/qr-pay-user", getQRCodeForUser)
export default router;