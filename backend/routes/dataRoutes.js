const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");
const auth = require("../middleware/auth");

router.get("/:deviceId", auth(["admin", "viewer", "operator"]), async (req, res) => {
  try {
    const data = await SensorData.find({
      deviceId: req.params.deviceId
    }).sort({ timestamp: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Data fetch failed" });
  }
});

module.exports = router;