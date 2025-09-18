import mongoose from "mongoose";
import ExchangeRate from "./models/ExchangeRate.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "./db-config.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await ExchangeRate.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create initial exchange rates
    const initialRates = [
      { fromCurrency: "USD", toCurrency: "PKR", rate: 277.50, source: "manual" },
      { fromCurrency: "USD", toCurrency: "EUR", rate: 0.85, source: "manual" },
      { fromCurrency: "USD", toCurrency: "GBP", rate: 0.73, source: "manual" },
      { fromCurrency: "USD", toCurrency: "JPY", rate: 110.25, source: "manual" },
      { fromCurrency: "USD", toCurrency: "CAD", rate: 1.25, source: "manual" },
      { fromCurrency: "USD", toCurrency: "AUD", rate: 1.35, source: "manual" },
      { fromCurrency: "EUR", toCurrency: "USD", rate: 1.18, source: "manual" },
      { fromCurrency: "EUR", toCurrency: "PKR", rate: 327.25, source: "manual" },
      { fromCurrency: "GBP", toCurrency: "USD", rate: 1.37, source: "manual" },
      { fromCurrency: "GBP", toCurrency: "PKR", rate: 380.25, source: "manual" },
      { fromCurrency: "PKR", toCurrency: "USD", rate: 0.0036, source: "manual" },
      { fromCurrency: "PKR", toCurrency: "EUR", rate: 0.0031, source: "manual" },
    ];

    await ExchangeRate.insertMany(initialRates);
    console.log("💱 Created initial exchange rates");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    await adminUser.save();
    console.log("👤 Created admin user (admin@example.com / admin123)");

    // Create test user
    const testUserPassword = await bcrypt.hash("user123", 10);
    const testUser = new User({
      name: "Test User",
      email: "user@example.com",
      password: testUserPassword,
      role: "user"
    });
    await testUser.save();
    console.log("👤 Created test user (user@example.com / user123)");

    console.log("🎉 Database seeded successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("User: user@example.com / user123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
