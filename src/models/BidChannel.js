const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  members: [
    {
      member: { type: mongoose.Schema.Types.ObjectId, ref: "NewUsers" },
      privilege: { type: String },
      code: { type: String },
    },
  ],
  type: {
    type: String,
  },
  appartments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bidApartment",
    },
  ],
  groupPic: {
    type: String,
  },
});

const bidChannel = new mongoose.model("bidChannel", dbSchema);

module.exports = bidChannel;
