const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NewUsers",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bidChannel",
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bids",
      },
    ],
    ProjectName: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    PropertyType: {
      type: String,
      required: true,
      enum: ["Residential Apartment", "Commercial", "Studio", "Kiosk Place"],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bids",
    },
    biddingTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Starting Soon", "Started", "Closed", "Archive"],
      default: "Starting Soon",
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 5;
}

const bidAppartment = new mongoose.model("bidApartment", dbSchema);

module.exports = bidAppartment;
