// TODO : Check out YelpCamp's way of accepting form data using arrays
const Contact = require('../models/Contact');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

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
      select: 'name role',
    });
  }

  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

// @desc       Create new contact, then redirect
// @route      POST /contacts
// @access     Private
const createContact = asyncHandler(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id;

  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    data: contact,
  });
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
  if (contact.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.name} is not authorized to access this contact`, 401));
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: contact });
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
  if (contact.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this contact`, 401));
  }

  contact.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
