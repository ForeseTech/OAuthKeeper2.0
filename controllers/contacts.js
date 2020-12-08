const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc       Get all contacts
// @route      GET /contacts
// @access     Private
const getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

// @desc       Create new contact
// @route      POST /contacts
// @access     Private
const createContact = asyncHandler(async (req, res, next) => {
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
