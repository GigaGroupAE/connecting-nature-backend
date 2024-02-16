const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DecorProduct",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const decorationSchema = new mongoose.Schema({
  categorie: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
  },
  price: {
    type: Number,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  products: {
    type: [productSchema],
    default: [],
  },
});

function arrayLimit(val) {
  return val.length <= 10;
}

const Decorations = mongoose.model("Decorations", decorationSchema);

module.exports = Decorations;
