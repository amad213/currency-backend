// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userDetailsRoutes from "./routes/userDetails.js";
import authRoutes from "./routes/auth.js";
 

import adminRoutes from "./routes/admin.js";
import exchangeRoutes from "./routes/exchange.js"; // 👈 import
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/details", userDetailsRoutes);
app.use("/api/exchange", exchangeRoutes);
 
app.get("/", (req, res) => res.send("🚀 API is running..."));

// MongoDB Connect

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
