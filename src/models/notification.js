const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  exptoken: {
    type: String,
    required: true,
  },
  body: {
    type: (body = {}),
    required: true,
  },
});

const NewUsers = new mongoose.model("Notifications", dbSchema);

module.exports = NewUsers;
