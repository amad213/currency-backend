// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userDetailsRoutes from "./routes/userDetails.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";

import adminRoutes from "./routes/admin.js";
import exchangeRoutes from "./routes/exchange.js"; // 👈 import
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/details", userDetailsRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/transactions", transactionRoutes);
app.get("/", (req, res) => res.send("🚀 API is running..."));

// MongoDB Connect
import { connectDB } from './db-config.js';

// Connect to in-memory MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
