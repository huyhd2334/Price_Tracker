import express from "express";
import { register, login, deleteAccount, getMe } from "./auth.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.delete("/me", authenticateToken, deleteAccount);

export default router;
