import express from "express"
import { createGrantToken, exchangeAccessToken, checkSession, removeGrant } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/grant", createGrantToken);
router.post("/exchange", exchangeAccessToken);
router.get("/check-session", checkSession);
router.post("/remove", removeGrant);
export default router;