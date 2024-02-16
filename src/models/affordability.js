const mongoose = require("mongoose");

const affordabilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  minRange: {
    type: Number,
    required: true,
  },
  maxRange: {
    type: Number,
    required: true,
  },
});

const Affordability = mongoose.model("Affordability", affordabilitySchema);

module.exports = Affordability;
