const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// 1. GET USER'S ORDERS (Specific path - MUST be above /:id)
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET ALL ORDERS (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE PAYMENT INTENT
router.post("/create-payment-intent", protect, async (req, res) => {
  const { amount } = req.body; // This will now be the total including GST

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: "inr", // Use 'inr' if using Rs.
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. SAVE ORDER
// @desc    Create new order
// @route   POST /api/orders
router.post("/", protect, async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    totalPrice, 
    paymentMethod, // This will be 'COD' or 'Stripe'
    paymentResult  // This will be null for COD
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
      paymentResult,
      // LOGIC FOR COD vs ONLINE
      isPaid: paymentMethod === 'Stripe', // If Stripe, it's already paid. If COD, it's false.
      paidAt: paymentMethod === 'Stripe' ? Date.now() : null,
      status: 'Processing',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// 5. STATUS UPDATES (Dynamic paths - keep these at bottom)
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (order.status === 'Delivered' || order.status === 'Shipped') {
        return res.status(400).json({ message: "Cannot cancel an order that has already been shipped." });
      }
      order.status = 'Cancelled';
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      if (status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In orderRoutes.js (Update Status)
router.put("/:id/status", protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status;
    if (req.body.status === 'Delivered') {
      order.isPaid = true; // Mark as paid once delivered for COD
      order.deliveredAt = Date.now(); // <--- THIS SAVES THE DELIVERY TIME
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  }
});

module.exports = router;