const express = require("express");
const router = express.Router();
const Parameter = require("../models/Parameter");
const auth = require("../middleware/auth");

// Admin creates parameter
router.post("/parameters", auth(["admin"]), async (req, res) => {
  const param = new Parameter(req.body);
  await param.save();
  res.json(param);
});

// Get parameters for a device
router.get("/parameters/:deviceId", auth(), async (req, res) => {
  const params = await Parameter.find({ device: req.params.deviceId });
  res.json(params);
});

module.exports = router;
