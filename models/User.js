const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
    // TODO : Check for password strength
  },

  role: {
    type: String,
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

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
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

const User = mongoose.model('User', UserSchema);
module.exports = User;
