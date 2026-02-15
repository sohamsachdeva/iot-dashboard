require("dotenv").config();
const mqtt = require("mqtt");
const mongoose = require("mongoose");
const SensorData = require("./models/SensorData");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (mqttClient)"))
  .catch(console.error);

// SAME BROKER AS PUBLISHER
const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", () => {
  console.log("✅ MQTT Client CONNECTED (HiveMQ)");

  client.subscribe("iot/device/+/data", () => {
    console.log("📡 Subscribed to iot/device/+/data");
  });
});

client.on("message", async (topic, message) => {
  const msg = message.toString();

  console.log("📩 Received:", msg);

  let data;
  try {
    data = JSON.parse(msg);
  } catch {
    console.log("⚠ Ignored non-JSON message");
    return;
  }

  // ignore messages without deviceId
  if (!data.deviceId) return;

  let alerts = [];

  if (data.temperature > 35) alerts.push("HIGH_TEMPERATURE");
  if (data.battery < 20) alerts.push("LOW_BATTERY");
  if (data.humidity > 80) alerts.push("HIGH_HUMIDITY");

  await SensorData.create({
    deviceId: data.deviceId,
    temperature: data.temperature,
    humidity: data.humidity,
    battery: data.battery,
    alerts,
    timestamp: new Date(),
  });

  console.log("💾 Saved to MongoDB");
});

client.on("error", (err) => {
  console.error("MQTT ERROR:", err.message);
});