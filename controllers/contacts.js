const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');

// @desc       Get all contacts
// @route      GET /contacts
// @access     Private
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc       Create new contact
// @route      POST /contacts
// @access     Private
const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc       Update contact
// @route      PUT /contacts/:id
// @access     Private
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!contact) {
      return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
    }

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc       Delete contact
// @route      DELETE /contacts/:id
// @access     Private
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
