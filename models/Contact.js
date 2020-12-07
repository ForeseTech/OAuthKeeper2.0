const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },

  company: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    trim: true,
    unique: [true, 'This contact already exists in the database'],
  },

  phone: {
    type: String,
    unique: [true, 'This contact already exists in the database'],
    required: [true, 'Please add a phone number'],
    match: [/^[1234567890]{10}|[1234567890](8)$/, 'Please add a valid phone number'],
  },

  address: {
    type: String,
    trim: true,
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
});

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
