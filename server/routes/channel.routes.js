import express from "express"
import { getListServices } from "../controllers/channel.controller.js"

const router = express.Router();

router.get("/list", getListServices)

export default router;