const mongoose = require("mongoose");

const AuctionSeactions = new mongoose.Schema({
  projectName: {
    type: String,
  },
  projectItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bidApartment",
    },
  ],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endAt: {
    type: Date,
  },
  status: {
    type: String,
  },
});

const auctionSeactions = new mongoose.model(
  "auctionSeactions",
  AuctionSeactions
);
module.exports = auctionSeactions;
