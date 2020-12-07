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

// @desc       Update contact
// @route      PUT /contacts/:id
// @access     Private
const updateContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  res.status(200).json({ success: true, data: contact });
});

// @desc       Delete contact
// @route      DELETE /contacts/:id
// @access     Private
const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
