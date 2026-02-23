const Product = require('../models/Product');

// GET /api/products
async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/products (admin)
async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid product data' });
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid product data' });
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/products/seed - insert sample products
async function seedProducts(req, res) {
  try {
    const existing = await Product.countDocuments();
    if (existing > 0) {
      return res
        .status(400)
        .json({ message: 'Products already seeded' });
    }

    const sample = [
      {
        name: 'NeoLite Hex Frame',
        brand: 'OptiFrame Studio',
        price: 2999,
        image:
          'https://images.pexels.com/photos/159837/glasses-specs-vision-eye-glasses-159837.jpeg?auto=compress&cs=tinysrgb&w=800',
        frameOverlay: '/frames/black.png',
        stock: 15,
        category: 'eyeglasses',
      },
      {
        name: 'Urban Focus Round',
        brand: 'CityLine',
        price: 2499,
        image:
          'https://images.pexels.com/photos/2155200/pexels-photo-2155200.jpeg?auto=compress&cs=tinysrgb&w=800',
        frameOverlay: '/frames/round.png',
        stock: 20,
        category: 'eyeglasses',
      },
      {
        name: 'SolarEdge Polarised',
        brand: 'SolarEdge',
        price: 3199,
        image:
          'https://images.pexels.com/photos/2913288/pexels-photo-2913288.jpeg?auto=compress&cs=tinysrgb&w=800',
        frameOverlay: '/frames/gold.png',
        stock: 18,
        category: 'sunglasses',
      },
      {
        name: 'Screen Shield Pro',
        brand: 'OptiGuard',
        price: 2799,
        image:
          'https://images.pexels.com/photos/19039656/pexels-photo-19039656/free-photo-of-glasses-on-table.jpeg?auto=compress&cs=tinysrgb&w=800',
        frameOverlay: '/frames/black.png',
        stock: 10,
        category: 'computer',
      },
      {
        name: 'Deep Focus Shield',
        brand: 'NightShift',
        price: 2899,
        image:
          'https://images.pexels.com/photos/4018563/pexels-photo-4018563.jpeg?auto=compress&cs=tinysrgb&w=800',
        frameOverlay: '/frames/round.png',
        stock: 12,
        category: 'computer',
      },
    ];

    const created = await Product.insertMany(sample);
    res.status(201).json({ inserted: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to seed products' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};

