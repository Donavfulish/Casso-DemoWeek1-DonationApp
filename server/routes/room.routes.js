import express from "express"
import { checkCode, createDonationRoom, getSessionByCode, getCodeBySession } from "../controllers/room.controller.js";

const router = express.Router();

// Lấy session_id bằng donation_code
router.get("/by-session", getCodeBySession)
router.get("/:code", getSessionByCode);
// Tạo mới donation room
router.post("/", createDonationRoom);
router.post("/check", checkCode)
export default router;
