import express from "express"
import { getQRCode } from "../controllers/qrpay.controller.js"

const router = express.Router();

router.post("/qr-pay", getQRCode)

export default router;