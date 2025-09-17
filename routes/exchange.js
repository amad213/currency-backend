import express from "express";
const router = express.Router();

// GET /api/exchange/rates
router.get("/rates", (req, res) => {
  // You can later fetch live rates from an API
  res.json([
    { currency: "USD", rate: 1 },
    { currency: "PKR", rate: 277 },
    { currency: "EUR", rate: 0.92 },
  ]);
});

export default router;
