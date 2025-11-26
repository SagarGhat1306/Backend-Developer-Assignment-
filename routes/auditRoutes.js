// routes/auditRoutes.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/authorize.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET /api/audit?page=1&limit=20
router.get("/", authenticate, allowRoles("Admin", "Manager"), async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Transaction.find({})
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId", "name")
        .populate("userId", "name email")
        .lean(),
      Transaction.countDocuments()
    ]);

    const data = items.map(t => ({
      productId: t.productId?._id || null,
      productName: t.productId?.name || null,
      userId: t.userId?._id || null,
      userName: t.userId?.name || t.userId?.email || null,
      role: t.userRole,
      type: t.type,
      quantity: t.quantity,
      timestamp: t.timestamp
    }));

    
    res.json({ meta: { total, page, limit, pages: Math.ceil(total / limit) }, data });
  } catch (err) {
    console.error("[GET /audit]", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
