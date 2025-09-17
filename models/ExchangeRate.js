import mongoose from "mongoose";

const ExchangeRateSchema = new mongoose.Schema({
  fromCurrency: { type: String, required: true },
  toCurrency: { type: String, required: true },
  rate: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

ExchangeRateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// ✅ Fix
export default mongoose.models.ExchangeRate ||
  mongoose.model("ExchangeRate", ExchangeRateSchema);
