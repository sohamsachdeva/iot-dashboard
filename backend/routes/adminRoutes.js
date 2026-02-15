const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// assign devices to user
router.post("/assign-devices", auth(["admin"]), async (req, res) => {
  const { userId, devices } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.devices = devices;
  await user.save();

  res.json({ msg: "Devices assigned successfully" });
});

module.exports = router;
