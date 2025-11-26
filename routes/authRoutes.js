// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/authorize.js";

const router = express.Router();

// Admin-only creates users
router.post("/register", authenticate, allowRoles("Admin"), registerUser);

// public login
router.post("/login", loginUser);

export default router;
