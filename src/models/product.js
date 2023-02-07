const mongoose = require("mongoose");
//product .. image, name, price, product id , posted_by , quantity, available_quantity
const dbSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please enter a title"],
  },
  price: {
    type: Number,
    required: [true, "please enter some price"],
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewUsers",
    required: true,
  },
  stock: {
    type: Number,
    required: [true, "please enter available stock"],
  },
  image: {
    type: String,
    required: true,
  },
});

const product = new mongoose.model("Product", dbSchema);

module.exports = product;
