const mongoose = require("mongoose");
const { Schema } = mongoose;
const campaignsSchema = new Schema({
  campaignName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  radius: {
    type: String,
    required: false,
  },
  volunteersRequired: {
    type: Number,
    required: true,
  },
  searchTag: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewUsers",
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["planning", "created", "executed", "archived"],
    default: "planning",
  },

  teamA: {
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
    },
    points: {
      type: Number,
      default: 0,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewUsers",
      },
    ],
  },
  teamB: {
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
    },
    points: {
      type: Number,
      default: 0,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewUsers",
      },
    ],
  },
  volunteers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewUsers",
      },
      status: {
        type: String,
        enum: ["invite", "sent", "accepted"],
        default: "invite",
      },
    },
  ],
  location: {},
  messages: {
    type: Array, // do-day live poll screen messages
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tasks",
    },
  ],
  group: {
    type: Schema.Types.ObjectId,
    ref: "groups",
    required: true,
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("Campaigns", campaignsSchema);
