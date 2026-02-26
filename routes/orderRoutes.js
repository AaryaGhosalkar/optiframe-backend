const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ================= CREATE ORDER =================
router.post("/", async (req, res) => {
  try {
    const { customerEmail, items, totalAmount } = req.body;

    if (!customerEmail || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Reduce stock
    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      customerEmail,
      items,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// ================= GET ALL ORDERS =================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ================= UPDATE ORDER STATUS =================
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating order" });
  }
});

module.exports = router;