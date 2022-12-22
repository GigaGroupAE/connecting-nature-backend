const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  body: {
    type: (body = {}),
    required: true,
  },
  data: {
    title: {
      type: String,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        if (
          this.data.title === "campaign-invite" ||
          this.data.title === "campaign-invite-accepted" ||
          this.data.title === "campaign-invite-rejected"
        )
          return "todays";
        if (
          this.data.title === "post-comment" ||
          this.data.title === "post-like"
        )
          return "post";
      },
    },
  },
});

const newnotification = new mongoose.model("Notifications", dbSchema);

module.exports = newnotification;
