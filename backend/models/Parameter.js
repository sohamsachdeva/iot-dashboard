const mongoose = require("mongoose");

const ParameterSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },

  name: { type: String, required: true },
  unit: String,

  dataType: {
    type: String,
    enum: ["boolean", "int", "uint", "float", "sfloat"],
    required: true,
  },

  min: Number,
  max: Number,

  locked: { type: Boolean, default: false }, // admin-only edit
});

module.exports = mongoose.model("Parameter", ParameterSchema);
