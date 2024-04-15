const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const dbSchema = new mongoose.Schema(
  {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NewUsers",
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    denyingReason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "approve", "rejected", "remove"],
      default: "Pending",
    },
    removedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
    },
  },
  {
    timestamps: true,
  }
);

const ChannelSubscription = new mongoose.model("ChannelSubscription", dbSchema);

module.exports = ChannelSubscription;
