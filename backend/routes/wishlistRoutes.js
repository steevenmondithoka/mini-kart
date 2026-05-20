// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

router.get('/',                  protect, getWishlist);
router.post('/:productId',       protect, addToWishlist);
router.delete('/clear',          protect, clearWishlist);
router.delete('/:productId',     protect, removeFromWishlist);

module.exports = router;