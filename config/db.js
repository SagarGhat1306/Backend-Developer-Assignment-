// config/db.js
// Author: sagar
// Date: 2025-11-21
// Simple MongoDB connection helper used by server.js

import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
  
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`[DB] Connected to MongoDB at ${uri}`);
  } catch (err) {
  
    console.error("[DB] Connection error:", err.message);
   
    throw err;
  }
};

export default connectDB;
