const mongoose = require("mongoose");

const designTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const DesignType = mongoose.model("DesignType", designTypeSchema);

module.exports = DesignType;
