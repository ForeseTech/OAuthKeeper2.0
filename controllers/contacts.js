// TODO : Check out YelpCamp's way of accepting form data using arrays
const fs = require('fs');
const Contact = require('../models/Contact');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { format } = require('date-fns');

// @desc       Display contacts according to the role of the user
// @route      GET /contacts
// @access     Private
const getContacts = asyncHandler(async (req, res, next) => {
  let contacts;

  // If user is member, show only their contacts
  if (req.user.role === 'Member') {
    contacts = await Contact.find({ user: req.user.id });
  }

  // Show contacts of all team members if user is an ED
  else if (req.user.role === 'Executive Director') {
    // Get the ID's of the members whose ED incharge is the logged in user
    const members = await User.find({ incharge: req.user.name }, '_id');

    // Get contacts of the team members whose ED incharge is the logged in user
    contacts = await Contact.find().where('user').in(members).populate({
      path: 'user',
      select: 'name',
    });
  }

  // Show all contacts if user is an Admin
  else if (req.user.role == 'Admin') {
    contacts = await Contact.find().populate({
      path: 'user',
      select: 'name incharge',
    });
  }

  res.status(200).render('contacts/dashboard.ejs', {
    contacts,
  });
});

// @desc       Display stats for each user
// @route      GET /contacts/statistics
// @access     Private
const getStatistics = asyncHandler(async (req, res, next) => {
  let statuses;
  // If user is member, show only their contacts
  if (req.user.role === 'Member') {
    statuses = await Contact.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  // Show contacts of all team members if user is an ED
  else if (req.user.role === 'Executive Director') {
    // Get the ID's of the members whose ED incharge is the logged in user
    const members = await User.find({ incharge: req.user.name }, '_id');

    memberIds = members.map((member) => member._id);
    statuses = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  // Show all contacts if user is an Admin
  else if (req.user.role == 'Admin') {
    statuses = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  res.status(200).render('contacts/statistics.ejs', {
    statuses,
  });
});

// @desc       Create new contact, then redirect
// @route      POST /contacts
// @access     Private
const createContact = asyncHandler(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id;

  Contact.findOne({ phone: req.body.phone }).then((contact) => {
    if (contact) {
      req.flash('error', 'Cannot create contact as this phone number already exists in the DB.');
      return res.redirect('/contacts');
    }
  });

  const contact = await Contact.create(req.body);

  const formatDate = format(Date.now(), 'd MMMM yyyy h:m:s b');
  let data = `${formatDate} ${req.body.user} added ${contact.name} (${contact.company}) as a contact.\n`;
  fs.appendFile('utils/logs/OAuthKeeperLogs.txt', data, (err) => {
    if (err) throw err;
  });

  req.flash('success', 'New Contact Successfully Added');
  res.redirect('/contacts');
});

// @desc       Update a contact, then redirect
// @route      PUT /contacts/:id
// @access     Private
const updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  // Update contact only if contact belongs to the logged in user or if user is admin
  if (contact.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`User ${req.user.name} is not authorized to access this contact`, 401));
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  const formatDate = format(Date.now(), 'd MMMM yyyy h:m:s b');
  let data = `${formatDate} ${req.body.user} updated ${contact.name} (${contact.company}) in his/her contacts\n`;
  fs.appendFile('utils/logs/OAuthKeeperLogs.txt', data, (err) => {
    if (err) throw err;
  });

  req.flash('success', 'Contact Successfully Updated');
  res.redirect('/contacts');
});

// @desc       Delete a contact, then redirect
// @route      DELETE /contacts/:id
// @access     Private
const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  // Delete contact only if contact belongs to the logged in user or if user is admin
  if (contact.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this contact`, 401));
  }

  contact.remove();

  req.flash('success', 'Contact Successfully Deleted');
  res.redirect('/contacts');
});

module.exports = {
  getContacts,
  getStatistics,
  createContact,
  updateContact,
  deleteContact,
};
