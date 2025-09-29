import express from "express"
import { checkCode, createDonationRoom, getSessionByCode } from "../controllers/room.controller.js";

const router = express.Router();

// Tạo mới donation room
router.post("/", createDonationRoom);

// Lấy session_id bằng donation_code
router.get("/:code", getSessionByCode);
router.post("/check", checkCode)
export default router;
