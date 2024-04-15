const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema(
  {
    bidBy: [
      {
        _id: {
          type: String,
        },
        fullName: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        profile: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        expoPushToken: {
          type: String,
        },
        code: {
          type: String,
        },
      },
    ],
    bidOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bidApartment",
    },
    bidPrice: {
      type: String,
      required: true,
    },
    bidTime: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const bids = new mongoose.model("bids", dbSchema);

module.exports = bids;
