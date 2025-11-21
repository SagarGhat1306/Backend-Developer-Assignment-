// models/Transaction.js
// Stores increase / decrease operations for a product

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  type: { type: String, enum: ["INCREASE", "DECREASE"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  timestamp: { type: Date, default: Date.now }
});

// helpful index to query transactions by product quickly
transactionSchema.index({ productId: 1, timestamp: -1 });

export default mongoose.model("Transaction", transactionSchema);
