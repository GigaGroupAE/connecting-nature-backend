const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  members: {
    type: Array,
    required: true,
  },

  messages: {
    type: Array,
    required: true,
  },
});

const Data = new mongoose.model("chats", dbSchema);

module.exports = Data;
