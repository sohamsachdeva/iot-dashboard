const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

router.get("/alerts", auth(), async (req, res) => {
  const query =
    req.user.role === "admin"
      ? {}
      : { deviceId: { $in: req.user.devices } };

  const alerts = await Alert.find(query)
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(alerts);
});

module.exports = router;