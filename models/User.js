const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'This email ID already exists'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    required: [true, 'Please select a role'],
    enum: ['Member', 'Executive Director', 'Admin'],
    default: 'Member',
  },

  incharge: {
    type: String,
    enum: ['Adhihariharan', 'Anuja', 'Dhivya', 'Govind', 'Joann'],
    required: [
      function () {
        return this.role === 'Member';
      },
      'Please select your ED incharge',
    ],
  },

  resetPasswordToken: String,

  resetPasswordExpiration: Date,

  confirmEmailToken: String,

  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match input password to hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has verfied his/her email
UserSchema.methods.confirmEmail = async function () {
  return this.isEmailConfirmed;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiry date
  this.resetPasswordExpiration = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email confirm token
UserSchema.methods.generateEmailConfirmToken = function () {
  // Generate Email confirmation token
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to confirmEmail token
  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;

  return confirmTokenCombined;
};

UserSchema.methods.logger = function () {
  const formatDate = format(Date.now(), 'd MMMM yyyy h:m:s b');
  let data = `${formatDate} ${this.name} logged in.\n`;
  fs.appendFile('utils/logs/OAuthKeeperLogs.txt', data, (err) => {
    if (err) throw err;
  });
};

const User = mongoose.model('User', UserSchema, 'members');
module.exports = User;
