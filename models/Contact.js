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
  },

  phone: {
    type: String,
  },

  address: {
    type: String,
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
