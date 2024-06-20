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
    image: [
      {
        filename: String,
        mimetype: String,
      },
    ],
    PropertyType: {
      type: String,
      required: true,
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
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
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
      enum: [
        "Starting Soon",
        "Started",
        "Closed",
        "Archive",
        "Under Review",
        "rejected",
      ],
      default: "Starting Soon",
    },
    thirdParty: {
      type: String,
    },
    denyReason: {
      type: String,
    },
    announcement: [
      {
        announcementItem: {
          content: {
            type: mongoose.Schema.Types.Mixed,
            default: null, // Set your default content value here
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      },
    ],
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
