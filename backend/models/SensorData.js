const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  temperature: Number,
  humidity: Number,
  battery: Number,           //  REQUIRED
  alerts: [String],          //  REQUIRED
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", SensorDataSchema);