const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const userSchema = mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, required: true, default: false },

  // ── Profile fields ────────────────────────────────────────────
  phone:  { type: String, default: '' },
  avatar: { type: String, default: '' },
  address: {
    line1:      { type: String, default: '' },
    line2:      { type: String, default: '' },
    city:       { type: String, default: '' },
    state:      { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country:    { type: String, default: 'India' },
  },

  // ── Password reset ────────────────────────────────────────────
  resetPasswordToken:   { type: String },
  resetPasswordExpire:  { type: Date },

}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a reset token, store its hash in DB, return raw token to send via email
userSchema.methods.getResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken  = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return rawToken;
};

// Callback style — works in all Mongoose versions
// Change the hook to an async function and remove (next)
userSchema.pre('save', async function () {
  // If password isn't modified, just return (Mongoose waits for the promise to resolve)
  if (!this.isModified('password')) {
    return;
  }

  try {
    // bcryptjs supports promises if no callback is provided
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    // In async hooks, you throw errors instead of calling next(err)
    throw new Error(err);
  }
});
module.exports = mongoose.model('User', userSchema);