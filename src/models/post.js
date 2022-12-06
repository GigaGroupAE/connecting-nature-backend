const mongoose = require("mongoose");
const dbSchema = new mongoose.Schema({
  postedby: {
    type: (User = {}),
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  media: {
    type: {},
    required: false,
  },
  reactions: {
    type: (reactions = {}),
    required: false,
  },
  comments: {
    type: Array,
    required: false,
  },
  shares: {
    type: Array,
    required: false,
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
});

const Data = new mongoose.model("post", dbSchema);

module.exports = Data;
