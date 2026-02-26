const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.rzp_test_SJjZfILcxAlVBJ,
  key_secret: process.env.j7AaJIg5mHxzxM3xzg0o8XJ0,
});

router.post("/create-order", async (req, res) => {
  console.log("CREATE ORDER HIT");
  console.log("Body:", req.body);
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

module.exports = router;