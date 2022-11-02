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
  radius: { type: String, required: false },
  location: {
    type: String,
    required: true,
  },
  TeamA: {
    type: (TeamB = {}),
    required: true,
  },
  TeamB: {
    type: (TeamA = {}),
    required: true,
  },
  volunteers: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
});

const Data = new mongoose.model("todays", dbSchema);

module.exports = Data;
