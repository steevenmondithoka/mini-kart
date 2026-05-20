const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

router.post('/login',                    authUser);
router.post('/register',                 registerUser);
router.get('/profile',   protect,        getUserProfile);
router.put('/profile',   protect,        updateUserProfile);
router.post('/forgot-password',          forgotPassword);
router.put('/reset-password/:token',     resetPassword);

module.exports = router;