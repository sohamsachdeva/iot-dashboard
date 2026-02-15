const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");
const auth = require("../middleware/auth");

router.get("/", auth(["admin", "viewer", "operator"]), async (req, res) => {
  try {
    const devices = await SensorData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$deviceId",
          lastSeen: { $first: "$timestamp" },
        },
      },
    ]);

    const formatted = devices.map((d) => ({
      id: d._id,
      lastSeen: d.lastSeen,
    }));

    // Admin sees all discovered devices.
    if (req.user.role === "admin") {
      return res.json(
        formatted.map((d) => ({
          deviceId: d.id,
          lastSeen: d.lastSeen,
        }))
      );
    }

    // Non-admin sees assigned devices, even when telemetry has not arrived yet.
    const assigned = Array.isArray(req.user.devices) ? req.user.devices : [];
    const telemetryById = new Map(formatted.map((d) => [d.id, d.lastSeen]));

    const allowed = assigned.map((deviceId) => ({
      deviceId,
      lastSeen: telemetryById.get(deviceId) || null,
    }));

    return res.json(allowed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Device fetch failed" });
  }
});

module.exports = router;
