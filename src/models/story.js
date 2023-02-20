const mongoose = require("mongoose");
const dbSchema = new mongoose.Schema({
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "NewUsers",
  },
  media: {
    type: {},
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  reactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
      required: true,
    },
  ],
  createdAT: {
    type: Date,
    default: Date.now,
  },
});

const Data = new mongoose.model("stories", dbSchema);

module.exports = Data;
