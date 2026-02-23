const Order = require('../models/Order');

// POST /api/orders
async function createOrder(req, res) {
  try {
    const { items, totalAmount, userId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = await Order.create({
      items,
      totalAmount,
      userId: userId || null,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

// GET /api/orders (admin & staff)
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email role');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// GET /api/orders/my (customer)
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// PUT /api/orders/:id/status (staff/admin)
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order' });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
};

