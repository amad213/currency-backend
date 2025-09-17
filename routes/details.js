import express from "express";
import UserDetails from "../models/UserDetails.js";

const router = express.Router();

// Create new detail
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    // basic validation
    if (!data.fullName || !data.email) {
      return res.status(400).json({ error: "fullName and email are required" });
    }
    const detail = new UserDetails(data);
    await detail.save();
    return res.status(201).json(detail);
  } catch (err) {
    console.error("POST /api/details error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all details
router.get("/", async (req, res) => {
  try {
    const all = await UserDetails.find().sort({ createdAt: -1 });
    return res.json(all);
  } catch (err) {
    console.error("GET /api/details error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
