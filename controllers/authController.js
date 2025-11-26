// controllers/authController.js
// simple auth controller: register (admin only) + login

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing fields" });
    }

    if (!["Admin", "Manager", "Operator"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    } 

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(409).json({ message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, SALT);
    const user = await User.create({ name, email, password: hash, role });

    const safe = { _id: user._id, name: user.name, email: user.email, role: user.role };
    res.status(201).json(safe);
  } catch (err) {
    console.error("[registerUser]", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(JWT_SECRET)
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("[loginUser]", err.message);
    res.status(500).json({ message: err.message });
  }
};
