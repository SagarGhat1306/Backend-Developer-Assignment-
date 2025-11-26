// scripts/seedUsers.js
// seed Admin, Manager, Operator from .env

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const run = async () => {
  try {
    await connectDB();

    const users = [
      { name: "Admin User", email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASS, role: "Admin" },
      { name: "Manager User", email: process.env.SEED_MANAGER_EMAIL, password: process.env.SEED_MANAGER_PASS, role: "Manager" },
      { name: "Operator User", email: process.env.SEED_OPERATOR_EMAIL, password: process.env.SEED_OPERATOR_PASS, role: "Operator" }
    ];

    for (const u of users) {
      if (!u.email || !u.password) {
        console.log("Skipping incomplete seed entry", u);
        continue;
      }
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log("Skipping existing:", u.email);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ name: u.name, email: u.email, password: hash, role: u.role });
      console.log("Created user:", u.email, u.role);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
};

run();
