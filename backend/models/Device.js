const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  name: String,
  location: String,
  enabled: { type: Boolean, default: true },

  assignedUsers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Device", DeviceSchema);
