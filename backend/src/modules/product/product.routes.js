import express from "express";
import { getProductByUrlController } from "./product.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get", getProductByUrlController)

export default router;