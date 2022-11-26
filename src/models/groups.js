const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    required: true,//name,type,photo,phone
  },
  type: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
  groupPic: {
    type: String,
    required: true,
  },
});

const Data = new mongoose.model("groups", dbSchema);

module.exports = Data;
