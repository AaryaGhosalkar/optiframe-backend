const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
  fullName: String,
  phone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
},
paymentId: String,
});

module.exports = mongoose.model("Order", orderSchema);
