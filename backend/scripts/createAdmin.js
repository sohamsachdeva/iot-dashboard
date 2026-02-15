const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    username: "admin",
    email: "admin@iot.com",
    password: hashedPassword,
    role: "admin",
    devices: ["device_001", "device_002", "device_003"],
  });

  await admin.save();
  console.log("Admin user created ✅");
  process.exit();
}

createAdmin();
