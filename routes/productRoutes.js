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

const router = express.Router();  

router.post("/products", createProduct);
router.post("/products/:id/increase", increaseStock);
router.post("/products/:id/decrease", decreaseStock);
router.get("/products/:id", getProductSummary);
router.get("/products/:id/transactions", getTransactions);

export default router;
