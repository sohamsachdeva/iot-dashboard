const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

const devices = ["device_001", "device_002", "device_003"];

client.on("connect", () => {
  console.log("Simulator connected to MQTT");

  setInterval(() => {
    devices.forEach((device) => {
      const payload = {
        deviceId: device,
        temperature: Math.floor(20 + Math.random() * 15),
        humidity: Math.floor(40 + Math.random() * 30),
        timestamp: new Date(),
      };

      client.publish(
        `iot/device/${device}/data`,
        JSON.stringify(payload)
      );
    });
  }, 5000);
});
