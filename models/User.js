const mongoose = require('mongoose');

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
    enum: ['member', 'ED', 'admin'],
    default: 'member',
  },

  incharge: {
    type: String,
    enum: ['Adhihariharan', 'Anuja', 'Dhivya', 'Govind', 'Joann'],
    required: [
      () => {
        this.role === 'member';
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

const User = mongoose.model('User', UserSchema);
module.exports = User;
