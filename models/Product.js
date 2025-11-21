// models/Product.js
// Simple product schema for inventory assignment

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // SKU should be unique - uppercase for consistency
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    stock: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

// ensure an index (mongoose creates unique index based on this)
productSchema.index({ sku: 1 }, { unique: true });

export default mongoose.model("Product", productSchema);
