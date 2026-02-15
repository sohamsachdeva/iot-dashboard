const mongoose = require("mongoose");

const ThresholdSchema = new mongoose.Schema({
  deviceId: String,
  temperatureMax: Number,
  humidityMax: Number,
  batteryMin: Number,
});

module.exports = mongoose.model("Threshold", ThresholdSchema);