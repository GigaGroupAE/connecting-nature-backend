const mongoose = require("mongoose");

const savedProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewUsers",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decorations",
  },
});

const SavedProduct = mongoose.model("SavedProduct", savedProductSchema);

module.exports = SavedProduct;
