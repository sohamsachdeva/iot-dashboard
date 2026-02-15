const express = require("express");
const router = express.Router();
const Threshold = require("../models/Threshold");
const auth = require("../middleware/auth");

// Set thresholds (admin)
router.post("/thresholds", auth(["admin"]), async (req, res) => {
  const { deviceId, temperatureMax, humidityMax, batteryMin } = req.body;

  const t = await Threshold.findOneAndUpdate(
    { deviceId },
    { temperatureMax, humidityMax, batteryMin },
    { upsert: true, new: true }
  );

  res.json(t);
});

module.exports = router;