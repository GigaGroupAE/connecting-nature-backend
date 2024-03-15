const mongoose = require("mongoose");

const decorProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
  },
});

const DecorProduct = mongoose.model("DecorProduct", decorProductSchema);

module.exports = DecorProduct;
