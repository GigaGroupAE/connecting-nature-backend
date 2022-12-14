const mongoose = require("mongoose");
const dbSchema = new mongoose.Schema({
  postedby: {
    type: (User = {}),
    required: true,
  },
  media: {
    type: {},
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  reactions: {
    type: (reactions = {}),
    required: false,
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
});

const Data = new mongoose.model("stories", dbSchema);

module.exports = Data;
