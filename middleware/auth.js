// middleware/auth.js
// verify jwt and attach req.user

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    req.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error("[authenticate]", err.message);
    res.status(500).json({ message: err.message });
  }
};
