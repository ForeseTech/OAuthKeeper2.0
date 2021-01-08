const fs = require('fs');
const mongoose = require('mongoose');

const { format } = require('date-fns');

const ContactSchema = new mongoose.Schema(
  {
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
      match: [/^[1234567890]{10}|[1234567890]{8}$/, 'Please add a valid phone number'],
      unique: [true, 'Phone number already exists'],
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
  },
  { timestamps: true }
);

ContactSchema.post('save', function () {
  const formatDate = format(Date.now(), 'd MMMM yyyy h:m:s b');
  let data = `${formatDate} ${this.user} added ${this.name} (${this.company}) as a contact.\n`;
  fs.appendFile('utils/logs/OAuthKeeperLogs.txt', data, (err) => {
    if (err) throw err;
  });
});

const Contact = mongoose.model('Contact', ContactSchema, 'contacts');
module.exports = Contact;
