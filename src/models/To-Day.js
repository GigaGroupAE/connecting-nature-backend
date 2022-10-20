const mongoose = require("mongoose");
const dbSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: { type: String, required: true },
  radius: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },
  TeamA: {
    type: (TeamA = {}),
    required: true,
  },
  TeamB: {
    type: (TeamB = {}),
    required: true,
  },
});

const Data = new mongoose.model("todays", dbSchema);

module.exports = Data;
