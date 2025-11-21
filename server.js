// server.js
// Small express server for inventory assignment.
// Author: Satish

import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

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


app.get("/status", (req, res) => {
  res.json({
    service: "Inventory Management Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
