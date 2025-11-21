// controllers/productController.js
// Basic CRUD and transaction logic for product inventory
// Author: Sagar


import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";


const findProductOrThrow = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const e = new Error("Invalid product id format");
    e.status = 400;
    throw e;
  }
  const p = await Product.findById(id);
  if (!p) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  return p;
};

// Create Product API 
export const createProduct = async (req, res) => {
  try {
    const { name, sku, initialStock } = req.body;

    if (initialStock == null || initialStock < 0) {
      return res.status(400).json({ message: "initialStock must be provided and >= 0" });
    }

    // normalize SKU to uppercase
    const normalizedSku = String(sku).trim().toUpperCase();

    
    const already = await Product.findOne({ sku: normalizedSku });
    if (already) {
      return res.status(409).json({ message: `SKU already exists: ${normalizedSku}` });
    }

    const product = new Product({ name: String(name).trim(), sku: normalizedSku, stock: initialStock });
    await product.save();

  
    return res.status(201).json(product);
  } catch (err) {
   
    if (err.code === 11000) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    console.error("[createProduct] Error:", err.message);
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

// Increase Stock API
export const increaseStock = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity == null || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be provided and > 0" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await findProductOrThrow(id);

    product.stock = product.stock + Number(quantity);
    await product.save({ session });

    await Transaction.create([{ productId: product._id, type: "INCREASE", quantity }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Stock increased", product });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("[increaseStock] Error:", err.message);
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

// Decrease Stock API
export const decreaseStock = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity == null || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be provided and > 0" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await findProductOrThrow(id);

    if (product.stock < Number(quantity)) {
      
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient stock to complete this operation" });
    }

    product.stock = product.stock - Number(quantity);
    await product.save({ session });

    await Transaction.create([{ productId: product._id, type: "DECREASE", quantity }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Stock decreased", product });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("[decreaseStock] Error:", err.message);
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

// Product Summary API
export const getProductSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductOrThrow(id);

  
    const agg = await Transaction.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: "$type", total: { $sum: "$quantity" } } }
    ]);

    const totals = { INCREASE: 0, DECREASE: 0 };
    agg.forEach((row) => {
      totals[row._id] = row.total;
    });

    return res.json({
      product,
      currentStock: product.stock,
      totalIncreased: totals.INCREASE,
      totalDecreased: totals.DECREASE
    });
  } catch (err) {
    console.error("[getProductSummary] Error:", err.message);
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

// Transaction History API
export const getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    await findProductOrThrow(id); 

    const transactions = await Transaction.find({ productId: id }).sort({ timestamp: -1 });

    return res.json(transactions);
  } catch (err) {
    console.error("[getTransactions] Error:", err.message);
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
