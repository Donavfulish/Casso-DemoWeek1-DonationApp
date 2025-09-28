import express from "express"
import { checkSession } from "../controllers/session.controller.js";

const router = express.Router();

router.get("/check-session", checkSession);

export default router;