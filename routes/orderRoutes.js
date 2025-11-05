const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Mongoose model

// Save new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Get orders by email (or later use auth user ID)
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ "customerInfo.email": email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});


// Get all orders (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});






module.exports = router;
