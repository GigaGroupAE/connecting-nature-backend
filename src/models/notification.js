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
});

const newnotification = new mongoose.model("Notifications", dbSchema);

module.exports = newnotification;
