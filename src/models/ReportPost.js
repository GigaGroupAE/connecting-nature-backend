const mongoose = require("mongoose");

const reportReasonSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  otherReason: {
    type: String,
    default: null,
  },
});

const reportPostSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reasons: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile reportPostSchema into a model
const ReportPost = mongoose.model("ReportPost", reportPostSchema);

module.exports = ReportPost;
