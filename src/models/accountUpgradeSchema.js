const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountUpgradeSchema = new Schema({
  //user who made the upgradation request
  user: {
    type: Schema.Types.ObjectId,
    ref: "NewUsers",
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  cnicFront: {
    type: String,
    required: false,
  },
  cnicBack: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  social: {
    type: String,
    required: false,
  },
  socialtwo: {
    type: String,
    required: false,
  },
  skype: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  addresstwo: {
    type: String,
    required: false,
  },
  utililtyBill: {
    type: String,
    required: false,
  },
  postal: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  orgType: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  employid: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: false,
  },
  companyType: {
    type: String,
    required: false,
  },
  companyAddress: {
    type: String,
    required: false,
  },
  companyCity: {
    type: String,
    required: false,
  },

  requestedRole: {
    type: String,
    required: true,
    enum: ["Celebrity", "Special Volunteer", "Vendor"],
  },
  status: {
    type: String,
    enum: ["approved", "declined", "pending"],
    default: "pending",
  },
  declinedReason: {
    type: String,
  },
});

module.exports = mongoose.model("UpgradeRequests", accountUpgradeSchema);
