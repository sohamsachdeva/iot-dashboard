const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  deviceId: String,
  type: String, 
  value: Number,
  threshold: Number,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", AlertSchema);