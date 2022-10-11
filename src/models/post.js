const mongoose = require("mongoose");
const dbSchema = new mongoose.Schema({
  postedby: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  media: {
    type: String,
    required: false,
  },
  reactions: {
    type: Number,
    required: false,
  },
  comments: {
    type: Array,
    required: false,
  },
});

const Data = new mongoose.model("post", dbSchema);

module.exports = Data;
