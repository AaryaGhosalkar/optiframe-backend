const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// CREATE ORDER (logged in user)
router.post("/", verifyToken, async (req, res) => {
  const { customerEmail, items, totalAmount } = req.body;

  for (const item of items) {
    const product = await Product.findById(item._id);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: "Stock issue" });
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const newOrder = new Order({
    customerEmail,
    items,
    totalAmount,
    status: "Pending"
  });

  await newOrder.save();
  res.json(newOrder);
});

// ADMIN ONLY - get all orders
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// ADMIN ONLY - update status
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

module.exports = router;