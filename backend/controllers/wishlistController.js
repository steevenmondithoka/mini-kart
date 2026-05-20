// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');

// GET /api/wishlist — get logged-in user's wishlist (populated with product data)
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
    res.json(wishlist ? wishlist.items : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/wishlist/:productId — add a product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const alreadyAdded = wishlist.items.some(id => id.toString() === req.params.productId);
    if (!alreadyAdded) {
      wishlist.items.push(req.params.productId);
      await wishlist.save();
    }

    const populated = await wishlist.populate('items');
    res.json(populated.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/wishlist/:productId — remove a product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(id => id.toString() !== req.params.productId);
    await wishlist.save();

    const populated = await wishlist.populate('items');
    res.json(populated.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/wishlist — clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { returnDocument: 'after' }
    );
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};