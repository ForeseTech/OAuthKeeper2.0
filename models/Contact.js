// TODO : Add field for department preference
// TODO : Add field for number of HR's
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name'],
  },

  company: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    trim: true,
  },

  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^[1234567890]{10}|[1234567890](8)$/, 'Please add a valid phone number'],
  },

  address: {
    type: String,
    trim: true,
  },

  ownTransport: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: [
      'Not Called',
      'Wrong Number',
      'Called/Declined',
      'Called/Not Reachable',
      'Called/Postponed',
      'Called/Accepted',
      'Emailed/Awaiting Response',
      'Emailed/Declined',
      'Emailed/Confirmed',
    ],
    default: 'Not Called',
  },

  deptPreference: {
    type: [String],
    required: true,
    enum: ['AUT', 'BIO', 'CHE', 'CIV', 'CSE', 'ECE', 'EEE', 'INT', 'MEC'],
  },

  mode: {
    type: String,
    enum: ['Offline', 'Online'],
  },

  count: {
    type: Number,
    default: 1,
  },

  comments: {
    type: String,
    trim: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
