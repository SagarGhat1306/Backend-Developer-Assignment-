// routes/productRoutes.js
// Author: sagar

import express from "express";
import {
  createProduct,
  increaseStock,
  decreaseStock,
  getProductSummary,
  getTransactions
} from "../controllers/productController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/authorize.js";

const router = express.Router();

// Create product: Admin + Manager
router.post("/products", authenticate, allowRoles("Admin", "Manager"), createProduct);

// Increase / Decrease: Admin, Manager, Operator
router.post("/products/:id/increase", authenticate, allowRoles("Admin","Manager","Operator"), increaseStock);
router.post("/products/:id/decrease", authenticate, allowRoles("Admin","Manager","Operator"), decreaseStock);

// View product and transactions: any authenticated user (all roles)
router.get("/products/:id", authenticate, allowRoles("Admin","Manager","Operator"), getProductSummary);
router.get("/products/:id/transactions", authenticate, allowRoles("Admin","Manager","Operator"), getTransactions);

export default router;
