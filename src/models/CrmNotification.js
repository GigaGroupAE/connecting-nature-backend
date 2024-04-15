const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewUsers",
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
    token: {
      type: String,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        if (
          this.data.title === "req-denied" ||
          this.data.title === "req-approve" ||
          this.data.title === "new-bid" ||
          this.data.title === "winning-bid"
        )
          return "subscription";
      },
    },
  },
});

const crmnotification = new mongoose.model("crmnotification", dbSchema);

module.exports = crmnotification;
