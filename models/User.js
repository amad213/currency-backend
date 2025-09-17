import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  balances: [
    {
      currency: { type: String, required: true },
      amount: { type: Number, default: 0, min: 0 },
    },
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

UserSchema.methods.getBalance = function (currency) {
  const balance = this.balances.find((b) => b.currency === currency);
  return balance ? balance.amount : 0;
};

UserSchema.methods.updateBalance = function (currency, amount) {
  const balanceIndex = this.balances.findIndex((b) => b.currency === currency);
  if (balanceIndex >= 0) {
    this.balances[balanceIndex].amount = amount;
  } else {
    this.balances.push({ currency, amount });
  }
  return this.save();
};

export default mongoose.model("User", UserSchema);
