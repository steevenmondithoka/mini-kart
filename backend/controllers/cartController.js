// controllers/cartController.js
const Cart = require('../models/Cart');

// GET /api/cart  — get the logged-in user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart  — add or increment an item
exports.addToCart = async (req, res) => {
  const { productId, name, image, price, qty = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find(i => i.product.toString() === productId);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ product: productId, name, image, price, qty });
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/:productId  — update qty of one item
exports.updateCartItem = async (req, res) => {
  const { qty } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (qty <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/:productId  — remove one item
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart  — clear entire cart (called after order placed)
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { returnDocument: 'after' }
    );
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};