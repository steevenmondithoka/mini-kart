const crypto  = require('crypto');
const User    = require('../models/User');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const { sendResetEmail } = require('../utils/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── Login ─────────────────────────────────────────────────────────
exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id:     user._id,
      name:    user.name,
      email:   user.email,
      isAdmin: user.isAdmin,
      phone:   user.phone,
      avatar:  user.avatar,
      address: user.address,
      token:   generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// ── Register ──────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id:     user._id,
      name:    user.name,
      email:   user.email,
      isAdmin: user.isAdmin,
      phone:   user.phone,
      avatar:  user.avatar,
      address: user.address,
      token:   generateToken(user._id),
    });
  }
};

// ── GET /api/users/profile ────────────────────────────────────────
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/users/profile ────────────────────────────────────────
exports.updateUserProfile = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.name   !== undefined) updateFields.name   = req.body.name;
    if (req.body.phone  !== undefined) updateFields.phone  = req.body.phone;
    if (req.body.avatar !== undefined) updateFields.avatar = req.body.avatar;

    if (req.body.address) {
      if (req.body.address.line1      !== undefined) updateFields['address.line1']      = req.body.address.line1;
      if (req.body.address.line2      !== undefined) updateFields['address.line2']      = req.body.address.line2;
      if (req.body.address.city       !== undefined) updateFields['address.city']       = req.body.address.city;
      if (req.body.address.state      !== undefined) updateFields['address.state']      = req.body.address.state;
      if (req.body.address.postalCode !== undefined) updateFields['address.postalCode'] = req.body.address.postalCode;
      if (req.body.address.country    !== undefined) updateFields['address.country']    = req.body.address.country;
    }

    if (req.body.password && req.body.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id:     updated._id,
      name:    updated.name,
      email:   updated.email,
      isAdmin: updated.isAdmin,
      phone:   updated.phone,
      avatar:  updated.avatar,
      address: updated.address,
      token:   generateToken(updated._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/users/forgot-password ──────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Respond immediately — don't make user wait
    res.json({ message: 'If that email exists, a reset link has been sent.' });

    // If no user, stop here (response already sent)
    if (!user) return;

    // Generate token and save to DB
    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry      = Date.now() + 15 * 60 * 1000; // 15 minutes

    await User.findByIdAndUpdate(user._id, {
      $set: {
        resetPasswordToken:  hashedToken,
        resetPasswordExpire: expiry,
      },
    });

    // Send email in background — user already got the response
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    sendResetEmail(user.email, user.name, resetUrl)
      .catch(err => console.error('Email send failed:', err));

  } catch (err) {
    console.error('Forgot password error:', err);
    // Only send error if response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  }
};

// ── PUT /api/users/reset-password/:token ─────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const salt       = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(user._id, {
      $set: {
        password:            hashedPass,
        resetPasswordToken:  null,
        resetPasswordExpire: null,
      },
    });

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: err.message });
  }
};