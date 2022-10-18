const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  phoneNumber: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  reactions: {
    type: Array,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  posts: {
    type: Array,
    required: true,
  },
  followers: {
    type: Array,
    required: true,
  },
  following: {
    type: Array,
    required: true,
  },
});

const NewUsers = new mongoose.model("NewUsers", dbSchema);

module.exports = NewUsers;
