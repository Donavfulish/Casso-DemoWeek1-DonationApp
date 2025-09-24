import express from "express"
import { createGrantToken, exchangeAccessToken, checkSession } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/grant", createGrantToken);
router.post("/exchange", exchangeAccessToken);
router.get("/check-session", checkSession);
export default router;