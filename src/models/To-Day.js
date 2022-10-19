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
});

const Data = new mongoose.model("todays", dbSchema);

module.exports = Data;
