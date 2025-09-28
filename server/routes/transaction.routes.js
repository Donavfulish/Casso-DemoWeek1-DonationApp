import express from "express";
import { TransactionController } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/create", TransactionController.createDonation);
router.get("/list", TransactionController.getDonations);

export default router;
