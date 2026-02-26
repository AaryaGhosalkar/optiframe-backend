const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// PUBLIC - get products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADMIN ONLY - add product
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const product = new Product(req.body);
  const saved = await product.save();
  res.json(saved);
});

// ADMIN ONLY - delete
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ADMIN ONLY - update
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;