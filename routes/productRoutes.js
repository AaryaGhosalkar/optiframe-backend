const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🔐 Admin Verification Middleware
const verifyAdmin = (req, res, next) => {
  const secret = req.headers["admin-secret"];

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

// ================= GET ALL PRODUCTS (PUBLIC) =================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ================= ADD PRODUCT (ADMIN ONLY) =================
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, price, image, model3d, stock } = req.body;

    const product = new Product({
      name,
      price,
      image,
      model3d,
      stock,
    });

    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// ================= DELETE PRODUCT (ADMIN ONLY) =================
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// ================= UPDATE PRODUCT (ADMIN ONLY) =================
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
});

module.exports = router;