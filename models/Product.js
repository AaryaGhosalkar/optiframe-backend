const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  model3d: {
    type: String,
  },
  stock: {
    type: Number,
    default: 10,
  },
});

module.exports = mongoose.model("Product", productSchema);
