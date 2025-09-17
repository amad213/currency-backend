// server/routes/userDetails.js
import express from "express";
import UserDetails from "../models/UserDetails.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: submit details
router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, accountType, accountNumber } = req.body;
    const details = new UserDetails({ fullName, phone, email, accountType, accountNumber });
    await details.save();
    res.json({ success: true, details });
  } catch (err) {
    console.error("POST /api/details error:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

// Admin-only: list all details
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const all = await UserDetails.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error("GET /api/details error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
