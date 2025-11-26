// server.js
// Small express server for inventory assignment.
// Author: Satish
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";


const app = express();

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Exiting: DB connection failed");
    process.exit(1);
  }
})();

app.use(express.json());
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", auditRoutes);


app.get("/status", (req, res) => {
  res.json({
    service: "Inventory Management Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
