const mqtt = require("mqtt");

// HiveMQ public WebSocket broker (very stable)
const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

const DEVICE_ID = "device_001";

client.on("connect", () => {
  console.log("✅ MQTT Publisher CONNECTED to HiveMQ");

  setInterval(() => {
    const payload = {
      deviceId: DEVICE_ID,
      temperature: Math.floor(Math.random() * 10) + 25,
      humidity: Math.floor(Math.random() * 20) + 40,
      battery: Math.floor(Math.random() * 40) + 60,
      timestamp: Date.now()
    };

    const topic = `iot/device/${DEVICE_ID}/data`;

    client.publish(topic, JSON.stringify(payload), { qos: 0 });
    console.log("📤 Published:", payload);
  }, 5000);
});

client.on("error", (err) => {
  console.error("❌ MQTT ERROR:", err.message);
});

client.on("reconnect", () => {
  console.log("🔄 Reconnecting to MQTT...");
});