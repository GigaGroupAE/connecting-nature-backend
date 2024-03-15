const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
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
  },
  products: {
    type: [productSchema],
    default: [],
  },
  isSaved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewUsers",
    },
  ],
});

function arrayLimit(val) {
  return val.length <= 10;
}

const Decorations = mongoose.model("Decorations", decorationSchema);

module.exports = Decorations;
