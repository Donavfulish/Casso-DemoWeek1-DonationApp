import express from "express"
import { createGrantToken, exchangeAccessToken, removeGrant } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/grant", createGrantToken);
router.post("/exchange", exchangeAccessToken);
router.post("/remove", removeGrant);
export default router;