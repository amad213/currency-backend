import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Transaction from "../models/Transaction.js";
import ExchangeRate from "../models/ExchangeRate.js";
import User from "../models/User.js";

const router = express.Router();

// Create transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    // Validate input
    if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Find exchange rate
    const rateDoc = await ExchangeRate.findOne({ 
      fromCurrency: fromCurrency.toUpperCase(), 
      toCurrency: toCurrency.toUpperCase() 
    });
    if (!rateDoc) {
      return res.status(400).json({ message: "Exchange rate not available" });
    }

    // Calculate result
    const result = amount * rateDoc.rate;

    // Create transaction
    const newTx = new Transaction({
      user: req.user.id,
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      amount: parseFloat(amount),
      rate: rateDoc.rate,
      result: parseFloat(result.toFixed(2)),
    });

    await newTx.save();
    
    // Populate user data for response
    await newTx.populate('user', 'name email');
    
    res.json({ 
      message: "Transaction created successfully", 
      transaction: newTx 
    });
  } catch (err) {
    console.error('Transaction creation error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get transaction statistics for user
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalResult: { $sum: "$result" },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          approvedTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      totalResult: 0,
      pendingTransactions: 0,
      approvedTransactions: 0
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
