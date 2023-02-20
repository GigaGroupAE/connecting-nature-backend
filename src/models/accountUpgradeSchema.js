const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountUpgradeSchema = new Schema({
  //user who made the upgradation request
  user: {
    type: Schema.Types.ObjectId,
    ref: "NewUsers",
    required: true,
  },
  instagramProfile: {
    type: String,
    required: false,
  },
  facebookProfile: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("UpgradeRequests", accountUpgradeSchema);
