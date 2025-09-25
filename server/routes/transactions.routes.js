//transactions.routes.js
import express from "express"
import { getTransactions, handleWebhook } from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/list", getTransactions);
router.post("/transaction", handleWebhook);

export default router;