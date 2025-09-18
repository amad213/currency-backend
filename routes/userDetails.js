import express from "express";
import UserDetails from "../models/UserDetails.js";

const router = express.Router();

// Create new user details
router.post("/", async (req, res) => {
  try {
    const newDetails = new UserDetails(req.body);
    const savedDetails = await newDetails.save();
    res.json(savedDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all user details
router.get("/", async (req, res) => {
  try {
    const details = await UserDetails.find().sort({ createdAt: -1 });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
