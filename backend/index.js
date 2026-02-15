const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./mqttClient");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/deviceRoutes"));
app.use("/api", require("./routes/dataRoutes"));
app.use("/api", require("./routes/thresholdRoutes"));
app.use("/api", require("./routes/alertRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("Unified IoT Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});