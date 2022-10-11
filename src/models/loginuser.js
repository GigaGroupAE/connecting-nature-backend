const express = require("express");
const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
});

const Data = new mongoose.model("Data", dbSchema);

module.exports = Data;
