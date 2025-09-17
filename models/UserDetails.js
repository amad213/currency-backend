import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  accountType: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserDetails ||
  mongoose.model("UserDetails", UserDetailsSchema);
