const mongoose = require("mongoose");
const { Schema } = mongoose;

const archivesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "NewUsers",
    requird: true,
    default: null,
  },
  type: {
    type: String, // post group etc
    required: true,
  },
  data: {},
});

module.exports = mongoose.model("Archives", archivesSchema);
