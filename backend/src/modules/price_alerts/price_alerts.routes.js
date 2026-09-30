import express from "express";
import { createAlertController, deleteAlertController } from "./price_alerts.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create/:id", createAlertController);
router.delete("/delete/:id", deleteAlertController);

export default router