//transactions.routes.js
import express from "express"
import { handleWebhookTransaction, handleWebhookRemove } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/transaction", handleWebhookTransaction);
router.post("/remove", handleWebhookRemove)
export default router;